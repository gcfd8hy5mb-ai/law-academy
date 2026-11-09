// Pure, non-deployed migration planner for Law Academy cloud snapshots.
// This file performs no Firebase writes and does not touch localStorage.
export const LEGACY_KEYS=Object.freeze([
 'law-academy-progress-v1','law-academy-exam-results-v1','law-academy-capstone-v1',
 'law-academy-oral-defense-v1','law-academy-final-essays-v1','law-academy-final-review-v1',
 'law-academy-writing-v1','law-academy-rubric-v1','law-academy-sim-v1',
 'law-academy-sim-branches-v1','law-academy-reasoning-v1','law-academy-research-capstone-v1',
 'law-academy-capstone-audit-v1','law-academy-level2-v1','law-academy-level2-exam-v1',
 'law-academy-level2-exam-timing-v1','law-academy-level3-v1'
]);
export const LEVEL4_KEY='law-academy-level4-v1';
export const MIGRATION_KEYS=Object.freeze([...LEGACY_KEYS,LEVEL4_KEY]);
const FORBIDDEN=new Set(['__proto__','prototype','constructor']);
const isRecord=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function safeRecord(value,context){
 if(!isRecord(value))throw Error(context+' must be an object');
 for(const k of Object.keys(value))if(FORBIDDEN.has(k))throw Error(context+' has a forbidden key');
 return value;
}
function parseStored(v,key){
 if(v===null)return null;
 if(typeof v!=='string')throw Error('Invalid stored value type: '+key);
 if(v.length>1250000)throw Error('Stored value too large: '+key);
 try{const parsed=JSON.parse(v);return parsed}catch{throw Error('Invalid JSON storage value: '+key)}
}
function cleanRecord(object){
 const o=Object.create(null);
 for(const k of Object.keys(object))o[k]=object[k];
 return o;
}
const canon=x=>Array.isArray(x)?x.map(canon):isRecord(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canon(x[k])])):x;
const equivalent=(a,b)=>JSON.stringify(canon(a))===JSON.stringify(canon(b));
export function normalizeSnapshot(input){
 const raw=typeof input==='string'?JSON.parse(input):input;
 safeRecord(raw,'Snapshot');
 if(Object.keys(raw).some(k=>!MIGRATION_KEYS.includes(k)))throw Error('Unexpected snapshot key');
 const output=Object.create(null);
 for(const k of MIGRATION_KEYS)output[k]=Object.prototype.hasOwnProperty.call(raw,k)?raw[k]:null;
 for(const k of MIGRATION_KEYS)parseStored(output[k],k);
 if(output[LEVEL4_KEY]!==null){
  const parsed=parseStored(output[LEVEL4_KEY],LEVEL4_KEY);
  safeRecord(parsed,'Level 4 progress');
  for(const [id,value] of Object.entries(parsed)){
   if(!/^L4-[1-7]-(10|[1-9])$/.test(id))throw Error('Unexpected Level 4 lesson id: '+id);
   safeRecord(value,'Level 4 lesson progress');
   for(const k of Object.keys(value))if(!['draft','lastAnswer','practiceCorrect','advancedQuiz2026Choice','advancedQuiz2026Correct'].includes(k))throw Error('Unexpected Level 4 field: '+k);
   if(Object.hasOwn(value,'draft')&&typeof value.draft!=='string')throw Error('Invalid Level 4 draft');
   if(Object.hasOwn(value,'lastAnswer')&&(!Number.isInteger(value.lastAnswer)||value.lastAnswer<0||value.lastAnswer>2))throw Error('Invalid Level 4 quiz choice');
   if(Object.hasOwn(value,'practiceCorrect')&&typeof value.practiceCorrect!=='boolean')throw Error('Invalid Level 4 practice result');
   if(Object.hasOwn(value,'advancedQuiz2026Choice')&&(!Number.isInteger(value.advancedQuiz2026Choice)||value.advancedQuiz2026Choice<0||value.advancedQuiz2026Choice>2))throw Error('Invalid Level 4 advanced quiz choice');
   if(Object.hasOwn(value,'advancedQuiz2026Correct')&&typeof value.advancedQuiz2026Correct!=='boolean')throw Error('Invalid Level 4 advanced quiz result');
  }
 }
 return output;
}
// Conservative: no nonempty value is replaced. Overlap with different data stops
// the whole migration. Existing legacy keys receive the same protection.
export function planSnapshotMerge(localInput,cloudInput){
 const local=normalizeSnapshot(localInput),cloud=normalizeSnapshot(cloudInput);
 const merged=Object.create(null),conflicts=[],additions=[];
 for(const k of MIGRATION_KEYS){
  const a=local[k],b=cloud[k];
  if(a===null){merged[k]=b;if(b!==null)additions.push({key:k,source:'cloud'});continue}
  if(b===null){merged[k]=a;additions.push({key:k,source:'device'});continue}
  const av=parseStored(a,k),bv=parseStored(b,k);
  if(equivalent(av,bv)){merged[k]=a;continue}
  if(!isRecord(av)||!isRecord(bv)){conflicts.push({key:k,reason:'incompatible values'});continue}
  safeRecord(av,k+' device data');safeRecord(bv,k+' cloud data');
  const out=cleanRecord(av);
  for(const [id,val] of Object.entries(bv)){
   if(!Object.hasOwn(out,id)){if(FORBIDDEN.has(id))throw Error('Unsafe progress field');out[id]=val;additions.push({key:k,entry:id,source:'cloud'})}
   else if(!equivalent(out[id],val))conflicts.push({key:k,entry:id,reason:'different existing entry'});
  }
  for(const id of Object.keys(av))if(!Object.hasOwn(bv,id))additions.push({key:k,entry:id,source:'device'});
  if(!conflicts.some(c=>c.key===k))merged[k]=JSON.stringify(out);
 }
 if(conflicts.length)return {safe:false,conflicts,additions:[],merged:null};
 return {safe:true,conflicts:[],additions,merged};
}
export function encodeMigratedSnapshot(snapshot){
 const normalized=normalizeSnapshot(snapshot);
 const output=Object.fromEntries(MIGRATION_KEYS.map(k=>[k,normalized[k]]));
 return JSON.stringify(output);
}

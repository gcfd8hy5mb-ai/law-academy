// Strict, standalone merge plan for seven Level 4 practical finals.
// Pure code, no network, no disk writes. Changing an existing exam entry on two devices blocks merge.
export const FINALS_KEY='law-academy-level4-finals-v1';
export const FINAL_IDS=Object.freeze(Array.from({length:7},(_,i)=>'L4-'+(i+1)+'-FINAL2'));
const forbidden=new Set(['__proto__','constructor','prototype']);
const record=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const canon=v=>Array.isArray(v)?v.map(canon):record(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
const same=(a,b)=>JSON.stringify(canon(a))===JSON.stringify(canon(b));
export function normalizeFinals(raw){
 if(raw===null||raw===undefined)return null;
 if(typeof raw!=='string'||raw.length>800000)throw Error('Finals backup missing or too large');
 let data;try{data=JSON.parse(raw)}catch{throw Error('Invalid finals backup JSON')}
 if(!record(data))throw Error('Finals backup must be an object');
 for(const [id,value] of Object.entries(data)){
  if(forbidden.has(id)||!FINAL_IDS.includes(id))throw Error('Unexpected practical final record: '+id);
  if(!record(value))throw Error('Invalid practical final entry '+id);
  for(const field of Object.keys(value))if(forbidden.has(field))throw Error('Unsafe practical final field');
  if(Object.hasOwn(value,'draft')&&(typeof value.draft!=='string'||value.draft.length>160000))throw Error('Invalid final written response '+id);
  if(Object.hasOwn(value,'snapshots')&&(!Array.isArray(value.snapshots)||value.snapshots.length>8||value.snapshots.some(s=>!record(s)||typeof s.draft!=='string'||s.draft.length>160000)))throw Error('Invalid final snapshot history '+id);
  if(Object.hasOwn(value,'ratings')&&(!Array.isArray(value.ratings)||value.ratings.length!==6||value.ratings.some(x=>x!==null&&(!Number.isInteger(x)||x<0||x>100))))throw Error('Invalid final self scores '+id);
 }
 return data;
}
export function mergeFinals(localRaw,remoteRaw){
 const a=normalizeFinals(localRaw),b=normalizeFinals(remoteRaw);
 const out=Object.create(null),conflicts=[],additions=[];
 for(const id of FINAL_IDS){
  const hasA=a&&Object.hasOwn(a,id),hasB=b&&Object.hasOwn(b,id);
  if(hasA&&hasB&&!same(a[id],b[id])){conflicts.push(id);continue}
  if(hasA)out[id]=a[id];else if(hasB){out[id]=b[id];additions.push(id)}
 }
 // Cloud needs local-only exam entries; these do not count as imports but do count as changes.
 const deviceOnly=FINAL_IDS.filter(id=>a&&Object.hasOwn(a,id)&&(!b||!Object.hasOwn(b,id)));
 const merged=conflicts.length?null:JSON.stringify(out);
 if(merged&&merged.length>800000)throw Error('Combined finals exceed safe cloud document limit');
 return {safe:conflicts.length===0,conflicts,additions,deviceOnly,merged,identical:same(a||{},b||{})};
}

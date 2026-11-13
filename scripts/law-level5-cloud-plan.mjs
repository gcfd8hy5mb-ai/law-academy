/* Level 5 manually controlled backup planner. Does not access Firebase or localStorage.
 * Treat each lesson/diagnostic record as indivisible: conflicting changes fail closed.
 */
export const LEVEL5_KEY='law-academy-level5-v1';
export const LEVEL5_LIMIT=800000;
export function readLevel5(raw){
 if(raw===null||raw===undefined||raw==='')return {};
 if(typeof raw!=='string'||raw.length>LEVEL5_LIMIT)throw Error('Level 5 snapshot size or format is invalid');
 let data;try{data=JSON.parse(raw)}catch{throw Error('Level 5 snapshot JSON invalid')}
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Level 5 snapshot must be an object');
 if(Object.keys(data).length>1500)throw Error('Level 5 snapshot has too many records');
 for(const [id,value] of Object.entries(data)){
  if(!/^(L5-[1-7]-[1-9][0-9]*|L5-DX-[A-Za-z0-9_-]+)$/.test(id))throw Error('Unknown Level 5 record ID: '+id);
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid Level 5 record: '+id);
  if(JSON.stringify(value).length>100000)throw Error('Level 5 record exceeds safety limit: '+id);
 }
 return data;
}
function stable(value){
 if(Array.isArray(value))return value.map(stable);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,stable(v)]));
 return value;
}
const same=(a,b)=>JSON.stringify(stable(a))===JSON.stringify(stable(b));
export function planLevel5Merge(deviceRaw,cloudRaw){
 const device=readLevel5(deviceRaw),cloud=readLevel5(cloudRaw);
 const merged={...cloud},conflicts=[],deviceOnly=[],cloudOnly=[];
 for(const [id,value] of Object.entries(device)){
  if(!Object.hasOwn(cloud,id)){merged[id]=value;deviceOnly.push(id)}
  else if(!same(value,cloud[id]))conflicts.push(id);
 }
 for(const id of Object.keys(cloud))if(!Object.hasOwn(device,id))cloudOnly.push(id);
 const raw=JSON.stringify(merged);
 if(raw.length>LEVEL5_LIMIT)throw Error('Merged Level 5 backup exceeds safe size');
 return {safe:conflicts.length===0,conflicts,deviceOnly,cloudOnly,identical:conflicts.length===0&&!deviceOnly.length&&!cloudOnly.length,mergedRaw:conflicts.length?null:raw};
}
export function validateLevel5Cloud(data){
 if(!data||data.academy!=='law'||data.snapshotType!=='level5'||data.schemaVersion!==1||!Number.isSafeInteger(data.revision)||data.revision<1||typeof data.raw!=='string')throw Error('Unknown Level 5 cloud snapshot; no changes made');
 readLevel5(data.raw);
 return {revision:data.revision,raw:data.raw};
}

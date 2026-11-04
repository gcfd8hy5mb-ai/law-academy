// Simulated DOM and Firestore acceptance tests for the optional Level 4 bridge.
// Does not connect to or write actual Firebase.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {planSnapshotMerge,LEGACY_KEYS,LEVEL4_KEY,normalizeSnapshot} from './law-cloud-migration-plan.mjs';
const original=readFileSync(new URL('../law-level4-cloud.js',import.meta.url),'utf8');
const script=original.replace(/^import .*$/gm,'').replace(/^export /gm,'')+'\nthis.launch=openLevel4Cloud;';
class Node {
 constructor(tag){this.tag=tag;this.children=[];this.events={};this.textContent='';this.style={};this.dataset={};}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=[...children]}
 setAttribute(name,value){this[name]=value}
 addEventListener(name,fn){this.events[name]=fn}
 focus(){}
 click(){return this.events.click?.()}
}
async function scenario({device=null,cloud=null,denyRead=false}={}){
 const documents=new Map(),initial=cloud?{level:4,schemaVersion:1,revision:cloud.revision??1,raw:cloud.raw,updatedAt:null}:null;
 if(initial)documents.set('level4-v1',initial);
 const storage=new Map(device===null?[]:[[LEVEL4_KEY,device]]),downloads=[],alerts=[],confirmations=[];
 const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const document={body:new Node('body'),createElement:tag=>new Node(tag)};
 const auth={currentUser:{uid:'test-user',emailVerified:true}};
 const getDoc=async()=>{if(denyRead){const error=Error('Missing or insufficient permissions');error.code='permission-denied';throw error}return {exists:()=>documents.has('level4-v1'),data:()=>documents.get('level4-v1')};};
 const runTransaction=async(_db,fn)=>{
  let writes=[];
  const tx={get:async()=>getDoc(),set:(_ref,value)=>writes.push(value)};
  const result=await fn(tx);
  for(const value of writes)documents.set('level4-v1',value);
  return result;
 };
 const context={document,auth,localStorage,alert:x=>alerts.push(x),confirm:x=>{confirmations.push(x);return true},
  doc:(_db,...path)=>{assert.equal(path.at(-1),'level4-v1');return {path}},getDoc,runTransaction,
  serverTimestamp:()=> 'mock-server-time',planSnapshotMerge,LEGACY_KEYS,LEVEL4_KEY,normalizeSnapshot,
  Blob:class{constructor(parts){this.parts=parts}},URL:{createObjectURL:()=> 'blob:mock',revokeObjectURL:()=>{}},
  setTimeout:fn=>{},Date,JSON,Error,Object,Array,Number,String,RegExp,console};
 runInNewContext(script,context);
 context.launch({auth,db:{}});
 const dialog=document.body.children.at(-1);
 const controls=()=>dialog.children.find(x=>x.tag==='div').children;
 const press=async title=>{
  const match=controls().find(x=>x.textContent===title);
  assert.ok(match,'Missing button '+title);
  await match.click();
 };
 const status=()=>dialog.children.find(x=>x.role==='status')?.textContent;
 return {press,documents,storage,downloads,alerts,confirmations,status,auth,dialog};
}
const d=entries=>JSON.stringify(entries);
let passed=0;
function pass(name){passed++;console.log('PASS: '+name)}
{
 const x=await scenario({device:d({'L4-1-1':{draft:'Local legal memo'}})});
 await x.press('Read and compare (no changes)');
 assert.match(x.status(),/NOT CREATED/);
 assert.ok(!x.dialog.children.find(n=>n.tag==='div').children.some(b=>b.textContent==='Merge nonconflicting copies (confirm first)'));
 assert.equal(x.documents.size,0);
 await x.press('Create first Level 4 cloud copy (confirm first)');
 assert.equal(x.documents.get('level4-v1').revision,1);
 assert.match(x.status(),/CREATED \(revision 1\)/);
 assert.equal(x.documents.get('level4-v1').raw,d({'L4-1-1':{draft:'Local legal memo'}}));
 pass('First create uses isolated Level 4 document and explicit approval');
}
{
 const x=await scenario({device:d({'L4-1-1':{draft:'Phone memo'}}),cloud:{raw:d({'L4-1-1':{draft:'Computer memo'}})}});
 await x.press('Read and compare (no changes)');
 assert.match(x.status(),/CONFLICT/);
 await x.press('Merge nonconflicting copies (confirm first)');
 assert.equal(x.documents.get('level4-v1').revision,1);
 assert.equal(x.storage.get(LEVEL4_KEY),d({'L4-1-1':{draft:'Phone memo'}}));
 pass('Conflicting same-lesson writing blocks both writes');
}
{
 const x=await scenario({device:d({'L4-1-1':{draft:'Phone memo'}}),cloud:{raw:d({'L4-2-1':{draft:'Laptop memo'}})}});
 await x.press('Read and compare (no changes)');
 await x.press('Merge nonconflicting copies (confirm first)');
 assert.equal(x.documents.get('level4-v1').revision,2);
 const cloud=JSON.parse(x.documents.get('level4-v1').raw);
 assert.equal(cloud['L4-1-1'].draft,'Phone memo');
 assert.equal(cloud['L4-2-1'].draft,'Laptop memo');
 assert.equal(JSON.parse(x.storage.get(LEVEL4_KEY))['L4-2-1'].draft,'Laptop memo');
 pass('Disjoint Level 4 drafts merge and preserve both copies');
}
{
 const x=await scenario({device:d({'L4-1-1':{draft:'A'}}),cloud:{raw:d({'L4-2-1':{draft:'B'}})}});
 await x.press('Read and compare (no changes)');
 x.storage.set(LEVEL4_KEY,d({'L4-1-1':{draft:'A changed'}}));
 await x.press('Merge nonconflicting copies (confirm first)');
 assert.equal(x.documents.get('level4-v1').revision,1);
 pass('Local change after comparison prevents upload');
}
{
 const x=await scenario({device:d({'L4-1-1':{draft:'A'}}),cloud:{raw:d({'L4-2-1':{draft:'B'}})}});
 await x.press('Read and compare (no changes)');
 x.documents.set('level4-v1',{level:4,schemaVersion:1,revision:2,raw:d({'L4-2-1':{draft:'Cloud updated'}})});
 await x.press('Merge nonconflicting copies (confirm first)');
 assert.equal(x.documents.get('level4-v1').revision,2);
 assert.equal(JSON.parse(x.documents.get('level4-v1').raw)['L4-2-1'].draft,'Cloud updated');
 pass('Cloud revision changes prevent stale transactional overwrite');
}
{
 const x=await scenario({device:d({'L4-1-1':{draft:'Safe local essay'}}),denyRead:true});
 await x.press('Test Level 4 Firebase read access');
 assert.match(x.status(),/permission-denied/);
 assert.equal(x.documents.size,0);
 assert.equal(x.storage.get(LEVEL4_KEY),d({'L4-1-1':{draft:'Safe local essay'}}));
 pass('Read-only permission rejection reports the Firestore error and preserves device writing');
}
console.log('PASS: '+passed+' simulated Level 4 bridge operations. This is not actual Firebase rules or iPhone browser testing.');

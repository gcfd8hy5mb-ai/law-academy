// Simulated Firestore acceptance test for manual practical-final cloud backup.
// Does not access production Firebase, authentication, or user data.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {FINALS_KEY,normalizeFinals,mergeFinals} from './law-finals-cloud-plan.mjs';
const source=readFileSync(new URL('../law-level4-finals-cloud.js',import.meta.url),'utf8').replace(/^import .*$/gm,'').replace(/^export /gm,'')+'\nthis.openFinals=openLevel4FinalsCloud;';
class Element{
 constructor(tag){this.tag=tag;this.textContent='';this.children=[];this.attrs={};this.style={};this.events={};this.download='';}
 append(...els){this.children.push(...els)}
 replaceChildren(...els){this.children=[...els]}
 setAttribute(k,v){this.attrs[k]=v}
 addEventListener(k,fn){this.events[k]=fn}
 focus(){}
 click(){return this.events.click?.()}
}
const S=o=>JSON.stringify(o);
async function scenario(device,cloud=null,denyRead=false){
 const storage=new Map(device===null?[]:[[FINALS_KEY,device]]),remote=new Map(),requests=[],prompts=[];
 if(cloud)remote.set('finals-v1',{academy:'law',snapshotType:'level4-finals',schemaVersion:1,revision:cloud.revision||1,raw:cloud.raw});
 const auth={currentUser:{uid:'fake-review-user',emailVerified:true}};
 const panelRoot=new Element('body');
 const document={body:panelRoot,createElement:tag=>new Element(tag)};
 const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
 const getDoc=async()=>{if(denyRead)throw Object.assign(Error('permission denied'),{code:'permission-denied'});return {exists:()=>remote.has('finals-v1'),data:()=>remote.get('finals-v1')}};
 const runTransaction=async(_,fn)=>{
  const changes=[];
  const tx={get:async ref=>getDoc(),set:(ref,value)=>{requests.push({path:ref.path,value});changes.push(value)}};
  const outcome=await fn(tx);for(const x of changes)remote.set('finals-v1',x);return outcome;
 };
 const ctx={document,localStorage,auth,db:{},doc:(_db,...path)=>({path}),getDoc,runTransaction,serverTimestamp:()=>123,
 FINALS_KEY,normalizeFinals,mergeFinals,
 confirm:msg=>{prompts.push(msg);return true},alert:()=>{},Blob:class{},URL:{createObjectURL:()=> 'blob:mock',revokeObjectURL:()=>{}},
 setTimeout:()=>{},Date,console};
 runInNewContext(source,ctx);
 ctx.openFinals({auth,db:ctx.db});
 const panel=panelRoot.children[0],buttons=()=>panel.children.find(x=>x.tag==='div').children;
 const press=async text=>{
  const button=buttons().find(b=>b.textContent===text);assert.ok(button,'Missing button '+text);
  await button.click();
 };
 const status=()=>panel.children.find(x=>x.attrs.role==='status').textContent;
 return {press,status,remote,storage,requests,prompts,auth};
}
let count=0;
{
 const x=await scenario(S({'L4-1-FINAL2':{draft:'Phone answer'}}));
 await x.press('Compare finals copies (read-only)');
 assert.match(x.status(),/DOES NOT EXIST/);
 await x.press('Create first finals cloud copy');
 assert.equal(x.remote.get('finals-v1').revision,1);
 assert.equal(JSON.parse(x.remote.get('finals-v1').raw)['L4-1-FINAL2'].draft,'Phone answer');
 assert.deepEqual([...x.requests[0].path],['users','fake-review-user','academies','law','snapshots','finals-v1']);
 assert.match(x.prompts[0],/SAVED/);count++;
}
{
 const x=await scenario(S({'L4-1-FINAL2':{draft:'Phone'}}),{raw:S({'L4-1-FINAL2':{draft:'Computer'}})});
 await x.press('Compare finals copies (read-only)');
 assert.match(x.status(),/CONFLICT/);
 await x.press('Merge nonconflicting finals');
 assert.equal(x.requests.length,0);
 assert.equal(x.storage.get(FINALS_KEY),S({'L4-1-FINAL2':{draft:'Phone'}}));count++;
}
{
 const x=await scenario(S({'L4-1-FINAL2':{draft:'Phone'}}),{raw:S({'L4-2-FINAL2':{draft:'Desktop'}})});
 await x.press('Compare finals copies (read-only)');
 await x.press('Merge nonconflicting finals');
 assert.equal(x.remote.get('finals-v1').revision,2);
 assert.equal(JSON.parse(x.storage.get(FINALS_KEY))['L4-2-FINAL2'].draft,'Desktop');
 assert.equal(JSON.parse(x.remote.get('finals-v1').raw)['L4-1-FINAL2'].draft,'Phone');count++;
}
{
 const x=await scenario(S({'L4-1-FINAL2':{draft:'Original'}}),{raw:S({'L4-2-FINAL2':{draft:'Other'}})});
 await x.press('Compare finals copies (read-only)');
 x.storage.set(FINALS_KEY,S({'L4-1-FINAL2':{draft:'Edited after reading'}}));
 await x.press('Merge nonconflicting finals');
 assert.equal(x.remote.get('finals-v1').revision,1);
 assert.equal(x.requests.length,0);count++;
}
{
 const x=await scenario(S({'L4-1-FINAL2':{draft:'Original'}}),{raw:S({'L4-2-FINAL2':{draft:'Other'}})});
 await x.press('Compare finals copies (read-only)');
 x.remote.set('finals-v1',{academy:'law',snapshotType:'level4-finals',schemaVersion:1,revision:2,raw:S({'L4-2-FINAL2':{draft:'Cloud edited'}})});
 await x.press('Merge nonconflicting finals');
 assert.equal(x.remote.get('finals-v1').revision,2);
 assert.equal(x.requests.length,0);count++;
}
{
 const x=await scenario(S({'L4-1-FINAL2':{draft:'No change'}}),null,true);
 await x.press('Compare finals copies (read-only)');
 assert.match(x.status(),/permission-denied/);
 assert.equal(x.requests.length,0);count++;
}
assert.equal(count,6);
console.log('PASS — six simulated finals-Firebase cases: first upload, conflicts, disjoint merge, local/cloud concurrency and denied permissions');
console.log('NOT TESTED — actual Firebase security rules, verified account, device cross-sync or physical iPhone');

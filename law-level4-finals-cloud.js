/* Separate manual Firestore cloud snapshot for seven practical-final essays.
 * Never writes legacy Law progress or lesson-level Level 4 backup. No automatic upload.
 */
import {doc,getDoc,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {FINALS_KEY,normalizeFinals,mergeFinals} from './scripts/law-finals-cloud-plan.mjs';
const LIMIT=800000;
const button=(label,action)=>{const el=document.createElement('button');el.type='button';el.textContent=label;el.style.cssText='margin:5px;padding:10px;border-radius:8px;border:1px solid #c5ad77;background:#c5ad77;color:#172023;font-weight:700';el.addEventListener('click',action);return el};
const p=text=>{const el=document.createElement('p');el.textContent=text;return el};
const current=()=>{const raw=localStorage.getItem(FINALS_KEY);normalizeFinals(raw);return raw};
function backup(device,remote){
 const data={format:'law-academy-level4-finals-backup-2026',exportedAt:new Date().toISOString(),device,cloud:remote};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='law-academy-practical-finals-both-copies.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),20000);
}
function readRemote(data){
 if(!data||data.academy!=='law'||data.snapshotType!=='level4-finals'||data.schemaVersion!==1||!Number.isSafeInteger(data.revision)||data.revision<1)throw Error('Unrecognized cloud finals snapshot');
 if(typeof data.raw!=='string')throw Error('Cloud final records not recognized');
 normalizeFinals(data.raw);
 return {revision:data.revision,raw:data.raw};
}
export function openLevel4FinalsCloud({auth,db}){
 if(!auth.currentUser?.emailVerified){alert('Sign in with a verified Law Academy account first.');return}
 const uid=auth.currentUser.uid,ref=doc(db,'users',uid,'academies','law','snapshots','finals-v1');
 const active=()=>auth.currentUser?.uid===uid&&auth.currentUser.emailVerified;
 const panel=document.createElement('section');
 panel.style.cssText='position:fixed;z-index:100020;inset:5% 5% auto 5%;max-height:85vh;max-width:600px;overflow:auto;margin:auto;padding:18px;border-radius:12px;border:1px solid #bea46c;background:#152021;color:#f1e9d9;box-shadow:0 12px 30px #000a;font:14px system-ui';
 panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Practical finals manual cloud backup');
 const heading=document.createElement('h2');heading.textContent='Seven Practical Finals · Manual Cloud Backup';panel.append(heading);
 panel.append(p('This uses a separate Firebase snapshot. No automatic synchronization or overwriting. Your older Law Academy progress and Level 4 lesson drafts are not changed.'));
 panel.append(p('Review and save BOTH copies before uploading or merging. If a final differs between devices, the merge is blocked to protect both versions.'));
 const status=p('No cloud record checked.');status.setAttribute('role','status');panel.append(status);
 const actions=document.createElement('div');panel.append(actions);
 let latest=null,viewedDevice=null,busy=false;
 const message=v=>status.textContent=v;
 const close=button('Close',()=>panel.remove());
 function render(){
  actions.replaceChildren(close);
  actions.append(button('Download backup of visible copies',()=>{try{backup(current(),latest?.raw??null);message('Backup download initiated. Confirm file is saved before uploading or merging.')}catch(e){message('Backup failed: '+e.message)}}));
  actions.append(button('Compare finals copies (read-only)',review));
  if(latest?.missing)actions.append(button('Create first finals cloud copy',create));
  else if(latest&&latest.raw!==undefined)actions.append(button('Merge nonconflicting finals',merge));
 }
 async function review(){
  if(busy||!active())return;busy=true;message('Checking your finals snapshot without writing...');
  try{
   const local=current(),s=await getDoc(ref);
   if(!active())throw Error('Account changed');
   viewedDevice=local;
   if(!s.exists()){latest={missing:true};message('Finals cloud record DOES NOT EXIST. You can download a local backup and create the first separate copy with confirmation.');}
   else{
    latest=readRemote(s.data());
    const result=mergeFinals(local,latest.raw);
    if(!result.safe)message('CONFLICT in '+result.conflicts.join(', ')+'. No upload or automatic overwrite permitted. Download both copies and resolve offline.');
    else message('Finals cloud revision '+latest.revision+' verified. '+(result.identical?'Local and cloud copies match.':result.additions.length+' cloud-only and '+result.deviceOnly.length+' device-only finals. Merge permitted after backup.'));
   }
  }catch(e){latest=null;viewedDevice=null;message('Read-only finals backup check failed: '+(e.code||e.message)+'. No data changed. Firestore rules for finals-v1 may require updating.')}
  finally{busy=false;render()}
 }
 async function create(){
  if(busy||!active()||!latest?.missing)return;
  if(!confirm('Have you already SAVED your practical finals backup? Cancel to download first. OK writes a new finals-only cloud snapshot.'))return;
  busy=true;
  try{
   const raw=current();
   if(raw!==viewedDevice)throw Error('Device finals changed; compare again');
   const value=raw??'{}';if(value.length>LIMIT)throw Error('Finals exceed safe document size');
   const revision=await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);if(snap.exists())throw Error('Another cloud finals record appeared; compare again');
    if(!active()||current()!==raw)throw Error('Account or local finals changed');
    tx.set(ref,{academy:'law',snapshotType:'level4-finals',schemaVersion:1,revision:1,raw:value,updatedAt:serverTimestamp()});return 1;
   });
   latest={revision,raw:value};viewedDevice=raw;
   message('Finals cloud copy CREATED (revision '+revision+'). This is manual backup only. No automatic cross-device sync.');render();
  }catch(e){latest=null;viewedDevice=null;message('Finals backup creation stopped: '+(e.code||e.message)+'. Check permissions and compare again.')}
  finally{busy=false}
 }
 async function merge(){
  if(busy||!active()||!latest||latest.missing)return;busy=true;
  try{
   const before=current();if(before!==viewedDevice)throw Error('Local finals changed; compare again');
   const plan=mergeFinals(before,latest.raw);
   if(!plan.safe)throw Error('Conflicting answers in '+plan.conflicts.join(', ')+'; no changes made');
   if(plan.identical){message('Device and cloud already match.');return}
   if(!confirm('Have you already SAVED a backup of BOTH finals copies? Cancel to download first. OK merges nonconflicting final exam records.'))return;
   const original=latest,raw=plan.merged;
   const revision=await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);if(!snap.exists())throw Error('Cloud finals disappeared');
    const actual=readRemote(snap.data());
    if(actual.revision!==original.revision||actual.raw!==original.raw)throw Error('Cloud finals changed; compare again');
    if(!active()||current()!==before)throw Error('Account or device finals changed; compare again');
    tx.set(ref,{academy:'law',snapshotType:'level4-finals',schemaVersion:1,revision:actual.revision+1,raw,updatedAt:serverTimestamp()});
    return actual.revision+1;
   });
   // Do not import cloud work into the device if another tab changed any exam during transaction.
   try{
    if(current()!==before)throw Error('Local finals changed during merge');
    localStorage.setItem(FINALS_KEY,raw);
   }catch(e){
    latest={revision,raw};viewedDevice=null;
    message('Cloud saved revision '+revision+', but device import stopped: '+e.message+'. Your downloaded backup remains important. Compare again.');
    render();return;
   }
   latest={revision,raw};viewedDevice=raw;
   message('Merged finals in revision '+revision+'. Only nonconflicting entries were joined. Reopen the finals screen to see new work.');render();
  }catch(e){latest=null;viewedDevice=null;message('Finals merge stopped: '+(e.code||e.message)+'. No known conflicting work was overwritten. Compare again.');render()}
  finally{busy=false}
 }
 render();document.body.append(panel);close.focus();
}

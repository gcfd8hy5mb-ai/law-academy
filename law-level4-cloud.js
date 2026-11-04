/* Optional Level 4 cloud bridge. Isolated document; never edits progress-v1. */
import {doc,getDoc,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {LEGACY_KEYS,LEVEL4_KEY,normalizeSnapshot,planSnapshotMerge} from './scripts/law-cloud-migration-plan.mjs';
const LIMIT=850000;
const blank=()=>Object.fromEntries(LEGACY_KEYS.map(k=>[k,null]));
function wrapped(raw){return {...blank(),[LEVEL4_KEY]:raw};}
function checked(raw){return normalizeSnapshot(wrapped(raw))[LEVEL4_KEY];}
function snapshot(localStorage){return checked(localStorage.getItem(LEVEL4_KEY));}
function compare(device,cloud){
 const result=planSnapshotMerge(wrapped(device),wrapped(cloud));
 return {safe:result.safe,conflicts:result.conflicts,merged:result.merged?.[LEVEL4_KEY]??null,additions:result.additions};
}
function downloadBackup(data){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='law-academy-level4-before-cloud-action.json';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),15000);
}
const label=(tag,value)=>{const el=document.createElement(tag);el.textContent=value;return el};
function control(title,fn){const b=document.createElement('button');b.type='button';b.textContent=title;b.style.cssText='margin:5px;padding:9px 12px;border:1px solid #bea46c;border-radius:8px;background:#c5ad77;color:#152020;font-weight:700';b.addEventListener('click',fn);return b}
function readRemote(data){
 if(!data||data.level!==4||data.schemaVersion!==1||!Number.isSafeInteger(data.revision)||data.revision<1||typeof data.raw!=='string')throw Error('Unknown Level 4 cloud schema; no changes made');
 return {revision:data.revision,raw:checked(data.raw)};
}
export function openLevel4Cloud({auth,db}){
 const user=auth.currentUser;
 if(!user?.emailVerified){alert('Sign in with a verified Law Academy account first.');return}
 const uid=user.uid,ref=doc(db,'users',uid,'academies','law','snapshots','level4-v1');
 const panel=document.createElement('section');
 panel.style.cssText='position:fixed;z-index:100010;inset:5% 5% auto 5%;max-height:85vh;max-width:550px;overflow:auto;margin:auto;padding:20px;border-radius:12px;border:1px solid #bea46c;background:#152021;color:#f1e9d9;box-shadow:0 12px 30px #000a;font:14px system-ui';
 panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Level 4 manual cloud backup');
 panel.append(label('h2','Level 4 · Manual Cloud Backup'));
 panel.append(label('p','Optional and manual. This uses a separate Firebase record and never edits the older Law Academy cloud snapshot. Existing lesson drafts are never overwritten silently.'));
 const status=label('p','Level 4 backup status: Not checked yet. The main Law Academy cloud connection does not confirm a Level 4 backup.');status.setAttribute('role','status');panel.append(status);
 const actions=document.createElement('div');panel.append(actions);
 let busy=false,latest=null,viewedLocal=null;
 const active=()=>auth.currentUser?.uid===uid&&auth.currentUser.emailVerified;
 const set=message=>status.textContent=message;
 const close=control('Close',()=>panel.remove());
 actions.append(close);
 function renderButtons(){
  actions.replaceChildren(close);
  actions.append(control('Download device backup',()=>{try{downloadBackup({device:snapshot(localStorage),cloud:latest?.raw??null,cloudRevision:latest?.revision??null,exportedAt:new Date().toISOString()});set('Backup download initiated. Verify the file is saved before changing any data.')}catch(e){set('Backup failed: '+e.message)}}));
  actions.append(control('Read and compare (no changes)',review));
  actions.append(control('Test Level 4 Firebase read access',review));
  if(latest!==null&&!latest.missing)actions.append(control('Merge nonconflicting copies (confirm first)',merge));
  if(latest?.missing)actions.append(control('Create first Level 4 cloud copy (confirm first)',create));
 }
 async function review(){
  if(busy||!active())return;
  busy=true;set('Reading Level 4 cloud data only...');
  try{
   const device=snapshot(localStorage);
   const snap=await getDoc(ref);if(!active())throw Error('Account changed');
   if(!snap.exists()){
    latest={missing:true,raw:null,revision:null};viewedLocal=device;
    set('Level 4 backup status: NOT CREATED. Firebase read access succeeded, but the separate Level 4 cloud record does not exist. The main Law Academy sync status is independent. Download your device backup before first upload.');
   }else{
    const remote=readRemote(snap.data());latest=remote;viewedLocal=device;
    const result=compare(device,remote.raw);
    if(!result.safe)set('Level 4 backup status: CONFLICT. Firebase record revision '+remote.revision+' exists, but '+result.conflicts.map(x=>x.key+(x.entry?': '+x.entry:'')).join('; ')+' differs between devices. No changes made. Export both copies before editing.');
    else set(result.additions.length?'Level 4 backup status: EXISTS (revision '+remote.revision+'). Firebase read succeeded; '+result.additions.length+' nonconflicting difference(s) detected. Back up both copies before any merge.':'Level 4 backup status: EXISTS (revision '+remote.revision+'). Firebase read succeeded and the Level 4 device and cloud copies match.');
   }
   renderButtons();
  }catch(e){latest=null;viewedLocal=null;const reason=e.code?e.code+': '+e.message:e.message;set('Read-only Firebase access check failed: '+reason+'. No changes made. A permission-denied result requires checking Firestore rules for the separate Level 4 snapshot.');renderButtons()}
  finally{busy=false}
 }
 async function create(){
  if(busy||!active()||!latest?.missing)return;
  if(!confirm('Save a device backup first. Create a SEPARATE Level 4 cloud record? This does not modify earlier-level progress.'))return;
  busy=true;
  try{
   if(snapshot(localStorage)!==viewedLocal)throw Error('Local writing changed; compare again');
   const device=snapshot(localStorage),raw=device??'{}';
   if(raw.length>LIMIT)throw Error('Draft too large for a single cloud document');
   downloadBackup({device,cloud:null,exportedAt:new Date().toISOString()});
   const result=await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    if(snap.exists())throw Error('Another Level 4 cloud copy appeared. Compare again.');
    if(!active())throw Error('Account changed');
    tx.set(ref,{level:4,schemaVersion:1,revision:1,raw,updatedAt:serverTimestamp()});
    return 1;
   });
   latest={revision:result,raw};viewedLocal=device;
   set('Level 4 backup status: CREATED (revision 1). First separate Level 4 cloud copy created. Older academy progress was not touched. This is manual backup, not automatic synchronization.');renderButtons();
  }catch(e){set('Creation stopped: '+e.message+'. No earlier-level data was modified.')}
  finally{busy=false}
 }
 async function merge(){
  if(busy||!active()||!latest||latest.missing)return;
  busy=true;
  try{
   const before=snapshot(localStorage);
   if(before!==viewedLocal)throw Error('Local writing changed; compare again');
   const proposal=compare(before,latest.raw);
   if(!proposal.safe)throw Error('Different existing answers; no automatic resolution. Download both versions.');
   if(proposal.merged===null)throw Error('No valid combined draft to save');
   if(proposal.merged.length>LIMIT)throw Error('Combined draft exceeds cloud size guard');
   if(proposal.additions.length===0){set('No different work to merge; both copies match.');return}
   downloadBackup({device:before,cloud:latest.raw,cloudRevision:latest.revision,exportedAt:new Date().toISOString()});
   if(!confirm('Back up both copies and confirm they are saved. Merge ONLY nonconflicting Level 4 lesson entries into the separate Level 4 cloud document and this device?'))return;
   const expected=latest.revision,remoteOriginal=latest.raw,combined=proposal.merged;
   const next=await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    const current=readRemote(snap.data());
    if(current.revision!==expected||current.raw!==remoteOriginal)throw Error('Cloud changed; compare again');
    if(!active()||snapshot(localStorage)!==before)throw Error('Account or device draft changed; compare again');
    tx.set(ref,{level:4,schemaVersion:1,revision:expected+1,raw:combined,updatedAt:serverTimestamp()});
    return expected+1;
   });
   // Keep a recoverable independent backup if local storage rejects the merged value.
   try{
    if(snapshot(localStorage)!==before)throw Error('Local draft changed while syncing');
    localStorage.setItem(LEVEL4_KEY,combined);
   }catch(e){
    set('Cloud saved revision '+next+', but device import stopped: '+e.message+'. Both copies were exported; compare again before retrying.');
    latest={revision:next,raw:combined};viewedLocal=null;renderButtons();return;
   }
   latest={revision:next,raw:combined};viewedLocal=combined;
   set('Level 4 backup status: MERGED (revision '+next+'). Only nonconflicting Level 4 entries were merged. Reload the Level 4 lesson to view any newly imported writing.');renderButtons();
  }catch(e){set('Merge stopped: '+e.message+'. Recompare before another attempt. No existing drafts were deliberately overwritten.')}
  finally{busy=false}
 }
 renderButtons();
 document.body.append(panel);
 close.focus();
}

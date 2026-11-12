/* Level 5 manual cloud backup: isolated snapshot, no automatic uploads or silent restore.
 * Never writes historic Law progress, Level 4 lessons, practical finals, or grades.
 */
import {doc,getDoc,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {LEVEL5_KEY,LEVEL5_LIMIT,readLevel5,planLevel5Merge,validateLevel5Cloud} from './scripts/law-level5-cloud-plan.mjs';
function control(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='margin:5px;padding:10px;border-radius:8px;border:1px solid #c5ad77;background:#c5ad77;color:#152021;font-weight:700';b.onclick=fn;return b}
function line(msg){const p=document.createElement('p');p.textContent=msg;return p}
function download(device,remote){const content=JSON.stringify({format:'law-academy-level5-manual-backup',date:new Date().toISOString(),device,remote},null,2);
 const url=URL.createObjectURL(new Blob([content],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='law-academy-level5-both-copies.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),15000);
}
export function openLevel5Cloud({auth,db}){
 if(!auth.currentUser?.emailVerified){alert('Sign in to a verified account first');return}
 const uid=auth.currentUser.uid,ref=doc(db,'users',uid,'academies','law','snapshots','level5-v1');
 const active=()=>auth.currentUser?.uid===uid&&auth.currentUser.emailVerified;
 const panel=document.createElement('section');panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Level 5 manual cloud backup');
 panel.style.cssText='position:fixed;z-index:100030;inset:5% 5% auto 5%;margin:auto;max-width:610px;max-height:85vh;overflow:auto;padding:18px;background:#152021;color:#f1e9d9;border:1px solid #c5ad77;border-radius:12px;box-shadow:0 12px 35px #0009;font:14px system-ui';
 const h=document.createElement('h2');h.textContent='Level 5 · Manual Cloud Backup';panel.append(h);
 panel.append(line('Separate Firebase snapshot for Level 5 original writing and diagnostics. No automatic syncing. Levels 1–4 and older cloud records are never edited.'));
 panel.append(line('First compare and DOWNLOAD both copies. Different answers to the same lesson block merging; neither copy is silently overwritten.'));
 const status=line('Cloud has not been checked.');status.setAttribute('role','status');panel.append(status);
 const actions=document.createElement('div');panel.append(actions);document.body.append(panel);
 let latest=null,viewed=null,busy=false;
 function current(){const raw=localStorage.getItem(LEVEL5_KEY);readLevel5(raw);return raw}
 function buttons(){
  actions.replaceChildren(control('Close',()=>panel.remove()));
  actions.append(control('Download device and visible cloud copies',()=>{try{download(current(),latest?.raw??null);status.textContent='Download initiated. Confirm file exists before proceeding.'}catch(e){status.textContent=e.message}}));
  actions.append(control('Compare Level 5 copies (read only)',review));
  if(latest?.missing)actions.append(control('Create first Level 5 cloud copy',create));
  else if(latest?.raw!==undefined)actions.append(control('Merge nonconflicting Level 5 copies',merge));
 }
 async function review(){
  if(busy||!active())return;busy=true;status.textContent='Reading cloud (no changes)...';
  try{const device=current(),snap=await getDoc(ref);if(!active())throw Error('Account changed');
   viewed=device;
   if(!snap.exists()){latest={missing:true};status.textContent='No separate Level 5 cloud copy exists. Download your device backup first.'}
   else{latest=validateLevel5Cloud(snap.data());const plan=planLevel5Merge(device,latest.raw);
    status.textContent=plan.safe?'Cloud revision '+latest.revision+': '+plan.deviceOnly.length+' device-only and '+plan.cloudOnly.length+' cloud-only records. Merge can proceed after backup.':'CONFLICT: '+plan.conflicts.join(', ')+'. Merging is disabled. Download both copies; resolve manually.'}
  }catch(e){latest=null;viewed=null;status.textContent='Read-only check failed: '+(e.code||e.message)+'. No data changed. Check separate level5-v1 Firestore permissions.'}
  finally{busy=false;buttons()}
 }
 async function create(){
  if(busy||!active()||!latest?.missing)return;
  if(!confirm('Have you saved the Level 5 device backup? Cancel to download it first. OK creates the first separate Level 5 cloud copy.'))return;
  busy=true;
  try{const device=current();if(device!==viewed)throw Error('Device writing changed; compare again');
   const raw=device??'{}';if(raw.length>LEVEL5_LIMIT)throw Error('Backup is too large');
   await runTransaction(db,async tx=>{const snap=await tx.get(ref);if(snap.exists())throw Error('Cloud copy appeared; compare again');if(!active()||current()!==device)throw Error('Account or local data changed');tx.set(ref,{academy:'law',snapshotType:'level5',schemaVersion:1,revision:1,raw,updatedAt:serverTimestamp()})});
   latest={raw,revision:1};viewed=device;status.textContent='Level 5 cloud copy created. This is a MANUAL backup, not continuous sync.';
  }catch(e){latest=null;viewed=null;status.textContent='Creation stopped: '+(e.code||e.message)}
  finally{busy=false;buttons()}
 }
 async function merge(){
  if(busy||!active()||!latest||latest.missing)return;busy=true;
  try{const before=current();if(before!==viewed)throw Error('Device writing changed; compare again');
   const plan=planLevel5Merge(before,latest.raw);if(!plan.safe)throw Error('Conflicting records: '+plan.conflicts.join(', '));
   if(plan.identical){status.textContent='Already identical. No writes needed.';return}
   if(!confirm('Confirm you have downloaded and saved BOTH Level 5 copies. OK merges nonconflicting records only.'))return;
   const original=latest,merged=plan.mergedRaw;
   const next=await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);if(!snap.exists())throw Error('Cloud copy disappeared');
    const currentCloud=validateLevel5Cloud(snap.data());
    if(currentCloud.revision!==original.revision||currentCloud.raw!==original.raw)throw Error('Cloud changed; compare again');
    if(!active()||current()!==before)throw Error('Account or device data changed');
    tx.set(ref,{academy:'law',snapshotType:'level5',schemaVersion:1,revision:original.revision+1,raw:merged,updatedAt:serverTimestamp()});
    return original.revision+1;
   });
   // A second tab can change local data while the Firestore transaction is in flight.
   if(!active()||current()!==before)throw Error('Cloud merged but local writing changed. Local copy NOT overwritten. Download/compare again.');
   try{localStorage.setItem(LEVEL5_KEY,merged)}catch{throw Error('Cloud merged, local save failed. Local data not intentionally erased. Compare again.')}
   latest={raw:merged,revision:next};viewed=merged;
   status.textContent='Nonconflicting Level 5 records merged into device and cloud. Restart other devices only after comparing copies.';
  }catch(e){latest=null;viewed=null;status.textContent='Merge stopped: '+(e.code||e.message)+'. Recompare and preserve both backups.'}
  finally{busy=false;buttons()}
 }
 buttons();
}

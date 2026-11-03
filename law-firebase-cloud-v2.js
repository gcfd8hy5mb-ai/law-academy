/* Law Academy cloud bridge: no automatic restore, initial overwrite, or destructive merge. */
import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendEmailVerification,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,getDoc,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
const cfg=window.ACADEMY_FIREBASE_CONFIG;
const app=getApps().find(a=>a.name==='law-academy')||initializeApp(cfg,'law-academy');
const auth=getAuth(app),db=getFirestore(app);
const KEYS=['law-academy-progress-v1','law-academy-exam-results-v1','law-academy-capstone-v1','law-academy-oral-defense-v1','law-academy-final-essays-v1','law-academy-final-review-v1','law-academy-writing-v1','law-academy-rubric-v1','law-academy-sim-v1','law-academy-sim-branches-v1','law-academy-reasoning-v1','law-academy-research-capstone-v1','law-academy-capstone-audit-v1','law-academy-level2-v1','law-academy-level2-exam-v1','law-academy-level2-exam-timing-v1','law-academy-level3-v1'];
let user=null,linked=false,rev=null,baseline=null,mode='ready',busy=false,gen=0,syncing=false,queued=false,delay=null;
const panel=document.createElement('aside');panel.style.cssText='position:fixed;z-index:99999;bottom:12px;right:10px;box-sizing:border-box;width:min(355px,calc(100vw - 20px));max-height:52vh;overflow:auto;padding:13px;border:1px solid #b7a06d;border-radius:14px;background:#162021;color:#f1e9d9;box-shadow:0 14px 32px #0009;font:14px system-ui';
const handle=document.createElement('button');handle.textContent='☁ Law Cloud';handle.style.cssText='display:none;position:fixed;z-index:99998;bottom:80px;right:12px;border-radius:24px;background:#bba36f;color:#152020;padding:10px 14px;border:0;font-weight:700';
handle.onclick=()=>{panel.style.display='block';handle.style.display='none'};
document.body.append(panel,handle);
window.openLawCloud=()=>{panel.style.display='block';handle.style.display='none';const warning=document.getElementById('law-cloud-startup-warning');if(warning)warning.remove()};
const boot=document.getElementById('law-cloud-launch');if(boot)boot.textContent='☁ Cloud Account';
function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='margin:4px 5px 4px 0;padding:10px 12px;border:0;border-radius:8px;background:#c5ad77;color:#152021;font-weight:700';b.onclick=fn;return b}
function line(text){const p=document.createElement('p');p.textContent=text;p.style.cssText='margin:9px 0;overflow-wrap:anywhere';panel.append(p);return p}
function status(message){const p=panel.querySelector('[data-cloud-status]');if(p)p.textContent=message}
function key(uid){return 'law-academy-cloud-link-'+uid}
function local(){const r={};for(const k of KEYS)r[k]=localStorage.getItem(k);return r}
function canonical(v){if(Array.isArray(v))return v.map(canonical);if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])]));return v}
function equalValue(a,b){try{return JSON.stringify(canonical(JSON.parse(a)))===JSON.stringify(canonical(JSON.parse(b)))}catch{return a===b}}
function equal(a,b){return KEYS.every(k=>equalValue(a[k],b[k]))}
function valid(data){return data&&typeof data==='object'&&!Array.isArray(data)&&KEYS.every(k=>data[k]===null||typeof data[k]==='string')}
function parseCloud(data){try{const p=JSON.parse(data.raw);return valid(p)?p:null}catch{return null}}
function target(uid){return doc(db,'users',uid,'academies','law','snapshots','progress-v1')}
function download(name,data){const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),academy:'law',data},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),15000)}
function snapshot(){return JSON.stringify(local())}
function count(value){if(value===null)return 'no saved data';try{const x=JSON.parse(value);return Array.isArray(x)?x.length+' items':x&&typeof x==='object'?Object.keys(x).length+' entries':'saved value'}catch{return value.length+' characters'}}
function compare(a,b,container){for(const k of KEYS){if(equalValue(a[k],b[k]))continue;const d=document.createElement('details');d.style.cssText='border-top:1px solid #64706a;padding:8px 0';const s=document.createElement('summary');s.textContent=k+' · DIFFERENT';s.style.cursor='pointer';d.append(s);const note=document.createElement('p');note.textContent='iPhone: '+count(a[k])+' | Cloud: '+count(b[k]);d.append(note);try{const left=JSON.parse(a[k]),right=JSON.parse(b[k]);if(left&&right&&typeof left==='object'&&typeof right==='object'&&!Array.isArray(left)&&!Array.isArray(right)){const changed=[...new Set([...Object.keys(left),...Object.keys(right)])].filter(f=>JSON.stringify(canonical(left[f]))!==JSON.stringify(canonical(right[f])));const t=document.createElement('p');t.textContent='Different entries: '+changed.slice(0,30).join(', ')+(changed.length>30?'…':'');d.append(t)}}catch{}container.append(d)}}
function render(message){
 panel.replaceChildren();const h=document.createElement('strong');h.textContent='Law Academy · Firebase cloud saving';panel.append(h);
 const s=line(message|| (linked?'Cloud saving connected':user?'iPhone progress retained; cloud not linked':'Sign in to inspect cloud progress'));s.dataset.cloudStatus='';
 if(!user){const email=document.createElement('input'),pass=document.createElement('input');email.type='email';email.placeholder='Email';pass.type='password';pass.placeholder='Password';for(const el of [email,pass]){el.style.cssText='box-sizing:border-box;width:100%;padding:10px;margin:5px 0;border-radius:6px';panel.append(el)}panel.append(button('Sign in',async()=>{try{status('Signing in…');await signInWithEmailAndPassword(auth,email.value.trim(),pass.value)}catch(e){status('Sign in failed: '+(e.code||e.message))}}),button('Create account',async()=>{try{const c=await createUserWithEmailAndPassword(auth,email.value.trim(),pass.value);await sendEmailVerification(c.user);await signOut(auth);status('Verify email then sign in.')}catch(e){status('Account error: '+(e.code||e.message))}}));return}
 if(!user.emailVerified){line('Please verify your account email before cloud access.');panel.append(button('Sign out',()=>signOut(auth)));return}
 if(linked){panel.append(button('Sync now',sync),button('Download iPhone backup',()=>download('law-academy-iphone-backup.json',local())))}
 else {panel.append(button('Compare cloud and iPhone',review),button('Download iPhone backup',()=>download('law-academy-iphone-backup.json',local())));if(mode==='empty')panel.append(button('Enable first cloud save',enable))}
 panel.append(button('Sign out',()=>signOut(auth)),button('Hide',()=>{panel.style.display='none';handle.style.display='block'}));
}
async function review(){
 if(!user?.emailVerified||busy)return;busy=true;const uid=user.uid,generation=gen;
 try{status('Reading Firebase without changing either copy…');const ref=target(uid),docSnap=await getDoc(ref);if(uid!==auth.currentUser?.uid||generation!==gen)return;
 if(!docSnap.exists()){mode='empty';render('No Law Academy cloud record found at this location. iPhone progress remains safe.');return}
 const d=docSnap.data(),remote=parseCloud(d),remoteRev=Number(d.revision);
 if(!remote||!Number.isSafeInteger(remoteRev)||remoteRev<1){mode='conflict';render('Existing cloud data is in an unrecognized format. No changes made; cloud saving remains disabled.');return}
 const current=local();if(equal(remote,current)){rev=remoteRev;baseline=snapshot();linked=true;mode='ready';localStorage.setItem(key(uid),String(rev));render('Cloud connected · progress matches this iPhone');return}
 mode='conflict';render('Cloud and iPhone differ. Both versions preserved; automatic sync paused.');
 const box=document.createElement('div');box.style.cssText='border:1px solid #b7a06d;padding:10px;border-radius:9px;margin:8px 0';const header=document.createElement('strong');header.textContent='Read-only comparison · Firebase revision '+remoteRev;box.append(header);compare(current,remote,box);panel.append(box);
 panel.append(button('Download combined backup (both)',()=>download('law-academy-both-versions.json',{iphone:current,cloud:remote,cloudRevision:remoteRev})));
 panel.append(button('Keep iPhone copy in Firebase',async()=>{
  if(!confirm('Only continue after saving the combined backup. Replace the current FIREBASE copy with this iPhone copy?'))return;
  if(!confirm('Confirm again: overwrite Firebase Law Academy data with this iPhone version?'))return;
  try{status('Verifying cloud revision before saving…');const localCopy=local();const next=await runTransaction(db,async tx=>{const fresh=await tx.get(ref);if(!fresh.exists()||Number(fresh.data().revision)!==remoteRev)throw Error('Firebase changed; compare again');if(uid!==auth.currentUser?.uid)throw Error('Account changed');tx.set(ref,{academy:'law',schemaVersion:1,revision:remoteRev+1,raw:JSON.stringify(localCopy),updatedAt:serverTimestamp()});return remoteRev+1});if(uid!==auth.currentUser?.uid||generation!==gen)return;rev=next;baseline=snapshot();linked=true;mode='ready';localStorage.setItem(key(uid),String(rev));render('Saved iPhone version to Firebase cloud')}catch(e){status('Firebase not changed: '+(e.code||e.message))}});
 panel.append(button('Restore Firebase to iPhone',()=>{status('Restore is intentionally disabled during initial verification. Both versions are preserved.')}))
 }catch(e){status('Comparison failed; no changes made: '+(e.code||e.message))}
 finally{busy=false}
}
async function enable(){
 if(!user?.emailVerified||busy||mode!=='empty')return;
 if(!confirm('Save a local backup first. Upload this iPhone\'s Law Academy progress as the FIRST cloud copy?'))return;
 download('law-academy-iphone-before-cloud.json',local());
 const uid=user.uid;busy=true;
 try{const data=local(),next=await runTransaction(db,async tx=>{const ref=target(uid),s=await tx.get(ref);if(s.exists())throw Error('Cloud data appeared; compare versions first');tx.set(ref,{academy:'law',schemaVersion:1,revision:1,raw:JSON.stringify(data),updatedAt:serverTimestamp()});return 1});if(uid!==auth.currentUser?.uid)return;rev=next;baseline=snapshot();linked=true;mode='ready';localStorage.setItem(key(uid),String(rev));render('Saved first Law Academy copy to Firebase cloud')}catch(e){status('Cloud upload not completed: '+(e.code||e.message))}
 finally{busy=false}
}
async function sync(){
 if(!linked||!user?.emailVerified||syncing)return false;const uid=user.uid,generation=gen,now=snapshot();if(now===baseline){status('Cloud up to date · matches this iPhone');return true}
 syncing=true;try{status('Saving to Firebase…');const next=await runTransaction(db,async tx=>{const ref=target(uid),s=await tx.get(ref);if(!s.exists()||Number(s.data().revision)!==rev)throw Error('Cloud changed elsewhere. Upload stopped; compare copies.');if(uid!==auth.currentUser?.uid)throw Error('Account changed');tx.set(ref,{academy:'law',schemaVersion:1,revision:rev+1,raw:now,updatedAt:serverTimestamp()});return rev+1});if(uid!==auth.currentUser?.uid||generation!==gen)return false;rev=next;baseline=now;localStorage.setItem(key(uid),String(rev));status('Saved to Firebase cloud');return true}catch(e){linked=false;mode='conflict';render('Sync stopped without overwriting Firebase: '+(e.code||e.message)+'. Compare versions.');return false}finally{syncing=false}
}
async function resume(uid,generation){if(!localStorage.getItem(key(uid)))return;try{const s=await getDoc(target(uid));if(generation!==gen||auth.currentUser?.uid!==uid)return;if(!s.exists()){mode='empty';render('Prior cloud link missing; no changes made.');return}const remote=parseCloud(s.data()),r=Number(s.data().revision);if(!remote||!Number.isSafeInteger(r)||r<1){mode='conflict';render('Cloud record unrecognized; syncing paused.');return}if(!equal(remote,local())){mode='conflict';render('Firebase and iPhone differ. Sync paused; compare before changing either.');return}rev=r;baseline=snapshot();linked=true;render('Cloud connected · progress matches this iPhone')}catch(e){render('Cloud reconnect failed: '+(e.code||e.message)+'. iPhone data remains safe.')}}
onAuthStateChanged(auth,async value=>{gen++;user=value;linked=false;rev=null;baseline=null;mode='ready';render();if(user&&user.emailVerified)await resume(user.uid,gen)});
setInterval(()=>{if(!linked||!user?.emailVerified)return;const now=snapshot();if(now!==baseline&&!syncing){clearTimeout(delay);delay=setTimeout(sync,1300)}},2200);
window.addEventListener('online',()=>{if(linked)sync()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&linked)sync()});

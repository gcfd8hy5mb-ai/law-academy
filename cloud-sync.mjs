// Cross-device sync (opt-in). Existing browser storage remains authoritative until a user explicitly imports.
// To enable, set window.ACADEMY_FIREBASE_CONFIG from a separately configured script before this module.
const cfg = window.ACADEMY_FIREBASE_CONFIG;
const academy = 'law';
if (cfg?.apiKey && cfg?.projectId && cfg?.authDomain && ['business','law','ethical-hacking'].includes(academy)) {
  const [{initializeApp},{getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut},{getFirestore,doc,getDoc,setDoc,serverTimestamp}] =
    await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
    ]);
  const app=initializeApp(cfg), auth=getAuth(app), db=getFirestore(app);
  const keys = academy==='business' ? ['business-academy-v1'] :
    ['law-academy-progress-v1','law-academy-exam-results-v1','law-academy-capstone-v1','law-academy-oral-defense-v1','law-academy-final-essays-v1','law-academy-final-review-v1','law-academy-research-capstone-v1','law-academy-rubric-v1','law-academy-writing-v1','law-academy-sim-v1','law-academy-sim-branches-v1','law-academy-reasoning-v1','law-academy-capstone-audit-v1'];
  let currentUser=null, busy=false;
  const button=document.createElement('button');
  button.type='button'; button.textContent='Cloud save: Sign in';
  Object.assign(button.style,{position:'fixed',bottom:'max(12px,env(safe-area-inset-bottom))',right:'12px',zIndex:'10000',padding:'10px 14px',background:'#202d32',color:'#f9e6b5',border:'1px solid #9b864f',borderRadius:'12px',font:'600 12px system-ui',boxShadow:'0 4px 16px #0005'});
  document.body.appendChild(button);
  const notice=(msg)=>alert(msg);
  function ref(key){return doc(db,'users',currentUser.uid,'academies',academy,'snapshots',key)}
  async function login(create){
    const email=prompt('Academy email address');if(!email)return;
    const password=prompt('Academy password (not stored on this device by this form)');if(!password)return;
    if(create)await createUserWithEmailAndPassword(auth,email,password);
    else await signInWithEmailAndPassword(auth,email,password);
  }
  async function backUp(){
    if(!currentUser)return;
    const snapshot={};
    for(const key of keys){const value=localStorage.getItem(key);if(value!==null)snapshot[key]=value;}
    const blob=new Blob([JSON.stringify({academy,exportedAt:new Date().toISOString(),snapshot},null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=academy+'-progress-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  async function upload(){
    if(!currentUser || busy)return;busy=true;
    try {
      let count=0;
      for(const key of keys){
        const raw=localStorage.getItem(key);if(raw===null)continue;
        const existing=await getDoc(ref(key));
        if(existing.exists()){
          const remote=existing.data().raw;
          if(remote!==raw){notice('Cloud record for '+key+' differs. Keeping both versions unchanged. Restore the cloud version or resolve the conflict before uploading.');continue;}
        }
        await setDoc(ref(key),{raw,schemaVersion:1,updatedAt:serverTimestamp(),academy},{merge:false});count++;
      }
      notice('Uploaded '+count+' progress record(s).');
    }finally{busy=false}
  }
  async function download(){
    if(!currentUser||busy)return;busy=true;
    try{
      await backUp();
      let count=0;
      for(const key of keys){
        const snap=await getDoc(ref(key));if(!snap.exists())continue;
        const incoming=snap.data().raw;if(typeof incoming!=='string')continue;
        const existing=localStorage.getItem(key);
        if(existing!==null && existing!==incoming && !confirm('Replace this device\'s '+key+' progress with cloud progress? A local JSON backup was downloaded.'))continue;
        localStorage.setItem(key,incoming);count++;
      }
      notice('Restored '+count+' record(s). Reloading to show changes.');location.reload();
    }finally{busy=false}
  }
  onAuthStateChanged(auth,u=>{currentUser=u;button.textContent=u?'Cloud save: '+(u.email||'Signed in'):'Cloud save: Sign in'});
  button.addEventListener('click',async()=>{
    if(busy)return;
    try{
      if(!currentUser){
        const action=prompt('Enter 1 to SIGN IN or 2 to CREATE ACCOUNT');if(action==='1')await login(false);else if(action==='2')await login(true);return;
      }
      const action=prompt('Cloud save: 1 UPLOAD device progress, 2 RESTORE cloud progress, 3 EXPORT backup, 4 SIGN OUT');
      if(action==='1')await upload();
      else if(action==='2')await download();
      else if(action==='3')await backUp();
      else if(action==='4')await signOut(auth);
    }catch(e){notice('Cloud operation failed: '+(e?.code||e?.message||'unknown error'))}
  });
}

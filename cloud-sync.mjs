// Cross-device sync (opt-in). Existing browser storage remains authoritative until a user explicitly imports.
// To enable, set window.ACADEMY_FIREBASE_CONFIG from a separately configured script before this module.
const cfg = window.ACADEMY_FIREBASE_CONFIG;
const academy = 'law';
if (cfg?.apiKey && cfg?.projectId && cfg?.authDomain && ['business','law','ethical-hacking'].includes(academy)) {
  const [{initializeApp},{getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,sendPasswordResetEmail,sendEmailVerification},{getFirestore,doc,getDoc,getDocFromServer,setDoc,serverTimestamp,runTransaction}] =
    await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
    ]);
  const app=initializeApp(cfg), auth=getAuth(app), db=getFirestore(app);
  const keys = academy==='business' ? ['business-academy-v1'] :
    ['law-academy-progress-v1','law-academy-exam-results-v1','law-academy-capstone-v1','law-academy-oral-defense-v1','law-academy-final-essays-v1','law-academy-final-review-v1','law-academy-research-capstone-v1','law-academy-rubric-v1','law-academy-writing-v1','law-academy-sim-v1','law-academy-sim-branches-v1','law-academy-reasoning-v1','law-academy-capstone-audit-v1'];
  let currentUser=null, busy=false, autoEnabled=false, syncTimer=null;
  const baseline=new Map();
  const status=(message)=>{button.textContent=message;};
  function stopAuto(){autoEnabled=false;baseline.clear();if(syncTimer)clearInterval(syncTimer);syncTimer=null;}
  const button=document.createElement('button');
  button.type='button'; button.textContent='Cloud save: Sign in';
  Object.assign(button.style,{position:'fixed',bottom:'max(12px,env(safe-area-inset-bottom))',right:'12px',zIndex:'10000',padding:'10px 14px',background:'#202d32',color:'#f9e6b5',border:'1px solid #9b864f',borderRadius:'12px',font:'600 12px system-ui',boxShadow:'0 4px 16px #0005'});
  document.body.appendChild(button);
  const notice=(msg)=>alert(msg);
  function ref(key){return doc(db,'users',currentUser.uid,'academies',academy,'snapshots',key)}
  async function requireVerifiedAccount(){
    if(!currentUser)throw Error('Sign in first.');
    await currentUser.reload();
    if(!currentUser.emailVerified)throw Error('Please verify your email before cloud saving.');
  }
  function openAuthDialog(){
    if(document.getElementById('academy-auth-dialog'))return;
    const overlay=document.createElement('div');
    overlay.id='academy-auth-dialog';
    overlay.setAttribute('role','presentation');
    overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#000b;display:flex;align-items:center;justify-content:center;padding:18px;';
    const panel=document.createElement('section');
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-label','Academy account');
    panel.style.cssText='width:min(100%,400px);max-height:90dvh;overflow:auto;background:#25282b;color:#f5f0e9;border:1px solid #a99257;border-radius:18px;padding:22px;font:15px system-ui;box-sizing:border-box;';
    const heading=document.createElement('h2');heading.textContent='Your Academy Account';heading.style.cssText='margin:0 0 8px;font-size:22px;';
    const subtitle=document.createElement('p');subtitle.textContent='Sign in to prepare cloud progress syncing. Current on-device lessons are preserved.';subtitle.style.cssText='font-size:13px;line-height:1.5;color:#d1c9bc;';
    const form=document.createElement('form');form.style.cssText='display:grid;gap:12px;';
    const email=document.createElement('input');email.type='email';email.autocomplete='email';email.required=true;email.placeholder='Email address';
    const password=document.createElement('input');password.type='password';password.autocomplete='current-password';password.required=true;password.placeholder='Password';password.minLength=6;
    for(const field of [email,password])field.style.cssText='width:100%;box-sizing:border-box;padding:13px;border-radius:9px;border:1px solid #8a8272;background:#17191b;color:#fff;font-size:16px;';
    const feedback=document.createElement('p');feedback.setAttribute('role','status');feedback.style.cssText='min-height:20px;margin:0;color:#ddc895;font-size:13px;';
    const submit=document.createElement('button');submit.type='submit';
    const toggle=document.createElement('button');toggle.type='button';
    const forgot=document.createElement('button');forgot.type='button';forgot.textContent='Forgot password?';
    const resend=document.createElement('button');resend.type='button';resend.textContent='Resend verification email';
    const close=document.createElement('button');close.type='button';close.textContent='Close';
    let create=false;
    const buttonStyle='padding:12px;border-radius:10px;font:600 14px system-ui;cursor:pointer;';
    submit.style.cssText=buttonStyle+'background:#d0ac66;color:#181819;border:0;';
    for(const secondary of [toggle,forgot,resend,close])secondary.style.cssText=buttonStyle+'background:transparent;color:#ead7a9;border:1px solid #807459;';
    const render=()=>{submit.textContent=create?'Create account':'Sign in';toggle.textContent=create?'Already have an account? Sign in':'New student? Create account';password.autocomplete=create?'new-password':'current-password';feedback.textContent='';};
    render();
    toggle.addEventListener('click',()=>{create=!create;render();});
    close.addEventListener('click',()=>overlay.remove());
    resend.addEventListener('click',async()=>{
      if(!auth.currentUser){feedback.textContent='Sign in before requesting verification.';return;}
      try{
        await auth.currentUser.reload();
        if(auth.currentUser.emailVerified){feedback.textContent='Your email is already verified.';return;}
        await sendEmailVerification(auth.currentUser);
        feedback.textContent='Verification message sent. Check your email.';
      }catch(e){feedback.textContent='Verification request failed: '+(e.code||'Please try later.');}
    });
    forgot.addEventListener('click',async()=>{
      if(!email.value.trim()){feedback.textContent='Enter your email address first.';email.focus();return;}
      feedback.textContent='Sending password reset instructions…';
      try{await sendPasswordResetEmail(auth,email.value.trim());feedback.textContent='If this account exists, check your email for reset instructions.';}
      catch(e){feedback.textContent='Could not request reset: '+(e.code||'Please try again.');}
    });
    form.addEventListener('submit',async(event)=>{
      event.preventDefault();submit.disabled=true;feedback.textContent=create?'Creating account…':'Signing in…';
      try{
        const address=email.value.trim();
        const result=create?await createUserWithEmailAndPassword(auth,address,password.value):await signInWithEmailAndPassword(auth,address,password.value);
        if(create){await sendEmailVerification(result.user);feedback.textContent='Account created. Check your email to verify your account before enabling cloud saving.';}
        else{await result.user.reload();feedback.textContent=result.user.emailVerified?'Signed in. Use Cloud save to import your progress.':'Signed in. Verify your email before enabling cloud saving.';}
        password.value='';
      }catch(e){feedback.textContent='Authentication failed: '+(e.code||'Please try again.');}
      finally{submit.disabled=false;}
    });
    form.append(email,password,submit,toggle,forgot,resend,feedback,close);
    panel.append(heading,subtitle,form);overlay.append(panel);document.body.append(overlay);
  }
  async function backUp(){
    if(!currentUser)return;
    const snapshot={};
    for(const key of keys){const value=localStorage.getItem(key);if(value!==null)snapshot[key]=value;}
    const blob=new Blob([JSON.stringify({academy,exportedAt:new Date().toISOString(),snapshot},null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=academy+'-progress-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  async function upload(){
    if(!currentUser || busy)return;await requireVerifiedAccount();busy=true;
    if(autoEnabled){stopAuto();status('Cloud save: Paused for manual upload');}
    try {
      let count=0;
      for(const key of keys){
        const raw=localStorage.getItem(key);if(raw===null)continue;
        const existing=await getDoc(ref(key));
        if(existing.exists()){
          const remote=existing.data().raw;
          if(remote!==raw){notice('Cloud record for '+key+' differs. Keeping both versions unchanged. Restore the cloud version or resolve the conflict before uploading.');continue;}
        }
        await setDoc(ref(key),{raw,schemaVersion:1,updatedAt:serverTimestamp(),academy},{merge:false});baseline.set(key,raw);count++;
      }
      notice('Uploaded '+count+' progress record(s).');
    }finally{busy=false}
  }
  async function download(){
    if(!currentUser||busy)return;await requireVerifiedAccount();busy=true;
    if(autoEnabled){stopAuto();status('Cloud save: Paused for restore');}
    try{
      await backUp();
      let count=0;
      for(const key of keys){
        const snap=await getDoc(ref(key));if(!snap.exists())continue;
        const incoming=snap.data().raw;if(typeof incoming!=='string')continue;
        const existing=localStorage.getItem(key);
        if(existing!==null && existing!==incoming && !confirm('Replace this device\'s '+key+' progress with cloud progress? A local JSON backup was downloaded.'))continue;
        localStorage.setItem(key,incoming);baseline.set(key,incoming);count++;
      }
      notice('Restored '+count+' record(s). Reloading to show changes.');location.reload();
    }finally{busy=false}
  }
  async function testCloudConnection(){
    if(!currentUser||busy)return;
    await requireVerifiedAccount();
    busy=true;
    try{
      // Dedicated diagnostic only. Never touches a student lesson or grade.
      const target=ref('cloud-connection-test-v1');
      const raw=JSON.stringify({test:true,academy,uid:currentUser.uid,nonce:Date.now()});
      // The transaction exercises the same concurrency-safe write used by autosave.
      await runTransaction(db,async tx=>{
        const existing=await tx.get(target);
        if(existing.exists() && existing.data().academy!==academy)
          throw Error('Test record belongs to another academy.');
        tx.set(target,{raw,schemaVersion:1,updatedAt:serverTimestamp(),academy});
      });
      // Force server access so the result cannot come from cached browser data.
      const verified=await getDocFromServer(target);
      if(!verified.exists()||verified.data().raw!==raw)
        throw Error('Server returned a different test record.');
      notice('Cloud transaction and server restore passed for '+academy+'. No coursework changed.');
    }finally{busy=false}
  }
  async function testConflictProtection(){
    if(!currentUser||busy)return;
    await requireVerifiedAccount();
    busy=true;
    try{
      // Separate diagnostic document, never a lesson, grade, or autosave key.
      const target=ref('cloud-conflict-test-v1');
      const original=JSON.stringify({test:'before',academy});
      const newer=JSON.stringify({test:'after',academy});
      await setDoc(target,{raw:original,schemaVersion:1,updatedAt:serverTimestamp(),academy});
      // Simulate another session saving a newer version.
      await setDoc(target,{raw:newer,schemaVersion:1,updatedAt:serverTimestamp(),academy});
      let conflictRejected=false;
      try{
        await runTransaction(db,async tx=>{
          const snapshot=await tx.get(target);
          if(!snapshot.exists()||snapshot.data().raw!==original)
            throw Error('Cloud conflict detected; newer data protected.');
          tx.set(target,{raw:original,schemaVersion:1,updatedAt:serverTimestamp(),academy});
        });
      }catch(error){
        if(error?.message==='Cloud conflict detected; newer data protected.')
          conflictRejected=true;
        else throw error;
      }
      const finalRecord=await getDocFromServer(target);
      if(!conflictRejected||finalRecord.data()?.raw!==newer)
        throw Error('Cloud conflict protection test did not pass.');
      notice('Conflict protection passed for '+academy+'. Newer cloud data was preserved.');
    }finally{busy=false}
  }
  async function diagnoseAccess(){
    if(!currentUser)return notice('Sign in first.');
    await currentUser.reload();
    const token=await currentUser.getIdTokenResult(true);
    const verified=token.claims.email_verified===true;
    const target=ref('cloud-connection-test-v1');
    let read='unknown';
    try{await getDocFromServer(target);read='allowed';}
    catch(e){read=e?.code||'failed';}
    notice('Firebase diagnostic: project='+cfg.projectId+
      '; email verified='+verified+
      '; signed-in UID='+currentUser.uid+
      '; token UID='+token.claims.user_id+
      '; document path='+target.path+
      '; Firestore server read='+read+
      '. Compare the UID with the published rule and Authentication user record.');
  }
  async function startAuto(){
    if(!currentUser || busy)return;
    await currentUser.reload();
    if(!currentUser.emailVerified){notice('Verify your email address before starting cloud sync.');return;}
    // Explicit user action required: never merge differing device and cloud progress.
    busy=true;
    try{
      const initial=new Map();
      for(const key of keys){
        const local=localStorage.getItem(key);
        const cloud=await getDoc(ref(key));
        const remote=cloud.exists()?cloud.data().raw:null;
        if(cloud.exists() && typeof remote!=='string')throw Error('Invalid cloud record: '+key);
        if(local!==null && remote!==null && local!==remote){
          notice('Progress conflict in '+key+'. Export and resolve before enabling autosave.');
          return;
        }
        initial.set(key,{local,remote});
      }
      let restored=0;
      for(const [key,{local,remote}] of initial){
        if(remote===null && local!==null){
          // Creating a missing record cannot overwrite one created concurrently.
          await runTransaction(db,async tx=>{
            const docRef=ref(key),latest=await tx.get(docRef);
            if(latest.exists())throw Error('Another device created '+key+'. Review before syncing.');
            tx.set(docRef,{raw:local,schemaVersion:1,updatedAt:serverTimestamp(),academy});
          });
        }else if(local===null && remote!==null){
          localStorage.setItem(key,remote);
          restored++;
        }
        baseline.set(key,local??remote);
      }
      if(restored){
        status('Cloud save: Restored; reload required');
        notice('Cloud progress downloaded. The academy must reload before autosave can begin.');
        location.reload();
        return;
      }
      autoEnabled=true;
      if(syncTimer)clearInterval(syncTimer);
      syncTimer=setInterval(()=>{void syncChanges()},5000);
      status('Cloud save: Autosave on');
      notice('Autosave enabled for this session. Your existing local and cloud records matched.');
    }finally{busy=false}
  }
  async function syncChanges(){
    if(!autoEnabled || !currentUser || busy || !navigator.onLine)return;
    busy=true;
    try{
      let changed=0;
      for(const key of keys){
        const local=localStorage.getItem(key);
        const previous=baseline.get(key)??null;
        if(local===previous){
          // A second device may have saved newer progress. Adopt it only when
          // this device still equals the version last confirmed by Firebase.
          const cloud=await getDoc(ref(key));
          const remote=cloud.exists()?cloud.data().raw:null;
          if(remote!==previous){
            if(typeof remote!=='string'){
              stopAuto();status('Cloud save: Review required');return;
            }
            // Read the device again after the network request: never replace a
            // lesson that was edited while waiting for the cloud response.
            if(localStorage.getItem(key)!==previous){
              stopAuto();status('Cloud save: Conflict detected');return;
            }
            localStorage.setItem(key,remote);
            stopAuto();status('Cloud save: Updated on another device');
            notice('Newer cloud progress was found and loaded. Reloading the academy.');
            location.reload();return;
          }
          continue;
        }
        if(local===null){stopAuto();status('Cloud save: Review required');return;}
        await runTransaction(db,async tx=>{
          const docRef=ref(key);
          const snap=await tx.get(docRef);
          const remote=snap.exists()?snap.data().raw:null;
          if(remote!==previous)throw Error('Another device changed '+key+'. Autosave paused to protect both versions.');
          tx.set(docRef,{raw:local,schemaVersion:1,updatedAt:serverTimestamp(),academy});
        });
        baseline.set(key,local);
        changed++;
      }
      if(changed)status('Cloud save: Synced');
    }catch(err){
      stopAuto();status('Cloud save: Needs attention');
      console.error('Academy sync paused:',err);
    }finally{busy=false}
  }
  onAuthStateChanged(auth,u=>{stopAuto();currentUser=u;button.textContent=u?'Cloud save: '+(u.email||'Signed in'):'Cloud save: Sign in'});
  button.addEventListener('click',async()=>{
    if(busy)return;
    try{
      if(!currentUser){
        openAuthDialog();return;
      }
      const action=prompt('Cloud save: 1 UPLOAD device progress, 2 RESTORE cloud progress, 3 EXPORT backup, 4 SIGN OUT, 5 ENABLE SAFE AUTOSAVE, 6 TEST FIREBASE CONNECTION, 7 SHOW MY ACCOUNT ID, 8 DIAGNOSE FIREBASE ACCESS, 9 TEST CONFLICT PROTECTION');
      if(action==='1')await upload();
      else if(action==='2')await download();
      else if(action==='3')await backUp();
      else if(action==='4')await signOut(auth);
      else if(action==='5')await startAuto();
      else if(action==='6')await testCloudConnection();
      else if(action==='7'){const id=currentUser.uid;notice('Your Firebase User UID (not a password): '+id);}
      else if(action==='8')await diagnoseAccess();
      else if(action==='9')await testConflictProtection();
    }catch(e){
      const code=e?.code||'';
      const message=code==='permission-denied'
        ? 'Firebase blocked this request. Your account is signed in, but Firestore security rules have not authorized cloud saving yet.'
        : code==='auth/requires-recent-login'
          ? 'Please sign out and sign in again, then retry.'
          : 'Cloud operation failed: '+(code||e?.message||'unknown error');
      notice(message);
    }
  });
}

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
  let statusMessage='Cloud sync ready';
  const status=(message)=>{statusMessage=message;accountStatus.textContent=message;};
  function stopAuto(){autoEnabled=false;baseline.clear();if(syncTimer)clearInterval(syncTimer);syncTimer=null;}
  const theme=academy==='business'
    ? {bg:'#222529',paper:'#f4f0e9',accent:'#b99350',ink:'#25282a',muted:'#756b5c'}
    : {bg:'#071221',paper:'#0b192a',accent:'#dfb978',ink:'#f4e7d0',muted:'#bdc0c4'};
  const styles=document.createElement('style');
  styles.textContent=`
  #academy-account-button{position:fixed;top:calc(env(safe-area-inset-top) + 12px);right:14px;z-index:9998;border:1px solid ${theme.accent};background:${theme.paper};color:${theme.ink};font:600 12px system-ui,sans-serif;padding:10px 15px;border-radius:40px;box-shadow:0 3px 14px #0002;cursor:pointer}
  #academy-welcome{position:fixed;inset:0;z-index:9999;background:${theme.paper};color:${theme.ink};display:flex;align-items:center;justify-content:center;padding:calc(env(safe-area-inset-top) + 24px) 24px calc(env(safe-area-inset-bottom) + 32px);box-sizing:border-box;font-family:system-ui,sans-serif;overflow:auto}
  #academy-welcome[hidden]{display:none}
  #academy-welcome .academy-welcome-inner{width:min(100%,440px);padding:32px 0;display:flex;flex-direction:column;align-items:stretch}
  #academy-welcome .academy-seal{width:60px;height:60px;display:grid;place-items:center;border:1.5px solid ${theme.accent};border-radius:50%;font:30px Georgia,serif;color:${theme.accent};margin-bottom:25px;background:color-mix(in srgb,${theme.accent} 9%,transparent)}
  #academy-welcome .academy-kicker{font-size:10px;letter-spacing:.22em;text-transform:uppercase;font-weight:750;color:${theme.muted};margin-bottom:12px}
  #academy-welcome h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(35px,9vw,46px);font-weight:500;line-height:1.08;margin:0 0 18px;letter-spacing:-.03em}
  #academy-welcome .academy-rule{width:56px;height:2px;background:${theme.accent};margin:0 0 22px}
  #academy-welcome p{font-size:15px;line-height:1.65;color:${theme.muted};margin:0 0 24px;max-width:355px}
  #academy-welcome .academy-benefits{border-top:1px solid ${theme.accent}66;border-bottom:1px solid ${theme.accent}66;padding:15px 0;margin:0 0 27px;display:grid;gap:11px}
  #academy-welcome .academy-benefits span{font-size:13px;color:${theme.ink};display:flex;gap:11px;align-items:center}
  #academy-welcome .academy-benefits b{font:16px Georgia,serif;color:${theme.accent}}
  #academy-welcome button{width:100%;min-height:53px;padding:14px;border-radius:9px;font:650 15px system-ui;cursor:pointer}
  #academy-welcome .academy-primary{background:${theme.bg};color:${theme.paper};border:1px solid ${theme.bg}}
  #academy-welcome .academy-secondary{background:transparent;border:1px solid ${theme.accent};color:${theme.ink};margin-top:12px}
  #academy-welcome .academy-footnote{font-size:11px;line-height:1.6;margin-top:23px;color:${theme.muted};text-align:center}
  @media(max-height:680px){#academy-welcome{align-items:flex-start}#academy-welcome .academy-welcome-inner{padding:14px 0}#academy-welcome .academy-seal{margin-bottom:12px}#academy-welcome .academy-benefits{margin-bottom:15px}}
  #academy-account-menu{position:fixed;top:calc(env(safe-area-inset-top) + 62px);right:14px;width:min(320px,calc(100vw - 28px));z-index:9999;background:${theme.paper};color:${theme.ink};border:1px solid ${theme.accent};border-radius:16px;box-shadow:0 14px 40px #0003;padding:18px;box-sizing:border-box;font:14px system-ui,sans-serif}
  #academy-welcome{background:radial-gradient(circle at 80% 15%,#b58c4027,transparent 45%),linear-gradient(160deg,#07111d,#0c1a2a 65%,#07111d)}
  #academy-welcome .academy-welcome-inner{padding:30px 23px;border:1px solid #b9976075;border-radius:20px;background:#ffffff06;box-shadow:0 18px 45px #0004}
  #academy-welcome h1{color:#eac78e;letter-spacing:.015em;text-transform:uppercase;font-size:clamp(32px,8.2vw,43px)}
  #academy-welcome .academy-kicker{color:#dfb978}
  #academy-welcome .academy-primary{background:linear-gradient(100deg,#bf944e,#f0d28d,#bf944e);color:#091524;border-color:#e4bf78}
  #academy-welcome .academy-secondary{background:#ffffff07}
  #academy-auth-dialog section[role="dialog"]{background:#0b192a!important;color:#f4e7d0!important;border-color:#dfb978!important}
  #academy-auth-dialog input{background:#071221!important;color:#f4e7d0!important;border-color:#a88d60!important}
  #academy-auth-dialog button[type="submit"]{background:#dfb978!important;color:#081526!important}
  #academy-auth-dialog button:not([type="submit"]){color:#f4e7d0!important;border-color:#a88d60!important}
  #academy-account-menu[hidden]{display:none}
  #academy-account-menu button{display:block;width:100%;margin-top:10px;text-align:left;padding:12px;border:1px solid ${theme.accent};border-radius:9px;background:transparent;color:inherit;font:600 13px system-ui;cursor:pointer}
  `;
  document.head.append(styles);
  const button=document.createElement('button');button.type='button';button.id='academy-account-button';button.textContent='Account';button.setAttribute('aria-label','Open academy account');
  document.body.append(button);
  const welcome=document.createElement('section');welcome.id='academy-welcome';welcome.hidden=true;
  const welcomeInner=document.createElement('div');welcomeInner.className='academy-welcome-inner';
  const seal=document.createElement('div');seal.className='academy-seal';seal.textContent='⚖';seal.setAttribute('aria-hidden','true');
  const kicker=document.createElement('div');kicker.className='academy-kicker';kicker.textContent='THE STUDENT LAW PORTAL';
  const welcomeHeading=document.createElement('h1');welcomeHeading.textContent='Law Academy';
  const rule=document.createElement('div');rule.className='academy-rule';rule.setAttribute('aria-hidden','true');
  const welcomeText=document.createElement('p');welcomeText.textContent='Study legal principles, analyze landmark cases, and develop the reasoning of a legal professional.';
  const benefits=document.createElement('div');benefits.className='academy-benefits';
  for(const value of ['Structured academic coursework','Your progress, securely saved','Continue learning across devices']){const item=document.createElement('span');const mark=document.createElement('b');mark.textContent='✓';item.append(mark,document.createTextNode(value));benefits.append(item);}
  const signInButton=document.createElement('button');signInButton.type='button';signInButton.className='academy-primary';signInButton.textContent='Sign in or create account';signInButton.addEventListener('click',()=>openAuthDialog());
  const guestButton=document.createElement('button');guestButton.type='button';guestButton.className='academy-secondary';guestButton.textContent='Preview academy without signing in';guestButton.addEventListener('click',()=>{welcome.hidden=true;});
  const footnote=document.createElement('div');footnote.className='academy-footnote';footnote.textContent='Your existing Academy account works here. No new registration required.';
  welcomeInner.append(seal,kicker,welcomeHeading,rule,welcomeText,benefits,signInButton,guestButton,footnote);welcome.append(welcomeInner);document.body.append(welcome);
  const menu=document.createElement('section');menu.id='academy-account-menu';menu.hidden=true;menu.setAttribute('aria-label','Account settings');
  const accountHeading=document.createElement('strong');accountHeading.textContent='Student account';
  const accountEmail=document.createElement('p');accountEmail.style.cssText='overflow-wrap:anywhere;margin:10px 0;color:inherit';
  const accountStatus=document.createElement('p');accountStatus.setAttribute('role','status');accountStatus.style.cssText='font-size:12px;opacity:.75;margin:10px 0';
  const enableButton=document.createElement('button');enableButton.textContent='Enable safe cloud autosave';enableButton.addEventListener('click',async()=>{try{await startAuto();}catch(e){notice('Sync could not start: '+(e.code||e.message));}updateAccount();});
  const exportButton=document.createElement('button');exportButton.textContent='Export progress backup';exportButton.addEventListener('click',()=>{void backUp();});
  const signOutButton=document.createElement('button');signOutButton.textContent='Sign out';signOutButton.addEventListener('click',async()=>{await signOut(auth);menu.hidden=true;});
  const closeMenuButton=document.createElement('button');closeMenuButton.textContent='Close';closeMenuButton.addEventListener('click',()=>{menu.hidden=true;});
  menu.append(accountHeading,accountEmail,accountStatus,enableButton,exportButton,signOutButton,closeMenuButton);document.body.append(menu);
  button.addEventListener('click',()=>{menu.hidden=!menu.hidden;updateAccount();});
  function updateAccount(){accountEmail.textContent=currentUser?.email||'Not signed in';accountStatus.textContent=statusMessage;enableButton.disabled=!currentUser||autoEnabled;enableButton.textContent=autoEnabled?'Cloud autosave active':'Enable safe cloud autosave';}
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
    overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#081322d9;display:flex;align-items:center;justify-content:center;padding:18px;';
    const panel=document.createElement('section');
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-label','Academy account');
    panel.style.cssText='width:min(100%,400px);max-height:90dvh;overflow:auto;background:#f6f0e5;color:#101d30;border:1px solid #bd9459;border-radius:18px;padding:22px;font:15px system-ui;box-sizing:border-box;';
    const heading=document.createElement('h2');heading.textContent='Your Academy Account';heading.style.cssText='margin:0 0 8px;font-size:22px;';
    const subtitle=document.createElement('p');subtitle.textContent='Sign in to prepare cloud progress syncing. Current on-device lessons are preserved.';subtitle.style.cssText='font-size:13px;line-height:1.5;color:#556174;';
    const form=document.createElement('form');form.style.cssText='display:grid;gap:12px;';
    const email=document.createElement('input');email.type='email';email.autocomplete='email';email.required=true;email.placeholder='Email address';
    const password=document.createElement('input');password.type='password';password.autocomplete='current-password';password.required=true;password.placeholder='Password';password.minLength=6;
    for(const field of [email,password])field.style.cssText='width:100%;box-sizing:border-box;padding:13px;border-radius:9px;border:1px solid #b9ac99;background:#fffdfa;color:#101d30;font-size:16px;';
    const feedback=document.createElement('p');feedback.setAttribute('role','status');feedback.style.cssText='min-height:20px;margin:0;color:#845d29;font-size:13px;';
    const submit=document.createElement('button');submit.type='submit';
    const toggle=document.createElement('button');toggle.type='button';
    const forgot=document.createElement('button');forgot.type='button';forgot.textContent='Forgot password?';
    const resend=document.createElement('button');resend.type='button';resend.textContent='Resend verification email';
    const close=document.createElement('button');close.type='button';close.textContent='Close';
    let create=false;
    const buttonStyle='padding:12px;border-radius:10px;font:600 14px system-ui;cursor:pointer;';
    submit.style.cssText=buttonStyle+'background:#101d30;color:#f6f0e5;border:0;';
    for(const secondary of [toggle,forgot,resend,close])secondary.style.cssText=buttonStyle+'background:transparent;color:#101d30;border:1px solid #bd9459;';
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
  async function testAutosaveRoundTrip(){
    if(!currentUser||busy)return;
    await requireVerifiedAccount();
    busy=true;
    try{
      // Exercise the real compare-and-set autosave pattern on a disposable record.
      const target=ref('cloud-autosave-test-v1');
      const initial=JSON.stringify({phase:'initial',academy});
      const changed=JSON.stringify({phase:'saved',academy});
      await runTransaction(db,async tx=>{
        const previous=await tx.get(target);
        tx.set(target,{raw:initial,schemaVersion:1,updatedAt:serverTimestamp(),academy});
      });
      await runTransaction(db,async tx=>{
        const previous=await tx.get(target);
        if(!previous.exists()||previous.data().raw!==initial)
          throw Error('Autosave baseline changed unexpectedly.');
        tx.set(target,{raw:changed,schemaVersion:1,updatedAt:serverTimestamp(),academy});
      });
      const restored=await getDocFromServer(target);
      if(!restored.exists()||restored.data().raw!==changed)
        throw Error('Autosaved test data was not restored from server.');
      notice('Autosave round-trip passed for '+academy+'. Sample progress was saved and restored; coursework untouched.');
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
  onAuthStateChanged(auth,u=>{
    stopAuto();currentUser=u;menu.hidden=true;
    button.textContent=u?'Account':'Sign in';
    welcome.hidden=Boolean(u);
    updateAccount();
  });
  // Diagnostic actions remain available only in development through console;
  // they are not part of the student-facing account menu.
}

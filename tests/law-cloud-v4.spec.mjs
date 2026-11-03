import {test,expect} from '@playwright/test';

// Offline smoke check only: mocked Firebase imports, no credentials or Firestore writes.
// Real Firebase authentication and syncing require a separately authorized end-to-end test.
test('Firebase v4 bootstraps the cloud-account interface without writing student data',async({page})=>{
 const requests=[];
 await page.route('https://www.gstatic.com/firebasejs/11.10.0/**',async route=>{
   const url=new URL(route.request().url());
   requests.push(url.pathname);
   const name=url.pathname.split('/').pop();
   let module='';
   if(name==='firebase-app.js'){
     module="export function getApps(){return []} export function initializeApp(){return {name:'law-academy'}}";
   }else if(name==='firebase-auth.js'){
     module="export function getAuth(){return {currentUser:null}} export function onAuthStateChanged(a,cb){cb(null);return ()=>{}} export async function signInWithEmailAndPassword(){throw Error('Offline test: credentials disabled')} export async function createUserWithEmailAndPassword(){throw Error('Offline test: accounts disabled')} export async function sendEmailVerification(){} export async function signOut(){}";
   }else if(name==='firebase-firestore.js'){
     module="export function getFirestore(){return {}} export function doc(){throw Error('Cloud access not allowed in smoke test')} export async function getDoc(){throw Error('Cloud read not allowed in smoke test')} export async function runTransaction(){throw Error('Cloud write not allowed in smoke test')} export function serverTimestamp(){return null}";
   }else{throw Error('Unexpected Firebase module '+name)}
   await route.fulfill({status:200,contentType:'text/javascript',body:module,headers:{'access-control-allow-origin':'*'}});
 });
 await page.goto('/');
 await expect(page.locator('#law-cloud-launch')).toContainText('Cloud Account');
 await page.locator('#law-cloud-launch').click();
 await expect(page.getByText('Law Academy · Firebase cloud saving')).toBeVisible();
 await expect(page.getByPlaceholder('Email')).toBeVisible();
 await expect(page.getByPlaceholder('Password')).toBeVisible();
 expect(requests).toEqual(expect.arrayContaining([
   '/firebasejs/11.10.0/firebase-app.js',
   '/firebasejs/11.10.0/firebase-auth.js',
   '/firebasejs/11.10.0/firebase-firestore.js'
 ]));
 await expect(page.locator('#law-cloud-startup-warning')).toHaveCount(0);
});

test('Firebase v4 load errors stay visible without modifying local progress',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('law-academy-level3-v1',JSON.stringify({'L3-1-1':{draft:'Keep this writing'}})));
 await page.route('https://www.gstatic.com/firebasejs/11.10.0/**',route=>route.abort('failed'));
 await page.goto('/');
 await expect(page.locator('#law-cloud-launch')).toContainText('Cloud Load Error v4');
 await expect(page.locator('#law-cloud-startup-warning')).toContainText('Cloud v4 failed');
 const saved=await page.evaluate(()=>localStorage.getItem('law-academy-level3-v1'));
 expect(JSON.parse(saved)['L3-1-1'].draft).toBe('Keep this writing');
});

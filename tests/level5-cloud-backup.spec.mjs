import {test,expect} from '@playwright/test';
// Uses only mocked Firebase modules. No real account, Firestore access or production writes.
test('Level 5 backup is opt-in and read-only until explicit write confirmation',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('law-academy-level5-v1',JSON.stringify({'L5-1-1':{draft:'Original essay kept safely on this device'}})));
 await page.route('https://www.gstatic.com/firebasejs/11.10.0/**',async route=>{
  const name=new URL(route.request().url()).pathname.split('/').pop();
  let code;
  if(name==='firebase-app.js')code="export const getApps=()=>[];export const initializeApp=()=>({name:'law-academy'})";
  if(name==='firebase-auth.js')code="export const getAuth=()=>({currentUser:{uid:'offline-student',email:'verified@example.test',emailVerified:true}});export const onAuthStateChanged=(a,fn)=>{fn(a.currentUser);return ()=>{}};export async function signInWithEmailAndPassword(){};export async function createUserWithEmailAndPassword(){};export async function sendEmailVerification(){};export async function signOut(){};";
  if(name==='firebase-firestore.js')code="export const getFirestore=()=>({});export const doc=(...parts)=>parts.join('/');export async function getDoc(){window.__firebaseReads=(window.__firebaseReads||0)+1;return {exists:()=>false}};export async function runTransaction(){window.__firebaseWrites=(window.__firebaseWrites||0)+1;throw Error('Not permitted in test')};export const serverTimestamp=()=>null;";
  if(!code)throw Error('Unexpected Firebase library: '+name);
  await route.fulfill({status:200,contentType:'text/javascript',body:code,headers:{'access-control-allow-origin':'*'}});
 });
 await page.goto('/');
 await page.locator('#law-cloud-launch').click();
 await page.getByRole('button',{name:'Level 5 manual cloud backup'}).click();
 await expect(page.getByRole('dialog',{name:'Level 5 manual cloud backup'})).toBeVisible();
 await page.getByRole('button',{name:'Compare Level 5 copies (read only)'}).click();
 await expect(page.getByText(/No separate Level 5 cloud copy exists/)).toBeVisible();
 const after=await page.evaluate(()=>({raw:localStorage.getItem('law-academy-level5-v1'),writes:window.__firebaseWrites||0}));
 expect(JSON.parse(after.raw)['L5-1-1'].draft).toBe('Original essay kept safely on this device');
 expect(after.writes).toBe(0);
});

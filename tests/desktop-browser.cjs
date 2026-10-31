/* Browser smoke test for desktop branch. Run with: node tests/desktop-browser.cjs after installing playwright. */
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {setTimeout:delay}=require('node:timers/promises');
const {chromium}=require('playwright');
const fs=require('node:fs');
fs.mkdirSync(require('node:path').resolve(__dirname,'../desktop-test-artifacts'),{recursive:true});
const path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const port=18765;const server=spawn(process.execPath,['-e',`const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{const requested=decodeURIComponent(req.url.split('?')[0]);const file=path.resolve(process.cwd(),'.'+requested);if(!file.startsWith(process.cwd()+path.sep)){res.writeHead(403);return res.end()}const p=fs.existsSync(file)&&fs.statSync(file).isFile()?file:path.join(process.cwd(),'index.html');const ext=path.extname(p);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.webmanifest':'application/manifest+json'})[ext]||'text/plain');fs.createReadStream(p).pipe(res)}).listen(${port},'127.0.0.1')`],{cwd:root,stdio:'ignore'});
 let browser;
 try{
  await delay(750);browser=await chromium.launch({headless:true});
  for(const width of [390,1280,1600]){
   const page=await browser.newPage({viewport:{width,height:900}});
   await page.goto('http://127.0.0.1:'+port+'/index.html',{waitUntil:'domcontentloaded'});
   const launch=page.locator('#academy-desktop-toggle');await launch.waitFor({timeout:10000});
   assert.equal(await launch.isVisible(),true,'launcher should be visible at '+width);
   await launch.click();const dialog=page.locator('#academy-desktop-workspace');
   assert.equal(await dialog.isVisible(),true,'workspace should open');
   await page.locator('#desk-facts').fill('Illustrative agreement was signed.');
   await page.locator('#desk-issue').fill('Whether an enforceable offer existed.');
   await page.locator('#desk-rule').fill('Apply the relevant contractual formation rule.');
   await page.locator('#desk-application').fill('Compare both parties’ arguments.');
   await page.locator('#desk-conclusion').fill('More evidence is required.');
   await page.locator('#desk-brief').click();
   assert.match(await page.locator('#desk-result').innerText(),/enforceable offer/);
   await page.locator('#desk-save').click();
   assert.match(await page.locator('#desk-status').innerText(),/saved/i);
   await page.screenshot({path:path.resolve(root,'desktop-test-artifacts',width+'-workspace.png'),fullPage:true});
   await page.keyboard.press('Escape');
   assert.equal(await dialog.isVisible(),false,'Escape should close workspace');
   await launch.click();
   assert.equal(await page.locator('#desk-facts').inputValue(),'Illustrative agreement was signed.','draft persists after reopening');

   assert.equal(await dialog.isVisible(),true,'workspace should be open after reopening');
   await page.keyboard.press('Escape');
   assert.equal(await dialog.isVisible(),false,'Escape should close reopened workspace');
   assert.equal(await launch.getAttribute('aria-expanded'),'false');
   await page.close();
  }
  console.log('Desktop browser smoke checks passed');
 }finally{if(browser)await browser.close();server.kill();}
})().catch(err=>{console.error(err);process.exitCode=1});

/* Browser smoke test for desktop branch. Run with: node tests/desktop-browser.cjs after installing playwright. */
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {setTimeout:delay}=require('node:timers/promises');
const {chromium}=require('playwright');
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
   await page.keyboard.press('Escape');
   assert.equal(await dialog.isVisible(),false,'Escape should close workspace');
   assert.equal(await launch.getAttribute('aria-expanded'),'false');
   await page.close();
  }
  console.log('Desktop browser smoke checks passed');
 }finally{if(browser)await browser.close();server.kill();}
})().catch(err=>{console.error(err);process.exitCode=1});

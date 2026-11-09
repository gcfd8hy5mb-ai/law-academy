/* Real Chromium regression of actual Level 4 final HTML, scripts and DOM.
 * Run: node scripts/verify-level4-browser.cjs (requires playwright and chromium).
 * Server uses only local repo files; browser fixture intentionally excludes authentication.
 */
const { chromium }=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.cwd();
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{
 const raw=decodeURIComponent((req.url||'/').split('?')[0]);
 const rel=path.normalize(raw).replace(/^[/\\]+/,'');
 const file=path.resolve(root,rel);
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end('missing');return}res.writeHead(200,{'content-type':mime[path.extname(file)]||'text/plain','cache-control':'no-store'});res.end(data)});
});
const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const stop=()=>new Promise(resolve=>server.close(resolve));
const essay=Array(170).fill('Analysis').join(' ');
async function scenario(browser,label,viewport){
 const ctx=await browser.newContext({viewport,...(label==='mobile'?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})});
 await ctx.grantPermissions(['clipboard-read','clipboard-write'],{origin:global.origin});
 const page=await ctx.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept().catch(()=>{}));
 const url=global.origin+'/scripts/fixtures/level4-final-browser.html';
 await page.goto(url,{waitUntil:'load'});
 await page.locator('[data-final]').first().waitFor();
 const names=await page.locator('[data-final]').count();assert.equal(names,7,label+' missing exams');
 await page.locator('[data-final]').first().click();
 const draft=page.locator('#finalDraft');
 await draft.fill(essay);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level4-finals-v1'))['L4-1-FINAL2'].draft),essay,label+' autosave');
 await page.locator('#finalSnapshot').click();
 await page.locator('#finalSubmit').click();
 assert.equal(await page.locator('#finalFeedback').isVisible(),true,label+' feedback');
 assert.equal(await page.locator('#finalCalibration').isVisible(),true,label+' calibration');
 await page.reload({waitUntil:'load'});
 await page.locator('[data-final]').first().click();
 assert.equal(await page.locator('#finalDraft').inputValue(),essay,label+' reload persistence');
 assert.equal(await page.locator('#finalFeedback').isVisible(),true,label+' reload feedback');
 await page.locator('#finalCopyReviewer').click();
 await page.waitForFunction(()=>document.querySelector('#finalReviewerStatus')?.textContent.includes('copied'));
 const copied=await page.evaluate(()=>navigator.clipboard.readText());
 assert.ok(copied.includes(essay)&&copied.includes('Awarded points: ______'),label+' reviewer contents');
 assert.ok(!copied.includes('The trial record needs factual findings on preservation'),label+' model leaked');
 await page.locator('#finalStart').click();
 assert.equal(await page.locator('#finalFeedback').isVisible(),false,label+' reset leaves feedback visible');
 assert.equal(await page.locator('#finalCalibration').isVisible(),false,label+' reset leaves calibration visible');
 assert.equal(await page.locator('#finalDraft').inputValue(),essay,label+' reset erased draft');
 await page.locator('#finalSubmit').click();
 await page.locator('[data-final-restore="0"]').click();
 assert.equal(await page.locator('#finalFeedback').isVisible(),false,label+' snapshot restore left comparison visible');
 assert.equal(await page.locator('#finalCalibration').isVisible(),false,label+' snapshot restore left calibration visible');
 if(label==='mobile'){
  // Overflow may be caused by intentional decorative elements elsewhere; focus on exam input and actions.
  const box=await page.locator('#finalDraft').boundingBox();
  assert.ok(box&&box.x>=-1&&box.x+box.width<=viewport.width+2,'Mobile draft spills off screen: '+JSON.stringify(box));
  assert.equal(await page.locator('#finalCopyReviewer').isVisible(),true,'Reviewer action not accessible on mobile');
 }
 assert.deepEqual(errors,[],label+' JS errors');
 console.log('PASS — real Chromium '+label+': 7 exam links, draft, reload, submit/review, copy, reset, snapshot');
 await ctx.close();
}
(async()=>{
 await listen();const address=server.address();global.origin='http://127.0.0.1:'+address.port;
 let browser;
 try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 await scenario(browser,'desktop',{width:1440,height:900});
 await scenario(browser,'mobile',{width:390,height:844});}
 finally{if(browser)await browser.close();await stop()}
})().catch(e=>{console.error(e);process.exitCode=1});

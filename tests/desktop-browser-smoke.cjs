/* Browser smoke for approved desktop layout. Uses only in-memory student data. */
const {chromium}=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json'};
const root=process.cwd();
const server=http.createServer((req,res)=>{
 const raw=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const resolved=path.resolve(root,'.'+raw);
 if(!resolved.startsWith(root+path.sep)&&resolved!==root){res.writeHead(403);return res.end('Forbidden')}
 const file=fs.existsSync(resolved)&&fs.statSync(resolved).isFile()?resolved:path.join(root,'index.html');
 try{res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))}catch{res.writeHead(404);res.end('Not found')}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port;
 const browser=await chromium.launch({headless:true});const failures=[];
 try{
  for(const width of [1024,1440,1920]){
   const page=await browser.newPage({viewport:{width,height:1050},deviceScaleFactor:1});
   page.on('pageerror',e=>failures.push(width+': '+e.message));
   await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'domcontentloaded'});
   await page.waitForTimeout(1900);
   assert.equal(await page.locator('#law-desktop-workspace').count(),1,'workspace loaded @'+width);
   assert.equal(await page.locator('.law-desktop-workspace').isVisible(),true,'workspace visible @'+width);
   assert.equal(await page.locator('.bottom-nav').count(),1,'navigation exists @'+width);
   const gallery=page.locator('.law-course-gallery');
   assert.equal(await gallery.count(),1,'course gallery exists @'+width);
   const n=await page.locator('.law-gallery-card').count();assert.ok(n>=1,'actual course cards @'+width);
   assert.equal(await page.locator('#law-study-picker').count(),1,'workspace selector @'+width);
   // This static fixture has no Firebase module endpoint. Dismiss only its local cloud-load notice
   // so it cannot block clicks on the independent desktop study workspace.
   await page.locator('#law-cloud-startup-warning').evaluateAll(els=>els.forEach(el=>el.remove()));
   if(width===1440){
    // Five-level desktop navigation inspection uses an isolated browser profile.
    const expected=[
      ['Courses','.level-row[data-course]'],
      ['1L Core Curriculum','[data-l2course]'],
      ['2L Coursework','[data-l3course]'],
      ['3L Practice & Advocacy','[data-l4course]'],
      ['Bar Exam Simulator','#barStartQ']
    ];
    for(let idx=0;idx<expected.length;idx++){
      await page.locator('.bottom-nav [data-nav="courses"]').click();
      if(idx>0)await page.locator('[data-planned="'+idx+'"]').click();
      const [name,selector]=expected[idx];
      assert.equal(await page.locator('.pagehead h1').textContent(),name,'academic level '+(idx+1)+' opens');
      if(idx>0){
        const count=await page.locator(selector).count();
        assert.ok(count>0,'level '+(idx+1)+' authored content or practice control exists');
        assert.equal(await page.locator(selector).first().isVisible(),true,'level '+(idx+1)+' content visible');
      }
      assert.equal(await page.locator('.law-desktop-workspace').isVisible(),true,'workspace remains visible at level '+(idx+1));
      assert.equal(await page.locator('.bottom-nav').isVisible(),true,'navigation remains visible at level '+(idx+1));
    }
    await page.locator('.bottom-nav [data-nav="home"]').click();
    console.log('PASS: Pre-Law, 1L, 2L, 3L and bar practice destinations load in desktop layout');
   }
   if(width===1440){
    const menu=page.locator('.bottom-nav');
    await menu.locator('[data-nav="courses"]').click();
    assert.equal(await page.locator('.law-interior-page .pagehead h1').textContent(),'Courses');
    assert.equal(await page.locator('.law-interior-stats').count(),1,'actual course summary exists');
    await page.locator('.law-interior-shortcuts [data-law-destination="exams"]').click();
    assert.equal(await page.locator('.law-interior-page .pagehead h1').textContent(),'Practice Exams');
    await menu.locator('[data-law-interior-nav="cases"]').click();
    assert.equal(await page.locator('.law-interior-page .pagehead h1').textContent(),'Case Studies & Writing');
    const reasoningCards=page.locator('.law-interior-page [data-reason]');
    const caseCards=page.locator('.law-interior-page [data-sim]');
    const writingCards=page.locator('.law-interior-page [data-write]');
    assert.ok(await reasoningCards.count()>0,'reasoning lab entries are present');
    assert.ok(await caseCards.count()>0,'interactive case study entries are present');
    assert.ok(await writingCards.count()>0,'writing assignments are present');
    assert.equal(await reasoningCards.first().isVisible(),true,'reasoning labs are visible');
    assert.equal(await caseCards.first().isVisible(),true,'case study cards are visible');
    assert.equal(await writingCards.first().isVisible(),true,'writing assignment cards are visible');
    await caseCards.first().click();
    assert.equal(await page.locator('.pagehead h1').count()>0,true,'case simulation actually opens');
    await menu.locator('[data-law-interior-nav="cases"]').click();
    assert.equal(await page.locator('[data-sim]').first().isVisible(),true,'case cards restore after returning');

    await menu.locator('[data-law-interior-nav="progress"]').click();
    assert.equal(await page.locator('.law-interior-page .pagehead h1').textContent(),'My Progress');
    await menu.locator('[data-nav="home"]').click();
    console.log('PASS: Desktop courses, exams, cases and progress navigation');
   }
   if(width===1440){
    await page.locator('.law-gallery-card').first().click();
    await page.locator('[data-lesson]').first().click();
    assert.equal(await page.locator('.law-chapter-outline').count(),1,'lesson chapter outline');
    const firstTitle=await page.locator('.law-reader-shell>h2').textContent();
    await page.locator('[data-law-tab="notes"]').click();
    await page.locator('#law-notes').fill('Desktop QA test: first lesson draft');
    await page.locator('#law-save-notes').click();
    await page.locator('.law-chapter-pager button').filter({hasText:'Next lesson'}).click();
    const secondTitle=await page.locator('.law-reader-shell>h2').textContent();
    assert.notEqual(firstTitle,secondTitle,'next lesson opens');
    assert.equal(await page.locator('#law-notes').inputValue(),'','lesson-specific draft separation');
    await page.locator('#law-notes').fill('Desktop QA test: second lesson draft');
    await page.locator('#law-save-notes').click();
    await page.locator('.law-chapter-pager button').filter({hasText:'Previous lesson'}).click();
    assert.equal(await page.locator('#law-notes').inputValue(),'Desktop QA test: first lesson draft','original lesson notes restored');
    assert.equal(await page.locator('#law-study-picker option').count()>=2,true,'saved lesson picker entries');
    console.log('PASS: Lesson chapter navigation and separate saved research drafts');
   }
   const out='artifacts/law-desktop-'+width+'.png';fs.mkdirSync('artifacts',{recursive:true});
   await page.screenshot({path:out,fullPage:true});
   await page.close();
  }
  assert.equal(failures.length,0,'browser JavaScript errors: '+failures.join('; '));
  console.log('PASS desktop 1024/1440/1920 layouts and runtime; screenshots captured');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});

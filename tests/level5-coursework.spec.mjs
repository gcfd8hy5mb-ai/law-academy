import {test,expect} from '@playwright/test';

test('Level 5 shows seven authored tracks, four lessons each, and the existing simulator link',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel5());
 await expect(page.locator('[data-l5course]')).toHaveCount(7);
 await expect(page.locator('#l5bar')).toBeVisible();
 await page.locator('[data-l5course="0"]').click();
 await expect(page.locator('[data-l5lesson]')).toHaveCount(20);
 await page.locator('[data-l5lesson="0"]').click();
 await expect(page.locator('#l5draft')).toBeVisible();
 await expect(page.getByText('Spokeo, Inc. v. Robins (2016)',{exact:false}).first()).toBeVisible();
});

test('Level 5 draft saves independently, reopens and preserves previously stored older-level progress',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{
   localStorage.setItem('law-academy-level4-v1',JSON.stringify({'L4-1-1':{draft:'Existing Level 4 writing'}}));
   localStorage.removeItem('law-academy-level5-v1');
   renderLevel5();
 });
 await page.locator('[data-l5course="0"]').click();
 await page.locator('[data-l5lesson="0"]').click();
 await page.locator('#l5draft').fill('My advanced law work');
 await expect(page.locator('#l5status')).toContainText('Draft saved on this device');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level5-v1')));
 expect(saved['L5-1-1'].draft).toBe('My advanced law work');
 await page.locator('#l5back').click();
 await page.locator('[data-l5lesson="0"]').click();
 await expect(page.locator('#l5draft')).toHaveValue('My advanced law work');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level4-v1'))['L4-1-1'].draft)).toBe('Existing Level 4 writing');
});

test('Level 5 prevents silent stale-draft overwrite and gates worked reasoning to 100 words',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level5-v1');renderLevel5()});
 await page.locator('[data-l5course="0"]').click();
 await page.locator('[data-l5lesson="0"]').click();
 await page.locator('#l5guide').click();
 await expect(page.locator('#l5guideStatus')).toContainText('at least 100 words');
 await expect(page.locator('#l5worked')).toBeHidden();
 const answer=Array(100).fill('analysis').join(' ');
 await page.locator('#l5draft').fill(answer);
 await page.locator('#l5guide').click();
 await expect(page.locator('#l5worked')).toBeVisible();
 await page.evaluate(()=>localStorage.setItem('law-academy-level5-v1',JSON.stringify({'L5-1-1':{draft:'Newer work from another tab'}})));
 await page.locator('#l5draft').fill('My stale modification');
 await expect(page.locator('#l5status')).toContainText('newer draft exists');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level5-v1'))['L5-1-1'].draft)).toBe('Newer work from another tab');
});

test('All 21 original diagnostic questions are navigable with feedback and no automatic certificate',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel5());
 await page.locator('#l5diagnostic').click();
 for(let n=1;n<=21;n++){
  await expect(page.getByRole('heading',{name:'Question '+n+' of 21'})).toBeVisible();
  await page.locator('input[name="l5dxanswer"]').first().check();
  await page.locator('#l5dxcheck').click();
  await expect(page.locator('#l5dxfeedback')).not.toBeEmpty();
  await page.locator('#l5dxnext').click();
 }
 await expect(page.getByRole('heading',{name:'Diagnostic complete'})).toBeVisible();
 await expect(page.getByText('not a grade, certification or bar-pass prediction',{exact:false})).toBeVisible();
});

test('Integrated final includes six evidentiary exhibits and the student final remains ungraded',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel5());
 await page.locator('[data-l5course="6"]').click();
 await page.locator('[data-l5lesson="3"]').click();
 for(const exhibit of ['Exhibit A','Exhibit B','Exhibit C','Exhibit D','Exhibit E','Exhibit F'])
  await expect(page.getByText(exhibit+':',{exact:false}).first()).toBeVisible();
 await expect(page.getByText('Qualified human assessment required',{exact:false}).first()).toBeVisible();
 await expect(page.locator('#l5draft')).toBeVisible();
});

test('Both Level 5 modules are visible in all seven tracks and second-module finals retain draft IDs',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel5());
 await expect(page.getByText('140 authored draft lessons',{exact:false})).toBeVisible();
 for(let i=0;i<7;i++){
   await page.locator('[data-l5course="'+i+'"]').click();
   await expect(page.locator('[data-l5lesson]')).toHaveCount(20);
   await expect(page.locator('[data-l5lesson="8"]')).toContainText('Written final');
   await page.locator('[data-l5lesson="8"]').click();
   await expect(page.locator('#l5draft')).toBeVisible();
   const originalId='L5-'+(i+1)+'-9';
   await page.locator('#l5draft').fill('Advanced second module exam answer '+originalId);
   const stored=await page.evaluate(id=>JSON.parse(localStorage.getItem('law-academy-level5-v1')||'{}')[id]?.draft,originalId);
   expect(stored).toBe('Advanced second module exam answer '+originalId);
   await page.locator('#l5back').click();
   await page.locator('#l5back').click();
 }
});

test('Third advanced module shows all seven new finals and preserves stable lesson IDs',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level5-v1');renderLevel5()});
 for(let i=0;i<7;i++){
   await page.locator('[data-l5course="'+i+'"]').click();
   await expect(page.locator('[data-l5lesson]')).toHaveCount(20);
   await expect(page.locator('[data-l5lesson="13"]')).toContainText('Written final');
   await page.locator('[data-l5lesson="13"]').click();
   await expect(page.locator('#l5draft')).toBeVisible();
   await page.locator('#l5draft').fill('New level five third module final '+(i+1));
   const expected='L5-'+(i+1)+'-14';
   const stored=await page.evaluate(id=>JSON.parse(localStorage.getItem('law-academy-level5-v1'))[id]?.draft,expected);
   expect(stored).toBe('New level five third module final '+(i+1));
   await page.locator('#l5back').click();
   await page.locator('#l5back').click();
 }
});

test('Original 28 written finals offer an ungraded independent reviewer packet without changing student progress',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel5());
 await page.locator('[data-l5course="0"]').click();
 await page.locator('[data-l5lesson="13"]').click();
 await expect(page.locator('#l5reviewExport')).toBeVisible();
 await page.locator('#l5reviewExport').click();
 await expect(page.locator('#l5reviewStatus')).toContainText('Write a response');
 await page.locator('#l5draft').fill('My independently prepared constitutional analysis and remedial alternatives.');
 await page.locator('#l5reviewExport').click();
 await expect(page.locator('#l5reviewStatus')).toContainText(/review packet|Review packet/i);
 const packet=await page.evaluate(()=>window.LAW_LEVEL5_REVIEW_PACKET.generate(window.LAW_LEVEL5[0].lessons[13],'My independently prepared constitutional analysis and remedial alternatives.'));
 expect(packet).toContain('L5-1-14');
 expect(packet).toContain('My independently prepared constitutional analysis');
 expect(packet).toContain('NO AUTOMATED PASS/FAIL');
 expect(packet).toContain('Examiner signature');
 const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level5-v1')));
 expect(progress['L5-1-14'].draft).toBe('My independently prepared constitutional analysis and remedial alternatives.');
 expect(progress['L5-1-14'].examScore).toBeUndefined();
});

test('Fourth and final Level 5 module preserves 140 distinct lesson IDs and seven exit drafts',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.setItem('law-academy-level5-v1',JSON.stringify({'L5-1-1':{draft:'Original early lesson'}}));renderLevel5()});
 for(let i=0;i<7;i++){
  await page.locator('[data-l5course="'+i+'"]').click();
  await expect(page.locator('[data-l5lesson]')).toHaveCount(20);
  await expect(page.locator('[data-l5lesson="19"]')).toContainText('Written final');
  await page.locator('[data-l5lesson="19"]').click();
  await expect(page.locator('#l5reviewExport')).toBeVisible();
  await page.locator('#l5draft').fill('Exit examination draft '+(i+1));
  expect(await page.evaluate(id=>JSON.parse(localStorage.getItem('law-academy-level5-v1'))[id].draft,'L5-'+(i+1)+'-20')).toBe('Exit examination draft '+(i+1));
  await page.locator('#l5back').click();await page.locator('#l5back').click();
 }
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level5-v1'))['L5-1-1'].draft)).toBe('Original early lesson');
});

test('Case-specific deeper legal workshops appear in each advanced track without interfering with saved drafts',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel5());
 const targets=[1,1,9,6,0,1,9];
 for(let i=0;i<7;i++){
  await page.locator('[data-l5course="'+i+'"]').click();
  const id='L5-'+(i+1)+'-'+(targets[i]+1);
  await page.locator('[data-l5lesson="'+targets[i]+'"]').click();
  await expect(page.locator('[data-l5depth="'+id+'"]')).toBeVisible();
  const summaries=page.locator('[data-l5depth="'+id+'"] summary');
  await expect(summaries).toHaveCount(8);
  await summaries.nth(4).click();
  await expect(page.locator('[data-l5depth="'+id+'"]')).toContainText('Step-by-step lawyering method');
  await expect(page.locator('#l5worked')).toBeHidden();
  await page.locator('#l5draft').fill('Original application for '+id);
  const draft=await page.evaluate(id=>JSON.parse(localStorage.getItem('law-academy-level5-v1'))[id]?.draft,id);
  expect(draft).toBe('Original application for '+id);
  await page.locator('#l5back').click();await page.locator('#l5back').click();
 }
});

test('Second substantive depth batch: all seven course cases and attempt-gated worked examples',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel5());
 const targets=[0,0,0,0,1,0,0];
 for(let i=0;i<7;i++){
   await page.locator('[data-l5course="'+i+'"]').click();
   const id='L5-'+(i+1)+'-'+(targets[i]+1);
   await page.locator('[data-l5lesson="'+targets[i]+'"]').click();
   await expect(page.locator('[data-l5depth="'+id+'"]')).toBeVisible();
   await expect(page.locator('[data-l5depth="'+id+'"] summary')).toHaveCount(8);
   await expect(page.locator('#l5worked')).toBeHidden();
   await page.locator('#l5guide').click();
   await expect(page.locator('#l5guideStatus')).toContainText('at least 100 words');
   await page.locator('#l5draft').fill(Array(105).fill('independent').join(' '));
   await page.locator('#l5guide').click();
   await expect(page.locator('#l5worked')).toBeVisible();
   await expect(page.locator('#l5worked')).toContainText('Case-specific worked application');
   const originalId=id;
   expect(await page.evaluate(id=>JSON.parse(localStorage.getItem('law-academy-level5-v1'))[id]?.guideViewed,originalId)).toBe(true);
   await page.locator('#l5back').click();await page.locator('#l5back').click();
 }
});

test('All 140 Level 5 lessons now expose independent depth study without altering original IDs and finals',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel5());
 const audit=await page.evaluate(()=>({
  tracks:window.LAW_LEVEL5.map(c=>({id:c.id,total:c.lessons.length,deep:c.lessons.filter(l=>l.caseWorkshop).length,finals:c.lessons.filter(l=>l.exam).length})),
  ids:window.LAW_LEVEL5.flatMap(c=>c.lessons.map(l=>l.id)),
  manifest:window.LAW_LEVEL5_DEPTH_WORKSHOPS
 }));
 expect(audit.tracks).toHaveLength(7);
 for(const c of audit.tracks){expect(c.total).toBe(20);expect(c.deep).toBe(20);expect(c.finals).toBe(4)}
 expect(audit.ids).toHaveLength(140);
 expect(new Set(audit.ids).size).toBe(140);
 expect(audit.manifest).toHaveLength(140);
 expect(new Set(audit.manifest).size).toBe(140);
 for(let i=0;i<7;i++){
  await page.locator('[data-l5course="'+i+'"]').click();
  await page.locator('[data-l5lesson="19"]').click();
  await expect(page.locator('[data-l5depth="L5-'+(i+1)+'-20"]')).toBeVisible();
  await expect(page.locator('#l5worked')).toBeHidden();
  await expect(page.locator('#l5reviewExport')).toBeVisible();
  await page.locator('#l5back').click();await page.locator('#l5back').click();
 }
});

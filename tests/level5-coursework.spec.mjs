import {test,expect} from '@playwright/test';

test('Level 5 shows seven authored tracks, four lessons each, and the existing simulator link',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel5());
 await expect(page.locator('[data-l5course]')).toHaveCount(7);
 await expect(page.locator('#l5bar')).toBeVisible();
 await page.locator('[data-l5course="0"]').click();
 await expect(page.locator('[data-l5lesson]')).toHaveCount(4);
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

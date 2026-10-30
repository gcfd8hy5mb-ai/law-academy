import { test, expect } from '@playwright/test';
test('home, catalog, and lesson knowledge check work', async ({page}) => {
 await page.goto('/');
 await expect(page.getByText('Pre-Law Foundations').first()).toBeVisible();
 await page.getByRole('button',{name:/Continue Learning/}).click();
 await expect(page.getByText('Mastery check').or(page.getByText('Knowledge check'))).toBeVisible();
 await page.locator('[data-choice]').first().click();
 await expect(page.locator('#submit')).toBeEnabled();
 await page.locator('#submit').click();
 await expect(page.locator('#feedback')).not.toBeEmpty();
});
test('navigation and progress persist across reload',async ({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Continue Learning/}).click();
 const question=await page.locator('.question strong').first().textContent();
 await page.reload();
 await page.getByRole('button',{name:/Continue Learning/}).click();
 await expect(page.locator('.question strong').first()).toHaveText(question);
});
test('case studies and study labs open',async({page})=>{
 await page.goto('/');
 await page.locator('#caseStudiesHome').click();
 await expect(page.getByText('Case Studies & Writing')).toBeVisible();
 await page.locator('[data-reason]').first().click();
 await expect(page.locator('#reasonText')).toBeVisible();
 await page.locator('#reasonText').fill('A saved legal reasoning test response.');
 await page.locator('#reasonSave').click();
 await page.reload();
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-reason]').first().click();
 await expect(page.locator('#reasonText')).toHaveValue('A saved legal reasoning test response.');
});

test('course practice examination presents questions and selectable answers',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await expect(page.getByRole('heading',{name:'Practice Exams',exact:true})).toBeVisible();
 await page.locator('[data-exam]').first().click();
 await expect(page.locator('[data-exam-choice]')).toHaveCount(4);
 await page.locator('[data-exam-choice]').first().click();
 await expect(page.locator('#nextQuestion')).toBeEnabled();
 await page.locator('#nextQuestion').click();
 await expect(page.getByRole('heading',{name:/Question 2 of/})).toBeVisible();
});
test('case simulation investigation and notes persist',async({page})=>{
 await page.goto('/');
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-sim]').first().click();
 await expect(page.locator('#simText')).toBeVisible();
 await page.locator('#simBranchOptions button').first().click();
 await page.locator('#simText').fill('Evidence analysis from browser regression test.');
 await page.locator('#simSave').click();
 await page.reload();
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-sim]').first().click();
 await expect(page.locator('#simText')).toHaveValue('Evidence analysis from browser regression test.');
 await expect(page.locator('#simBranchOutcome')).not.toBeEmpty();
});
test('research portfolio stage and saved writing survive reload',async({page})=>{
 await page.goto('/');
 await page.locator('#caseStudiesHome').click();
 await page.locator('#researchCapstoneLaunch').click();
 await page.locator('#capstoneWriting').fill('My test question presented and preliminary legal research.');
 await page.locator('#capstoneSave').click();
 await page.reload();
 await page.locator('#caseStudiesHome').click();
 await page.locator('#researchCapstoneLaunch').click();
 await expect(page.locator('#capstoneWriting')).toHaveValue('My test question presented and preliminary legal research.');
 await page.locator('#capstoneNext').click();
 await expect(page.locator('#capstoneWriting')).toBeVisible();
});

test('six-subject written final saves its first essay after reload',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await page.locator('#writtenFinalLaunch').click();
 await expect(page.locator('#finalEssayText')).toBeVisible();
 await page.locator('#finalEssayText').fill('Written final test: analyze the issue, authority, competing claims and remedy.');
 await page.locator('#finalEssaySave').click();
 await page.reload();
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await page.locator('#writtenFinalLaunch').click();
 await expect(page.locator('#finalEssayText')).toHaveValue('Written final test: analyze the issue, authority, competing claims and remedy.');
});

test('written final review checklist persists and essay portfolio copies',async({page,context})=>{
 await page.addInitScript(() => { Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__copiedPortfolio=value},readText:async()=>window.__copiedPortfolio||''}}); });
 await page.goto('/');
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await page.locator('#writtenFinalLaunch').click();
 await page.locator('#finalEssayText').fill('Issue: statutory authority. Rule: governing law requires verification. Application: both sides dispute the record. Conclusion: further research is necessary.');
 await page.locator('#finalEssayNext').click();
 for(let i=1;i<6;i++) await page.locator('#finalEssayNext').click();
 await expect(page.getByRole('heading',{name:'Written Final Review'})).toBeVisible();
 const boxes=page.locator('#finalReviewChecks input[type=checkbox]');
 await expect(boxes).toHaveCount(30);
 await boxes.first().check();
 await page.reload();
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await page.locator('#writtenFinalLaunch').click();
 for(let i=0;i<6;i++) await page.locator('#finalEssayNext').click();
 await expect(page.locator('#finalReviewChecks input[type=checkbox]').first()).toBeChecked();
 await page.locator('#finalEssayCopy').click();
 await expect(page.locator('#finalCopyStatus')).toContainText('copied');
 const clipboard=await page.evaluate(()=>navigator.clipboard.readText());
 expect(clipboard).toContain('LAW ACADEMY — LEVEL 1 EXTERNAL REVIEW BRIEF');
 expect(clipboard).toContain('\nREVIEWER INSTRUCTIONS\n');
 expect(clipboard).toContain('Issue: statutory authority');
});
test('Level 1 academic readiness does not claim graduation from practice alone',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('Graduation remains locked')).toBeVisible();
 await expect(page.getByText(/Independent evaluation of source accuracy/)).toBeVisible();
});

test('Level 1 readiness tracks written final drafting without unlocking graduation',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('Draft all six written final responses')).toBeVisible();
 await expect(page.getByText('Develop substantive written final answers')).toBeVisible();
 await expect(page.getByText('Graduation remains locked')).toBeVisible();
 await page.getByRole('button',{name:/Draft all six written final responses/}).click();
 await expect(page.locator('#finalEssayText')).toBeVisible();
});

test('academic sign-off explicitly requires independent and supervised assessment',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('Academic sign-off standards')).toBeVisible();
 await expect(page.getByText(/qualified independent reviewer must examine/)).toBeVisible();
 await expect(page.getByText(/Current decision:.*Not signed off/)).toBeVisible();
 await expect(page.getByText('Graduation remains locked')).toBeVisible();
});

test('written final autosaves when page reloads without pressing Save',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await page.locator('#writtenFinalLaunch').click();
 await page.locator('#finalEssayText').fill('Autosaved draft without explicit save.');
 await page.reload();
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await page.locator('#writtenFinalLaunch').click();
 await expect(page.locator('#finalEssayText')).toHaveValue('Autosaved draft without explicit save.');
});
test('research capstone autosaves without pressing Save',async({page})=>{
 await page.goto('/');
 await page.locator('#caseStudiesHome').click();
 await page.locator('#researchCapstoneLaunch').click();
 await page.locator('#capstoneWriting').fill('Research answer saved as typed.');
 await page.reload();
 await page.locator('#caseStudiesHome').click();
 await page.locator('#researchCapstoneLaunch').click();
 await expect(page.locator('#capstoneWriting')).toHaveValue('Research answer saved as typed.');
});

test('reasoning lab autosaves without pressing Save',async({page})=>{
 await page.goto('/');
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-reason]').first().click();
 await page.locator('#reasonText').fill('Unsubmitted reasoning draft retained on reload.');
 await page.reload();
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-reason]').first().click();
 await expect(page.locator('#reasonText')).toHaveValue('Unsubmitted reasoning draft retained on reload.');
});
test('oral defense notes autosave without pressing Save',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await page.locator('#oralLaunch').click();
 await page.locator('[data-hearing]').first().click();
 await page.locator('#oralNotes').fill('Oral argument notes retained automatically.');
 await page.reload();
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await page.locator('#oralLaunch').click();
 await page.locator('[data-hearing]').first().click();
 await expect(page.locator('#oralNotes')).toHaveValue('Oral argument notes retained automatically.');
});

test('writing assignment autosaves without pressing Save',async({page})=>{
 await page.goto('/');
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-write]').first().click();
 await page.locator('#writingDraft').fill('A factual summary and a qualified legal conclusion.');
 await page.reload();
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-write]').first().click();
 await expect(page.locator('#writingDraft')).toHaveValue('A factual summary and a qualified legal conclusion.');
});

test('failed progress storage offers retry instead of marking a lesson complete',async({page})=>{
 await page.addInitScript(()=>{
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){if(key==='law-academy-progress-v1')throw new DOMException('Storage unavailable','QuotaExceededError');return original.call(this,key,value)};
 });
 await page.goto('/');
 await page.getByRole('button',{name:/Continue Learning/}).click();
 await page.locator('[data-choice="1"]').click();
 await page.locator('#submit').click();
 await expect(page.getByRole('alert')).toContainText('Progress could not be saved');
 await expect(page.locator('#submit')).toHaveText('Retry saving');
 await page.locator('#submit').click();
 await expect(page.getByRole('alert')).toContainText('Still unable to save progress');
});

test('lesson saving can recover after storage becomes available again',async({page})=>{
 await page.addInitScript(()=>{
  window.__blockProgressWrites=true;
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
   if(key==='law-academy-progress-v1'&&window.__blockProgressWrites)throw new DOMException('Quota exceeded','QuotaExceededError');
   return original.call(this,key,value);
  };
 });
 await page.goto('/');
 await page.getByRole('button',{name:/Continue Learning/}).click();
 await page.locator('[data-choice="1"]').click();
 await page.locator('#submit').click();
 await expect(page.locator('#submit')).toHaveText('Retry saving');
 await page.evaluate(()=>{window.__blockProgressWrites=false});
 await page.locator('#submit').click();
 await expect(page.getByText('Introduction to American Law').first()).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('1 / 85 completed')).toBeVisible();
});

test('six written-final answers are reflected in readiness without academic sign-off',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await page.locator('#writtenFinalLaunch').click();
 for(let i=0;i<6;i++){
   await page.locator('#finalEssayText').fill('Draft '+(i+1)+': legal issues, primary authority to verify, factual application, and opposing arguments.');
   await page.locator('#finalEssayNext').click();
 }
 await expect(page.getByRole('heading',{name:'Written Final Review'})).toBeVisible();
 await expect(page.getByText('6 of 6 responses drafted.')).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('6 / 6 essays drafted (not graded)')).toBeVisible();
 await expect(page.getByText('Graduation remains locked')).toBeVisible();
});

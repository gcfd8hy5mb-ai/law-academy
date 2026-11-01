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
 await expect(page.locator('.review-item p').filter({hasText:'Current decision:'})).toContainText('Not signed off');
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
 await page.reload();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('0 / 85 completed')).toBeVisible();
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
 await expect(page.getByText(/6 of 6 responses drafted/)).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('6 / 6 essays drafted (not graded)')).toBeVisible();
 await expect(page.getByText('Graduation remains locked')).toBeVisible();
});

test('Pre-Law closeout distinguishes authored curriculum from student performance',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('Pre-Law closeout overview')).toBeVisible();
 await expect(page.getByText(/Six courses and 85 expanded lessons/)).toBeVisible();
 await expect(page.getByText(/0 \/ 9 formative checkpoints met/)).toBeVisible();
 await expect(page.getByText(/Pending independent written-work evaluation/)).toBeVisible();
 await expect(page.getByText('Graduation remains locked')).toBeVisible();
});

test('lesson completion remains credited after revisiting a previously passed lesson',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Continue Learning/}).click();
 await page.locator('[data-choice="1"]').click();
 await page.locator('#submit').click();
 await expect(page.locator('#submit')).toHaveText('Back to course');
 await page.locator('#submit').click();
 await page.reload();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('1 / 85 completed')).toBeVisible();
 await expect(page.getByText('Graduation remains locked')).toBeVisible();
});

test('completed lesson is retained after reopening and retrying its knowledge check',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Continue Learning/}).click();
 await page.locator('[data-choice="1"]').click();
 await page.locator('#submit').click();
 await expect(page.locator('#submit')).toHaveText('Back to course');
 await page.locator('#submit').click();
 await expect(page.getByText('Introduction to American Law').first()).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('1 / 85 completed')).toBeVisible();
});

test('six applied Pre-Law assessments open and retain writing after reload',async({page})=>{
 await page.goto('/');
 await page.locator('#appliedLaunch').click();
 await expect(page.getByText('Pre-Law Applied Assessments')).toBeVisible();
 await expect(page.locator('[data-applied]')).toHaveCount(6);
 await page.locator('[data-applied="0"]').click();
 await page.locator('#appliedDraft').fill('Issue: disputed local law. Rule and jurisdiction require primary source verification. Both sides have arguments.');
 await expect(page.locator('#appliedStatus')).toContainText('Saved on this device');
 await page.reload();
 await page.locator('#appliedLaunch').click();
 await page.locator('[data-applied="0"]').click();
 await expect(page.locator('#appliedDraft')).toHaveValue(/disputed local law/);
 await page.locator('#appliedBack').click();
 await expect(page.locator('[data-applied="0"]')).toContainText('Draft saved');
});
test('applied Pre-Law assignments do not unlock academic graduation',async({page})=>{
 await page.goto('/');
 await page.locator('#appliedLaunch').click();
 await page.locator('[data-applied="5"]').click();
 await expect(page.getByText('Only a qualified independent reviewer')).toBeVisible();
 await page.locator('#appliedBack').click();
 await page.locator('#appliedClose').click();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('Graduation remains locked')).toBeVisible();
});

test('each applied assessment displays its subject-specific reasoning guide',async({page})=>{
 await page.goto('/');
 await page.locator('#appliedLaunch').click();
 for(let i=0;i<6;i++){
   await page.locator('[data-applied="'+i+'"]').click();
   await expect(page.getByRole('heading',{name:'Reasoning guide'})).toBeVisible();
   await expect(page.locator('.review-item ol li')).toHaveCount(3);
   await expect(page.getByRole('heading',{name:'Research starting point'})).toBeVisible();
   await page.locator('#appliedBack').click();
 }
});

test('applied writing feedback flags missing topics but never awards a grade',async({page})=>{
 await page.goto('/');
 await page.locator('#appliedLaunch').click();
 await page.locator('[data-applied="3"]').click();
 await page.locator('#appliedDraft').fill('A customer fell on a slippery floor.');
 await page.locator('#appliedFeedback').click();
 await expect(page.getByRole('heading',{name:'Draft structure feedback — not a grade'})).toBeVisible();
 await expect(page.locator('#appliedFeedbackResult')).toContainText('Keyword detection does not evaluate correctness');
 await expect(page.locator('#appliedFeedbackResult li').first()).toBeVisible();
 await page.reload();
 await page.locator('#appliedLaunch').click();
 await page.locator('[data-applied="3"]').click();
 await expect(page.locator('#appliedDraft')).toHaveValue('A customer fell on a slippery floor.');
});

test('each applied assessment has substantive review criteria',async({page})=>{
 await page.goto('/');
 await page.locator('#appliedLaunch').click();
 for(let i=0;i<6;i++){
  await page.locator('[data-applied="'+i+'"]').click();
  await expect(page.getByRole('heading',{name:'Substantive reviewer checklist'})).toBeVisible();
  await expect(page.locator('.review-item').filter({has:page.getByRole('heading',{name:'Substantive reviewer checklist'})}).locator('li')).toHaveCount(3);
  await page.locator('#appliedBack').click();
 }
});

test('Pre-Law source guidance identifies controlling law limitations',async({page})=>{
 await page.goto('/');
 await page.locator('#appliedLaunch').click();
 await page.locator('[data-applied="5"]').click();
 await expect(page.getByText(/ABA Model Rule 1.18 discusses prospective-client/)).toBeVisible();
 await expect(page.locator('a[href*="rule_1_18_duties_of_prospective_client"]')).toBeVisible();
 await page.locator('#appliedBack').click();
 await page.locator('[data-applied="2"]').click();
 await expect(page.getByText(/Identify the state before selecting binding statutes/)).toBeVisible();
});


test('Level 2 first-year law lessons open and save a knowledge check',async({page})=>{
 await page.goto('/');
 await page.locator('[data-level="1"]').click();
 await expect(page.getByRole('heading',{name:'1L Core Curriculum'})).toBeVisible();
 await page.locator('[data-l2course="0"]').click();
 await page.locator('[data-l2lesson="0"]').click();
 await expect(page.getByRole('heading',{name:'Offer, acceptance and consideration'})).toBeVisible();
 await page.locator('#l2draft').fill('The changed terms may be a counteroffer, depending on governing law.');
 await page.locator('input[name="l2choice"][value="0"]').check();
 await page.locator('#l2submit').click();
 await expect(page.locator('#l2result')).toContainText('Correct.');
 await page.reload();
 await page.locator('[data-level="1"]').click();
 await page.locator('[data-l2course="0"]').click();
 await page.locator('[data-l2lesson="0"]').click();
 await expect(page.locator('#l2draft')).toHaveValue(/changed terms may be a counteroffer/);
});


test('Level 2 writing examination saves all independent answers',async({page})=>{
 await page.goto('/');
 await page.locator('[data-level="1"]').click();
 await page.locator('#l2exam').click();
 await expect(page.getByRole('heading',{name:'Timed 1L Writing Exam'})).toBeVisible();
 await expect(page.locator('textarea[id^="l2exam"]')).toHaveCount(7);
 await page.locator('#l2exam0').fill('Discuss UCC goods, contract formation, and remedies.');
 await page.locator('#l2examBack').click();
 await page.locator('#l2exam').click();
 await expect(page.locator('#l2exam0')).toHaveValue(/Discuss UCC goods/);
});


test('Level 2 practice exam requires seven responses before submitting',async({page})=>{
 await page.goto('/');
 await page.locator('[data-level="1"]').click();
 await page.locator('#l2exam').click();
 await expect(page.locator('#l2examClock')).toContainText('minutes remain');
 await page.locator('#l2examSubmit').click();
 await expect(page.locator('#l2examStatus')).toContainText('0/7 present');
 for(let i=0;i<7;i++)await page.locator('#l2exam'+i).fill('Issue, rule, analysis of the disputed facts, counterargument and qualified conclusion for prompt '+i);
 await page.locator('#l2examSubmit').click();
 await expect(page.locator('#l2examStatus')).toContainText('Submitted locally. No score');
 await expect(page.locator('#l2exam0')).toBeDisabled();
 await page.reload();
 await page.locator('[data-level="1"]').click();
 await page.locator('#l2exam').click();
 await expect(page.locator('#l2exam0')).toBeDisabled();
 await expect(page.locator('#l2examClock')).toContainText('submitted');
});


test('Real court cases require reasoned prediction before revealing verified outcome',async({page})=>{
 await page.goto('/');
 await page.locator('[data-level="1"]').click();
 await page.locator('#l2realcases').click();
 await expect(page.getByRole('heading',{name:'Decide the Real Case'})).toBeVisible();
 await expect(page.locator('[data-reveal]')).toHaveCount(5);
 await page.locator('[data-reveal="0"]').click();
 await expect(page.locator('#realcaseResult0')).toContainText('Select a prediction');
 await page.locator('input[name="realcase0"][value="1"]').check();
 await page.locator('#realcaseDraft0').fill('A reasonable person would view signed words as objective assent.');
 await page.locator('[data-reveal="0"]').click();
 await expect(page.locator('#realcaseResult0')).toContainText('Virginia Supreme Court');
 await expect(page.locator('#realcaseResult0 a')).toHaveAttribute('href',/law.justia.com/);
});

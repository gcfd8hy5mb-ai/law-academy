/* Read-only Level 4 curriculum structural test.
 * Run from repo root: node scripts/verify-level4.cjs
 * DOES NOT validate substantive legal accuracy, source holdings or browser persistence.
 */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const paths=['level4.js','level4-case-labs-2026.js','level4-case-labs-batch2-2026.js','level4-case-labs-batch3-2026.js','level4-case-labs-batch4-2026.js','level4-assessment-key-balance-2026.js','level4-advanced-questions-batch1-2026.js','level4-advanced-questions-course1-2026.js','level4-advanced-questions-course2-2026.js','level4-advanced-questions-course3-2026.js','level4-advanced-questions-course4-2026.js','level4-advanced-questions-course5-2026.js','level4-advanced-questions-course6-2026.js','level4-advanced-questions-course7-2026.js','level4-advanced-questions-balance-2026.js','level4-advanced-question-authority-audit-batch1-2026.js','level4-advanced-question-authority-audit-remaining92-2026.js','level4-rule-currency-2026.js','level4-formative-rubrics-2026.js','level4-worked-guides-batch2-2026.js','level4-worked-guides-batch3-2026.js','level4-worked-guides-batch3-capstone-2026.js','level4-worked-guides-batch4a-2026.js','level4-worked-guides-batch4b-2026.js','level4-authority-checks-batch1-2026.js','level4-legal-updates-final-2026.js','level4-current-law-checks-nov2026.js','level4-100-lesson-completion-audit-2026.js','level4-audit-inventory-2026.js'];
const sandbox={window:{}};vm.createContext(sandbox);
for(const file of paths){vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file,timeout:3000})}
const courses=sandbox.window.LAW_LEVEL4,lessons=courses.flatMap(c=>c.lessons),ids=lessons.map(l=>l.id);
assert.equal(courses.length,7);
assert.equal(lessons.length,100);
assert.equal(new Set(ids).size,100,'Duplicate lesson IDs');
assert.deepEqual(Array.from(courses,c=>c.lessons.length),[14,14,14,14,14,14,16]);
for(const l of lessons){
  assert.ok(l.title&&l.authority&&l.scenario&&l.reading&&l.assignment&&l.counterarguments,'Missing content '+l.id);
  assert.ok(l.question&&Array.isArray(l.options)&&l.options.length>=3&&Number.isInteger(l.answer)&&l.options[l.answer]&&l.why,'Incomplete MCQ '+l.id);
  assert.ok(l.workedGuide,'Missing worked guide '+l.id);
  for(const key of ['threshold','analysis','counter','variations','source','exemplar','status']) assert.ok(typeof l.workedGuide[key]==='string'&&l.workedGuide[key].length>=20,'Incomplete guide '+l.id+':'+key);
  assert.ok(l.formativeRubric||l.examRubric,'Missing written review rubric '+l.id);
  if(l.formativeRubric)assert.equal(l.formativeRubric.criteria.reduce((n,c)=>n+c.points,0),100,'Rubric score mismatch '+l.id);
}
const newCurrency=lessons.filter(l=>(l.legalCurrencyAlerts||[]).some(a=>a.asOf==='2026-11-09'));
assert.ok(newCurrency.length>=9,'Dated 2026 legal currency update missing');
assert.ok(lessons.find(l=>l.id==='L4-4-14').legalCurrencyAlerts.some(a=>a.type==='CASA_2025'),'Missing Supreme Court injunction-scope update');
assert.ok(lessons.find(l=>l.id==='L4-2-13').legalCurrencyAlerts.some(a=>a.type==='USSG2026'),'Missing 2026 sentencing rules');
const advanced=lessons.filter(l=>l.advancedQuiz2026);
assert.equal(advanced.length,100,'All 100 lessons should include an advanced question');
assert.equal(new Set(advanced.map(l=>l.advancedQuiz2026.question)).size,100,'Repeated advanced question stems');
for(const l of advanced){
 const q=l.advancedQuiz2026;
 assert.equal(q.id,l.id,'Challenge associated with wrong lesson');
 assert.ok(q.question.length>=65,'Short or generic advanced challenge '+l.id);
 assert.ok(q.options.length===3&&new Set(q.options).size===3,'Non-distinct options '+l.id);
 assert.ok(Number.isInteger(q.answer)&&q.options[q.answer],'Invalid challenge answer '+l.id);
 assert.ok(q.why.length>=55,'Insufficient advanced explanation '+l.id);
 assert.ok(q.status.includes('independent'),'Review status missing '+l.id);
}
assert.deepEqual([0,1,2].map(k=>advanced.filter(l=>l.advancedQuiz2026.answer===k).length),[34,33,33]);
assert.deepEqual(Array.from(courses,c=>c.lessons.filter(l=>l.advancedQuiz2026).length),[14,14,14,14,14,14,16]);
assert.equal(advanced.filter(l=>l.advancedQuiz2026.rebalanced2026).length,86,'Must preserve earlier 14 question-key positions');
const authorityChecks=advanced.filter(l=>l.advancedQuiz2026.authorityReview);
assert.equal(authorityChecks.length,100,'Every advanced question requires an audit record');
assert.equal(authorityChecks.filter(l=>l.advancedQuiz2026.authorityReview.sourceFamilyReviewed).length,92,'Exactly 92 source-family internal reviews expected');
assert.equal(authorityChecks.filter(l=>!l.advancedQuiz2026.authorityReview.sourceFamilyReviewed).length,8,'Retain eight bounded earlier source checks');
assert.ok(authorityChecks.every(l=>l.advancedQuiz2026.authorityReview.sourceUrls.length>0),'Missing sources');
assert.ok(authorityChecks.every(l=>l.advancedQuiz2026.authorityReview.independentApproval===false),'False professional signoff');
assert.ok(authorityChecks.every(l=>l.advancedQuiz2026.authorityReview.legalAccuracyCertified===false),'No key should claim full legal certification');
assert.ok(authorityChecks.every(l=>l.advancedQuiz2026.authorityReview.sourceUrls.every(u=>typeof u==='string'&&u.startsWith('https://'))),'Malformed source URL');
assert.ok(authorityChecks.filter(l=>l.advancedQuiz2026.authorityReview.sourceFamilyReviewed).every(l=>l.advancedQuiz2026.authorityReview.answerHashBasis===l.advancedQuiz2026.options[l.advancedQuiz2026.answer]),'Unreviewed keyed answer drift');
const distribution=[0,1,2].map(k=>lessons.filter(l=>l.answer===k).length);
assert.deepEqual(distribution,[34,33,33],'Unbalanced course quiz correct-option indices');
assert.ok(lessons.every(l=>l.answerOrderBalanced2026===true),'Unbalanced assessment module not loaded');
const finalsSandbox={window:{}};vm.createContext(finalsSandbox);
vm.runInContext(fs.readFileSync('level4-practical-finals-data.js','utf8'),finalsSandbox);
const finals=finalsSandbox.window.LAW_LEVEL4_FINALS;
assert.equal(finals.length,7,'Missing Level 4 course final');
assert.equal(new Set(finals.map(f=>f.id)).size,7,'Duplicate final IDs');
const finalsDistribution=[0,1,2].map(k=>finals.filter(f=>f.answer===k).length);
assert.deepEqual(finalsDistribution,[2,3,2],'Predictable correct-answer position in finals');
const packetWindow={window:finalsSandbox.window};vm.createContext(packetWindow);
vm.runInContext(fs.readFileSync('level4-practical-final-case-packets-2026.js','utf8'),packetWindow);
vm.runInContext(fs.readFileSync('level4-final-examiner-calibration-2026.js','utf8'),packetWindow);
vm.runInContext(fs.readFileSync('level4-independent-review-export-2026.js','utf8'),packetWindow);
const exportReview=packetWindow.window.LAW_LEVEL4_REVIEW_PACKET.generate;
assert.equal(typeof exportReview,'function','Reviewer packet exporter absent');
for(const f of finals){
 const distinctive='CANDIDATE ANSWER TEST: '+f.id+' legal analysis with citations.';
 const sheet=exportReview(f,distinctive);
 assert.ok(sheet.includes(distinctive),'Student answer not exported '+f.id);
 assert.ok(sheet.includes('Awarded points: ______'),'Blind reviewer blank scores missing '+f.id);
 assert.ok(sheet.includes(f.casePacket.exhibits[0][0]),'Evidence exhibit absent '+f.id);
 assert.ok(sheet.includes(f.rubric[0].name),'Review rubric absent '+f.id);
 assert.ok(!sheet.includes(f.modelReasoning),'Model reasoning leaked into blind reviewer packet '+f.id);
 assert.ok(!sheet.includes('Provisional self-rating: '),'Self-assessment leaked '+f.id);
 assert.ok(sheet.includes('Reviewer identifier: __________'),'Reviewer identity field missing '+f.id);
}

for(const f of finals){
 const p=f.casePacket;
 assert.ok(p,'Missing practical final evidence packet '+f.id);
 const calibration=f.examinerCalibration2026;
 assert.ok(calibration,'Missing examiner calibration '+f.id);
 assert.equal(calibration.criteria.length,6,'Must have six domain-specific scoring anchors '+f.id);
 assert.equal(calibration.criteria.reduce((n,c)=>n+c.maxPoints,0),100,'Calibration total mismatch '+f.id);
 assert.ok(calibration.criteria.every((c,i)=>c.name===f.rubric[i].name&&c.maxPoints===f.rubric[i].points),'Calibration not matched to rubric '+f.id);
 assert.ok(calibration.criteria.every(c=>c.strong.length>90&&c.developing.length>65&&c.inadequate.length>65),'Weak provisional anchor '+f.id);
 assert.equal(calibration.externallyApproved,false,'False external approval '+f.id);
 assert.ok(calibration.errorFlag.length>80&&calibration.uncertainty.length>80,'Missing critical-error guidance '+f.id);
 assert.equal(p.exhibits.length,6,'Expected six exhibits '+f.id);
 assert.ok(p.timeline.length>=6,'Missing chronological evidence '+f.id);
 assert.ok(p.unknowns.length>=5,'Missing unresolved fact prompts '+f.id);
 assert.ok(p.changedFacts.length>=2&&p.benchmarks.length>=4,'Missing changed facts or benchmarks '+f.id);
}
for(const f of finals){
 assert.ok(f.options[f.answer]&&f.why&&f.modelReasoning,'Missing checkpoint answer or rationale '+f.id);
 assert.equal(f.rubric.reduce((n,r)=>n+r.points,0),100,'Final rubric total invalid '+f.id);
 assert.equal(f.requirements.length,5,'Final submission instructions missing '+f.id);
}
const audit=sandbox.window.LAW_LEVEL4_COMPLETION_AUDIT.records;
assert.equal(audit.length,100);assert.deepEqual(new Set(audit.map(r=>r.id)),new Set(ids));
assert.ok(audit.every(r=>Object.values(r.authoring).every(Boolean)),'Authoring gap in register');
assert.ok(audit.every(r=>r.review.independentReviewerApproved===false),'Improper signoff flag');
assert.ok(audit.every(r=>r.review.legalPropositionsVerified===false),'False verified flag');
assert.equal(sandbox.window.LAW_LEVEL4_AUDIT.records.length,100);
const ix=fs.readFileSync('index.html','utf8');
for(const p of paths.slice(0,-1))assert.ok(ix.includes('./'+p),'Not loaded in HTML: '+p);
assert.ok(ix.indexOf('level4-100-lesson-completion-audit-2026.js')<ix.indexOf('level4-ui.js'),'Audit loaded after UI');
assert.ok(ix.indexOf('level4-legal-updates-final-2026.js')<ix.indexOf('level4-ui.js'),'Legal addenda loaded after UI');
const ui=fs.readFileSync('level4-ui.js','utf8');
new Function(ui);
assert.ok(ui.includes('completionPanel')&&ui.includes('legalUpdates'),'Missing status panels');
const finalsUi=fs.readFileSync('level4-practical-finals-ui.js','utf8');
new Function(finalsUi);
assert.ok(finalsUi.includes('finalCalibration')&&finalsUi.includes('saved.finished'),'Missing post-submission examiner comparison');
assert.ok(finalsUi.includes('finalCopyReviewer')&&finalsUi.includes('finalReviewerFallback'),'Reviewer export and fallback missing');
assert.ok(ui.includes('l4AdvancedCheck')&&ui.includes('advancedQuiz2026Choice'),'Supplemental case quiz is not wired into lesson view');
console.log('PASS — 100 distinct Level 4 lessons and advanced questions; all rubrics and guides; balanced answer positions; seven final exams; script load order');
console.log('NOT TESTED — live Safari/desktop clipboard UX, cloud/local persistence, independent legal sources or grading');

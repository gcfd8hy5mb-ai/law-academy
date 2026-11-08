/* Read-only Level 4 curriculum structural test.
 * Run from repo root: node scripts/verify-level4.cjs
 * DOES NOT validate substantive legal accuracy, source holdings or browser persistence.
 */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const paths=['level4.js','level4-case-labs-2026.js','level4-case-labs-batch2-2026.js','level4-case-labs-batch3-2026.js','level4-case-labs-batch4-2026.js','level4-assessment-key-balance-2026.js','level4-advanced-questions-batch1-2026.js','level4-rule-currency-2026.js','level4-formative-rubrics-2026.js','level4-worked-guides-batch2-2026.js','level4-worked-guides-batch3-2026.js','level4-worked-guides-batch3-capstone-2026.js','level4-worked-guides-batch4a-2026.js','level4-worked-guides-batch4b-2026.js','level4-authority-checks-batch1-2026.js','level4-legal-updates-final-2026.js','level4-100-lesson-completion-audit-2026.js','level4-audit-inventory-2026.js'];
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
const advanced=lessons.filter(l=>l.advancedQuiz2026);
assert.equal(advanced.length,14,'Expected 14 supplemental case-reasoning questions');
for(const l of advanced){
 const q=l.advancedQuiz2026;
 assert.equal(q.id,l.id,'Challenge associated with wrong lesson');
 assert.ok(q.question.length>75,'Short or generic advanced challenge '+l.id);
 assert.ok(q.options.length===3&&new Set(q.options).size===3,'Non-distinct options '+l.id);
 assert.ok(Number.isInteger(q.answer)&&q.options[q.answer],'Invalid challenge answer '+l.id);
 assert.ok(q.why.length>65,'Insufficient advanced explanation '+l.id);
 assert.ok(q.status.includes('independent'),'Review status missing '+l.id);
}
assert.deepEqual([0,1,2].map(k=>advanced.filter(l=>l.advancedQuiz2026.answer===k).length),[5,5,4]);
assert.deepEqual(Array.from(courses,c=>c.lessons.filter(l=>l.advancedQuiz2026).length),[2,2,2,2,2,2,2]);
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
for(const f of finals){
 const p=f.casePacket;
 assert.ok(p,'Missing practical final evidence packet '+f.id);
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
assert.ok(ui.includes('l4AdvancedCheck')&&ui.includes('advancedQuiz2026Choice'),'Supplemental case quiz is not wired into lesson view');
console.log('PASS — 100 distinct Level 4 lessons, guides, rubrics, audit flags, loading order and UI syntax');
console.log('NOT TESTED — live Safari/desktop UX, cloud/local persistence, independent legal sources or grading');

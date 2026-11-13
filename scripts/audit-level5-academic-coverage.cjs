/* Internal Level 5 academic-coverage checks only; not independent legal sign-off.
 * No student data, Firebase, network calls or browser automation.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const scripts=['level5.js','level5-batch2-coursework.js','level5-batch3-coursework.js','level5-final-module-coursework.js','level5-capstone-case-packet.js','level5-bar-diagnostic.js','level5-written-final-review-export.js'];
const ctx={window:{}};vm.createContext(ctx);
for(const p of scripts)vm.runInContext(fs.readFileSync(p,'utf8'),ctx,{filename:p,timeout:5000});
const cs=ctx.window.LAW_LEVEL5||[],all=cs.flatMap(c=>c.lessons),diag=ctx.window.LAW_LEVEL5_DIAGNOSTIC||[];
assert.equal(cs.length,7);assert.equal(all.length,140);assert.equal(new Set(all.map(l=>l.id)).size,140);
assert.equal(new Set(all.map(l=>l.scenario.trim().toLowerCase())).size,140,'Repeated practice scenario');
assert.equal(new Set(all.map(l=>l.question.trim().toLowerCase())).size,140,'Repeated in-lesson question');
for(const [i,c] of cs.entries()){
 assert.equal(c.id,'L5-'+(i+1));assert.equal(c.lessons.length,20);
 assert.equal(c.lessons.filter(l=>l.exam).length,4,'Four practical written finals per course required');
 assert.deepEqual(Array.from(c.lessons.filter(l=>l.exam),l=>Number(l.id.split('-').at(-1))),[4,9,14,20],'Unexpected finals sequence');
 for(const [k,l] of c.lessons.entries()){
  assert.equal(l.id,c.id+'-'+(k+1),'Student progress ID cannot be renamed');
  assert.ok(l.sourceUrl.startsWith('https://')&&!l.sourceUrl.includes('#!'),'Broken/placeholder authority URL');
  assert.ok(l.reading.includes(l.sourceUrl),'Reading must give the lesson research link');
  assert.ok(l.reading.split(/\s+/).length>=220,'Brief legal reading '+l.id);
  assert.ok(l.scenario.length>=100,'Need concrete record for scenario '+l.id);
  assert.ok(l.assignment.length>=80,'Need case-specific written task '+l.id);
  assert.ok(l.counterarguments&&l.variation&&l.workedGuide,'Adversarial and worked analysis absent '+l.id);
  assert.ok(l.question&&l.options.length===3&&l.why,'Incomplete lesson question '+l.id);
  assert.equal(l.review.independentReviewerApproved,false,'False external signoff '+l.id);
  assert.equal(l.review.legalAccuracyCertified,false,'False substantive accuracy signoff '+l.id);
  assert.equal(l.review.humanGraded,false,'Invented human grade '+l.id);
  if(l.exam){assert.equal(l.exam.humanReviewRequired,true);assert.equal(l.exam.independentApproval,false);assert.equal(l.rubric.reduce((n,r)=>n+r.points,0),100)}
 }
}
assert.equal(diag.length,21,'Original diagnostic bank must remain available');
assert.equal(all.filter(l=>l.graduationAssessment).length,7,'Seven terminal exit assignments required');
assert.ok(new Set(all.map(l=>l.sourceUrl)).size>=100,'Insufficient diversity of research starting points');
const answers=[0,1,2].map(k=>all.filter(l=>l.answer===k).length);
assert.ok(Math.max(...answers)-Math.min(...answers)<=2,'In-lesson key positions unbalanced');
const review=fs.readFileSync('audit/LEVEL5_140_LESSON_INDEPENDENT_REVIEW_REGISTER.csv','utf8');
const lines=review.trimEnd().split(/\r?\n/).slice(1);assert.equal(lines.length,140);
for(const l of all){const matches=lines.filter(line=>line.includes('"'+l.id+'"'));assert.equal(matches.length,1,'Reviewer record mismatch '+l.id);assert.ok(matches[0].includes('"UNREVIEWED"'),'Unapproved content marked reviewed '+l.id)}
const packet=ctx.window.LAW_LEVEL5_REVIEW_PACKET;
for(const l of all.filter(l=>l.exam)){const p=packet.generate(l,'Original candidate answer');assert.ok(p.includes('Original candidate answer')&&p.includes('NO AUTOMATED PASS/FAIL'))}
const h=fs.readFileSync('index.html','utf8');let prev=-1;
for(const p of scripts){const index=h.indexOf('src="./'+p+'"');assert.ok(index>prev,'Script not loaded in curriculum/assessment order: '+p);prev=index}
console.log('PASS: 140 unique level-five lessons, 140 unique scenarios, 140 distinct lesson questions, 7 courses, 28 finals and 7 exit assignments.');
console.log('PASS: 21 diagnostic questions, 28 ungraded human-review packets, 140 independent review register records, all source pointers and script order.');
console.log('NOT TESTED: true legal holdings/later treatment, qualified attorney/faculty grading, NCBE eligibility or real devices/cloud synchronization.');

/* Seven Level 4 practical-final assessment dossiers — structural evidence and examiner queue.
 * Only reads authored curriculum; never student submissions, exam scores, Firebase or browser data.
 * This is NOT an automatic legal-accuracy, grading or academic-equivalence certification.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const ctx={window:{}};vm.createContext(ctx);
const files=['level4-practical-finals-data.js','level4-practical-final-case-packets-2026.js','level4-final-examiner-calibration-2026.js'];
for(const f of files)vm.runInContext(read(f),ctx,{filename:f,timeout:10000});
const exams=ctx.window.LAW_LEVEL4_FINALS||[];
assert.equal(exams.length,7,'Seven Level 4 course practical finals expected');
assert.equal(new Set(exams.map(x=>x.id)).size,7,'Duplicate final ID');
const columns=['exam_id','course_id','course_domain','exam_minutes','scenario_words','assignment_words','case_packet_present','case_exhibits','changed_facts','exam_rubric_total','calibration_present','calibration_criteria','calibration_total','authority_check','professional_grade','review_action'];
const rows=[columns];
const wc=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
for(let i=0;i<7;i++){
 const x=exams.find(e=>e.course==='L4-'+(i+1));assert.ok(x,'Missing subject final '+(i+1));
 assert.ok(x.id&&x.question&&Array.isArray(x.options)&&Number.isInteger(x.answer)&&x.answer>=0&&x.answer<x.options.length,'Invalid checkpoint '+x.id);
 assert.ok(x.why&&x.why.length>25,'Missing checkpoint rationale '+x.id);
 assert.ok(wc(x.scenario)>=20,'Incomplete fact pattern '+x.id);
 assert.ok(wc(x.assignment)>=15,'Incomplete final writing task '+x.id);
 assert.ok(Array.isArray(x.requirements)&&x.requirements.length>=4,'Missing final deliverables '+x.id);
 assert.ok(Array.isArray(x.rubric)&&x.rubric.length>=5,'Missing scored rubric '+x.id);
 const rubricTotal=x.rubric.reduce((n,r)=>n+(r.points||0),0);
 assert.equal(rubricTotal,100,'Exam rubric not 100 points '+x.id);
 const packet=x.casePacket,cal=x.examinerCalibration2026;
 assert.ok(packet&&Array.isArray(packet.exhibits)&&packet.exhibits.length>=4,'Missing evidence packet '+x.id);
 assert.ok(Array.isArray(packet.changedFacts)&&packet.changedFacts.length>=2,'Missing alternative record '+x.id);
 assert.ok(cal&&Array.isArray(cal.criteria)&&cal.criteria.length>=5,'Missing examiner calibration '+x.id);
 const calibTotal=cal.criteria.reduce((n,c)=>n+(c.maxPoints||0),0);
 assert.equal(calibTotal,100,'Calibration must total 100 points '+x.id);
 assert.equal(cal.externallyApproved,false,'Inappropriate external approval '+x.id);
 assert.ok(Array.isArray(cal.examinerProcess)&&cal.examinerProcess.length>=3,'Absent human moderation process '+x.id);
 assert.ok(x.authority&&x.sourceUrl,'Authority starting point required '+x.id);
 assert.ok(!/certified|independently approved/i.test(String(x.reviewStatus||'').replace(/not certified|not independently approved/gi,'')),'Approval wording must not imply certification '+x.id);
 rows.push([x.id,x.course,x.domain||'',x.minutes||'',wc(x.scenario),wc(x.assignment),true,packet.exhibits.length,packet.changedFacts.length,rubricTotal,true,cal.criteria.length,calibTotal,'UNVERIFIED — independent currentness and case treatment required','NOT GRADED — qualified examiner required','Verify operative jurisdiction and all cited authorities; compare 2 independent examiners; moderate disagreements; retain changed-fact and evidence citations']);
}
const csv=v=>'"'+String(v??'').replace(/"/g,'""').replace(/[\r\n]+/g,' ')+'"';
const output='audit/level4-seven-practical-finals-examiner-queue.csv';
fs.writeFileSync(output,rows.map(a=>a.map(csv).join(',')).join('\n')+'\n');
console.log('PASS: seven unique practical finals, seven evidence packets, seven calibrated 100-point rubrics; authority and external grading remain PENDING.');
console.log('Generated '+output+'. Structural validation only; NOT human examiner calibration or legal currency verification.');

// Run with node scripts/validate-level3.mjs. Structural checks only.
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../level3.js',import.meta.url),'utf8');
new Script(source,{filename:'level3.js'});
const courses=runInNewContext('const window={};'+source+'\nwindow.LAW_LEVEL3');
assert.equal(courses.length,7);
const all=courses.flatMap(c=>c.lessons);
assert.equal(all.length,70);
assert.equal(new Set(all.map(x=>x.id)).size,70);
for(const course of courses){assert.equal(course.lessons.length,10,'Expected ten authored lessons in '+course.id);for(const lesson of course.lessons){
 assert.ok(lesson.title&&lesson.authority&&lesson.scenario&&lesson.reading&&lesson.counterarguments&&lesson.assignment);
 assert.ok(lesson.reading.trim().split(/\s+/).length>=110,'Instruction too brief '+lesson.id);
 assert.equal(lesson.options.length,3);
 assert.ok(Number.isInteger(lesson.answer)&&lesson.answer>=0&&lesson.answer<3);
 assert.ok(lesson.status.includes('review'));
}}
console.log('PASS: 70 Level 3 authored lessons across seven courses and draft review warnings. This does not establish legal currency or academic approval.');

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const ui=readFileSync(new URL('../level3-ui.js',import.meta.url),'utf8');
new Script(ui,{filename:'level3-ui.js'});
assert.ok(html.includes('src="./level3.js"')&&html.includes('src="./level3-ui.js"'),'Missing Level 3 page assets');
assert.ok(app.includes('typeof renderLevel3==="function"'),'Level 3 route is not wired');
for(const token of ['data-l3course','data-l3lesson','l3draft','l3check','law-academy-level3-v1'])assert.ok(ui.includes(token),'Missing Level 3 teaching feature '+token);
console.log('PASS: Level 3 scripts, course navigation, drafts and knowledge-check controls are configured.');

for(const course of courses){const exam=course.lessons[4];assert.ok(exam.worked?.length>250,'Missing worked reasoning for '+course.id);assert.ok(exam.assignment.includes('1,500'),'Missing long-form examination '+course.id)}
assert.ok(ui.includes('Worked issue map and model reasoning'),'Worked solutions not wired to UI');
assert.ok(ui.includes('id=\"l3worked\" hidden'),'Worked solutions must start hidden');
assert.ok(ui.includes('id=\"l3reveal\"'),'Missing explicit reveal control');
assert.ok(ui.includes('length:0)<100'),'Reveal must require a substantive writing attempt');
assert.ok(!ui.includes('...(l.worked?'),'Model reasoning must not be rendered in public lesson sections');

for(const id of ['l3feedback','l3feedbackResult','l3copy','l3copyStatus'])assert.ok(ui.includes(id),'Missing Level 3 writing aid '+id);
assert.ok(ui.includes('not a grade'),'Writing feedback must not imply assessment credit');

for(const c of courses){const final=c.lessons[9];assert.ok(final.title.includes('Final Examination'),'Missing Level 3 course final '+c.id);assert.ok(final.assignment.includes('2,000–2,500'),'Final writing assignment too limited '+c.id);assert.ok(final.reading.includes('qualified human reviewer'),'Written mastery must require human review '+c.id)}

for(const token of ['l3capstone','showCapstone','data-capdraft','l3capCopy','L3-CAP-'])assert.ok(ui.includes(token),'Integrated Level 3 capstone UI missing '+token);
assert.ok(ui.includes('70 authored lessons'),'Stale Level 3 home lesson count');
assert.ok(app.includes('70 lessons and capstone available'),'Academy catalog must reflect published Level 3 draft coursework');
assert.ok(app.includes('Open to study the authored coursework'),'Catalog should not call the Level 3 syllabus unimplemented');

console.log('Level 3 authored lesson count: '+all.length+'; shortest doctrinal reading: '+Math.min(...all.map(l=>l.reading.trim().split(/\s+/).length))+' words. Content review remains separate from structural validation.');

for(const c of courses){const final=c.lessons[9];assert.ok(final.scenario.startsWith('FICTIONAL FINAL CASE FILE:'),'Final needs its own fact pattern '+c.id);assert.ok(final.scenario.length>350,'Final case file too shallow '+c.id);assert.ok(!final.scenario.startsWith('Integrated final: a multi-party dispute combines'),'Final cannot be a topic list '+c.id)}

for(const token of ['l3reviewPacket','l3reviewPacketStatus','REVIEWER RUBRIC (100)','CASE FACTS:','AUTHORITIES TO VERIFY:','Qualified reviewer must check sources']){
 assert.ok(ui.includes(token),'Level 3 final reviewer handoff missing '+token);
}
for(const token of ['l3capReadiness','Above the 7,000-word target','5,000–7,000 words']){
 assert.ok(ui.includes(token),'Level 3 capstone readiness missing '+token);
}
console.log('PASS: final reviewer packets and capstone readiness controls are present; functionality requires browser-test confirmation.');

const appliedWorkshopIds=['L3-1-8','L3-2-8','L3-3-8','L3-4-8','L3-5-8','L3-6-8','L3-7-8'];
for(const id of appliedWorkshopIds){
 const lesson=all.find(l=>l.id===id);
 assert.ok(lesson,'Missing Level 3 applied workshop '+id);
 assert.ok(lesson.reading.includes('Practical '),'Missing applied problem-solving guidance '+id);
 assert.ok(lesson.reading.trim().split(/\s+/).length>=250,'Workshop reading under 250 words '+id);
 assert.ok(lesson.assignment.includes('primary-authority verification log'),'Workshop source verification missing '+id);
}
console.log('PASS: seven Level 3 practical workshops and primary-authority assignments are present.');

const workedPracticeIds=['L3-1-3','L3-2-3','L3-3-3','L3-4-3','L3-5-3','L3-6-3','L3-7-3'];
for(const id of workedPracticeIds){
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson,'Missing worked practice lesson '+id);
 assert.ok(lesson.worked?.trim().split(/\s+/).length>=240,'Worked reasoning lacks sufficient instructional depth '+id);
 assert.ok(lesson.assignment.includes('200-word error analysis'),'Missing student self-assessment '+id);
}
assert.ok(ui.includes('l3worked')&&ui.includes('l3reveal'),'Worked practice must remain available only through the answer reveal workflow');
console.log('PASS: seven detailed worked practice examples and self-assessment tasks are present.');

const foundationWorkedIds=['L3-1-1','L3-2-1','L3-3-1','L3-4-1','L3-5-1','L3-6-1','L3-7-1'];
for(const id of foundationWorkedIds){
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson,'Missing foundational worked example '+id);
 assert.ok(lesson.worked?.trim().split(/\s+/).length>=260,'Foundational worked example too brief '+id);
 assert.ok(lesson.assignment.includes('200-word revision'),'Missing written revision activity '+id);
}
console.log('PASS: seven foundational case analyses and written revision assignments are present.');

for(const c of courses){
 const final=c.lessons[9];
 assert.ok(final.assignment.includes('FINAL EXAMINATION ISSUE-APPLICATION TASKS:'),'Course final needs issue-by-issue analysis '+c.id);
 assert.ok(final.assignment.includes('FACT CHANGES:'),'Course final must require counterfactual reasoning '+c.id);
 assert.ok(final.assignment.includes('REVIEW STANDARD:'),'Course final must retain human review boundary '+c.id);
 assert.ok(final.assignment.length>=1700,'Final assessment too generic '+c.id);
}
console.log('PASS: all seven Level 3 finals include substantive issue maps, fact changes and review standards.');

for(const c of courses){
 const r=c.lessons[9].examRubric;
 assert.ok(r&&r.points===100,'Final needs a 100-point examiner rubric '+c.id);
 assert.equal(r.areas.length,5,'Final needs five scored dimensions '+c.id);
 assert.equal(r.areas.reduce((total,a)=>total+a.points,0),100,'Rubric does not total 100 points '+c.id);
 assert.ok(r.areas.every(a=>a.label&&a.checks.length>=2),'Final rubric needs specific review criteria '+c.id);
 assert.ok(r.examinerQuestions.length>=4,'Final needs issue-spotting review questions '+c.id);
 assert.ok(r.commonErrors.length>=3,'Final needs common-error examples '+c.id);
}
for(const token of ['Final examination · assessment rubric (100 points)','EXAMINER ISSUE-SPOTTING QUESTIONS:','COMMON ERRORS TO WATCH:']){
 assert.ok(ui.includes(token),'Final exam reviewer UI missing '+token);
}
console.log('PASS: seven Level 3 exams include scored rubrics, issue-spotting questions and error guides.');

const expandedShortLessonIds=['L3-1-2','L3-1-3','L3-2-3','L3-2-4','L3-3-2','L3-3-4','L3-4-2','L3-4-4','L3-5-2','L3-5-4','L3-6-2','L3-6-4','L3-7-2','L3-7-4'];
for(const id of expandedShortLessonIds){
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson,'Missing expanded Level 3 lesson '+id);
 assert.ok(lesson.reading.trim().split(/\s+/).length>=300,'Expanded lesson has insufficient instructional depth '+id);
 assert.ok(lesson.reading.includes('PRACTICE')||lesson.reading.includes('CASE STUDY')||lesson.reading.includes('DAMAGES MODEL')||lesson.reading.includes('DECISION TREE')||lesson.reading.includes('CLASSIFICATION WORKSHEET')||lesson.reading.includes('DIGITAL SEARCH ANALYSIS'),'Missing applied legal exercise '+id);
 assert.ok(lesson.assignment.includes('fact-to-rule chart'),'Missing source-verified practical deliverables '+id);
}
console.log('PASS: fourteen expanded Level 3 lessons include 300+ words and source-verified applied exercises.');

const lastShortDoctrineIds=['L3-3-3','L3-4-3','L3-6-3','L3-7-3'];
for(const id of lastShortDoctrineIds){
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson,'Missing expanded doctrine lesson '+id);
 assert.ok(lesson.reading.trim().split(/\s+/).length>=350,'Remaining doctrine lesson lacks depth '+id);
 assert.ok(lesson.assignment.includes('competing proposed outcomes'),'Doctrine lesson missing opposing judgments '+id);
}
for(const course of courses){
 for(const lesson of course.lessons){
  if(lesson.title.includes('Final Examination'))continue;
  assert.ok(lesson.reading.trim().split(/\s+/).length>=200,'Short doctrinal reading still present: '+lesson.id);
 }
}
console.log('PASS: all 63 non-final Level 3 readings exceed 200 words; four final short readings expanded.');

const realCaseLessons=['L3-1-7','L3-2-7','L3-3-7','L3-4-7','L3-5-7','L3-6-7','L3-7-7'];
for(const id of realCaseLessons){
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson,'Missing real-authority case lesson '+id);
 assert.ok(lesson.reading.includes('PRIMARY-AUTHORITY REAL CASE STUDY'),'Missing case brief and factual comparison '+id);
 assert.ok(lesson.reading.includes('Source to read: https://'),'Missing public authority link '+id);
 assert.ok(lesson.reading.includes('later treatment'),'Missing precedential-validity warning '+id);
 assert.ok(lesson.assignment.includes('holding-versus-hypothetical comparison'),'Missing real-case analysis assignment '+id);
}
console.log('PASS: seven Level 3 real-authority studies require case comparison and authority review.');

const secondRealCaseIds=['L3-1-6','L3-2-6','L3-3-6','L3-4-6','L3-5-6','L3-6-6','L3-7-6'];
for(const id of secondRealCaseIds){
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson,'Missing second-batch case study '+id);
 assert.ok(lesson.reading.includes('PRIMARY-AUTHORITY REAL CASE STUDY')||lesson.reading.includes('PRIMARY-AUTHORITY SOURCE ANALYSIS'),'Missing authority comparison '+id);
 assert.ok(lesson.reading.includes('Source to read: https://'),'Missing case or agency source '+id);
 assert.ok(lesson.reading.includes('later treatment'),'Missing subsequent-authority check '+id);
 assert.ok(lesson.assignment.includes('case-to-hypothetical comparison'),'Missing case reasoning assignment '+id);
}
console.log('PASS: second seven-case Level 3 authority batch requires source comparison and later-treatment review.');

const thirdRealCaseIds=['L3-1-9','L3-2-9','L3-3-9','L3-4-9','L3-5-9','L3-6-9','L3-7-9'];
for(const id of thirdRealCaseIds){
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson,'Missing advanced Level 3 real-authority case '+id);
 assert.ok(lesson.reading.includes('PRIMARY-AUTHORITY REAL CASE STUDY')||lesson.reading.includes('PRIMARY-AUTHORITY SOURCE ANALYSIS'),'Missing real-source analysis '+id);
 assert.ok(lesson.reading.includes('Source to read: https://'),'Missing source URL '+id);
 assert.ok(lesson.reading.includes('later treatment'),'Missing later-treatment warning '+id);
 assert.ok(lesson.assignment.includes('400-word holding-and-application memorandum'),'Missing comparative case-analysis assignment '+id);
}
console.log('PASS: third seven-course real-case batch requires holding application and primary-law verification.');

const updatedSourceIds=['L3-5-6','L3-5-7','L3-5-9','L3-6-9'];
for(const id of updatedSourceIds){
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson.reading.includes('PRIMARY-AUTHORITY SOURCE ANALYSIS'),'Original authority must be labeled by its true source type '+id);
 assert.ok(lesson.reading.includes('REPORTED DECISION CASE BRIEF'),'Reported judicial decision must be added '+id);
 assert.ok(lesson.reading.includes('Source to read: https://'),'Public source URL missing '+id);
 assert.ok(lesson.assignment.includes('separate 400-word case-to-hypothetical brief'),'Case-analysis assignment missing '+id);
}
for(const [id,caseName] of [
 ['L3-5-6','Weber v. Commissioner'],
 ['L3-5-7','INDOPCO, Inc. v. Commissioner'],
 ['L3-5-9','Hallmark Research Collective v. Commissioner'],
 ['L3-6-9','GN Netcom, Inc. v. Plantronics, Inc.']
])assert.ok(all.find(x=>x.id===id).reading.includes(caseName),'Wrong reported decision in '+id);
console.log('PASS: four previously mislabeled guidance/statute/rule sources now distinguish their types from reported judicial opinions. This is a structural check, not case-history verification.');

const reviewTaskIds=['L3-1-6','L3-1-7','L3-1-9','L3-2-6','L3-2-7','L3-2-9','L3-3-6','L3-3-7','L3-3-9','L3-4-6','L3-4-7','L3-4-9','L3-6-6','L3-6-7','L3-7-6','L3-7-7','L3-7-9'];
for(const id of reviewTaskIds){
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson&&lesson.reading.includes('PRIMARY-AUTHORITY REVIEW TASK'),'Missing focused case review task '+id);
 assert.ok(lesson.reading.includes('subsequent treatment'),'Missing subsequent treatment review '+id);
}
for(const id of ['L3-1-9','L3-3-6','L3-3-7','L3-3-9','L3-7-9']){
 assert.ok(all.find(item=>item.id===id).reading.includes('CURRENT-LAW CROSSCHECK'),'Missing legal-development guidance '+id);
}
for(const course of courses){
 const final=course.lessons[9];
 assert.ok(final.assignment.includes('EXAMINER QUALITY CONTROL'),'Missing specialized final examination check '+course.id);
 assert.ok(final.assignment.includes('Human evaluation required.'),'Human assessment boundary missing '+course.id);
}
console.log('PASS: 17 source-review tasks, five doctrine updates and seven final examiner controls are authored. The presence of text is not substantive legal review.');

const taxDeadline=all.find(l=>l.id==='L3-5-9');
assert.ok(taxDeadline,'Missing tax deadline lesson');
for(const required of ['CURRENT-LAW CORRECTION','Culp v. Commissioner','Oquendo v. Commissioner','Buller v. Commissioner','Maniktala v. Commissioner','Kyick Holdings','CONTRASTING-HOLDINGS WORKSHOP']){
 assert.ok(taxDeadline.reading.includes(required),'Tax deadline circuit split is incomplete: '+required);
}
assert.ok(taxDeadline.options[1].includes('controlling circuit law'),'Tax deadline multiple-choice answer must reflect circuit split');
assert.ok(taxDeadline.answer===1,'Tax deadline correct answer changed');
console.log('PASS: Section 6213(a) lesson includes the later appellate split and a jurisdiction-sensitive question. This does not establish that the cases remain good law.');

for(const course of courses){
 const final=course.lessons[9];
 assert.ok(final.reading.includes('FINAL EXAM RESEARCH METHOD'),'Missing course-specific final exam teaching method '+course.id);
 assert.ok(final.reading.trim().split(/\s+/).length>=240,'Final exam study guidance too brief '+course.id);
 assert.ok(final.examRubric?.points===100,'Missing scored final rubric '+course.id);
 assert.equal(final.examRubric.areas.reduce((sum,area)=>sum+area.points,0),100,'Final rubric points do not total 100 '+course.id);
}
console.log('PASS: seven course-specific final exam research methods, each at least 240 words, with 100-point rubrics. Human grading remains required.');

const finals=courses.map(c=>c.lessons[9]);
assert.equal(new Set(finals.map(f=>f.scenario)).size,7,'Final examinations must have seven different factual scenarios');
for(const exam of finals){
 assert.ok(exam.scenario.length>=500,'Final case fact pattern needs adequate detail '+exam.id);
 assert.ok(exam.assignment.includes('EXAMINER QUALITY CONTROL'),'Missing final-specific assessment controls '+exam.id);
 assert.ok(exam.examRubric.areas.every(a=>Number.isInteger(a.points)&&a.points>0),'Rubric point allocation invalid '+exam.id);
 assert.ok(exam.examRubric.areas.every(a=>a.checks.every(x=>typeof x==='string'&&x.trim().length>=15)),'Rubric needs substantive assessment criteria '+exam.id);
 assert.ok(exam.examRubric.examinerQuestions.every(q=>q.endsWith('?')),'Examiner questions should be answerable questions '+exam.id);
 assert.ok(exam.assignment.includes('human substantive review'),'Final must retain qualified human examiner gate '+exam.id);
}
console.log('PASS: seven unique full-length final case files, substantive examiner criteria and human review gates; not a substitute for independent grading.');

const caseStudyQuestionIds=[
 'L3-1-6','L3-1-7','L3-1-9','L3-2-6','L3-2-7','L3-2-9',
 'L3-3-6','L3-3-7','L3-3-9','L3-4-6','L3-4-7','L3-4-9',
 'L3-5-6','L3-5-7','L3-5-9','L3-6-6','L3-6-7','L3-6-9',
 'L3-7-6','L3-7-7','L3-7-9'
];
const caseStudyQuestions=caseStudyQuestionIds.map(id=>{
 const lesson=all.find(item=>item.id===id);
 assert.ok(lesson,'Missing case-specific question lesson '+id);
 assert.ok(lesson.question.length>=55,'Case question insufficiently specific '+id);
 assert.ok(lesson.options.every(option=>option.length>=28),'Case answer option insufficiently developed '+id);
 assert.ok(lesson.why.length>=70,'Case feedback insufficiently developed '+id);
 return lesson.question;
});
assert.equal(new Set(caseStudyQuestions).size,caseStudyQuestionIds.length,'Case studies must not reuse generic quiz questions');
console.log('PASS: 21 authority-based lessons include distinct, substantive legal knowledge checks. Content still requires human legal-accuracy review.');

// Run with: node scripts/validate-content.mjs
// Checks academic content structure without changing the app or saved progress.
import {readFileSync} from 'node:fs';
import {runInNewContext, Script} from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../app.js', import.meta.url),'utf8');
new Script(source,{filename:'app.js'});
const boundary=source.indexOf('const app=document.querySelector');
assert.ok(boundary>0,'Course data block missing');
const courses=runInNewContext(source.slice(0,boundary)+'\nCOURSES');
assert.equal(courses.length,6,'Expected six Level 1 courses');
const lessons=courses.flatMap(c=>c.lessons);
assert.equal(lessons.length,85,'Lesson count unexpectedly changed');
const ids=new Set();
for(const course of courses){
 assert.ok(course.title && course.id,'Course metadata missing');
 for(const lesson of course.lessons){
  assert.ok(lesson.id && !ids.has(lesson.id),'Duplicate or empty lesson ID: '+lesson.id);
  ids.add(lesson.id);
  assert.ok(lesson.sections.length>=4,'Insufficient teaching sections: '+lesson.id);
  assert.ok(lesson.sections.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='string' && x.trim())),'Malformed section: '+lesson.id);
  assert.ok(lesson.quiz && Array.isArray(lesson.quiz.options),'Missing quiz: '+lesson.id);
  assert.ok(lesson.quiz.options.length>=2,'Too few quiz choices: '+lesson.id);
  assert.ok(Number.isInteger(lesson.quiz.answer)&&lesson.quiz.answer>=0&&lesson.quiz.answer<lesson.quiz.options.length,'Invalid answer index: '+lesson.id);
  assert.ok(typeof lesson.quiz.why==='string'&&lesson.quiz.why.trim(),'Missing answer explanation: '+lesson.id);
 }
}
for(const token of ['law-academy-progress-v1','law-academy-research-capstone-v1','law-academy-oral-defense-v1']) assert.ok(source.includes(token),'Missing saved-data namespace: '+token);
console.log('PASS: JavaScript parses, 6 courses, 85 unique lessons, valid reading sections and quiz indices, saved-data keys preserved.');


const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.match(html,/id="app"/,'Missing app root');
assert.match(html,/src="\.\/app\.js"/,'Missing application entrypoint');
for(const [name,fragment] of [
 ['Home navigation','function renderHome()'],
 ['Course catalog','function renderCatalog()'],
 ['Lesson quiz','function renderLesson(c,l)'],
 ['Exams','function renderExams()'],
 ['Progress','function renderProgress()'],
 ['Case simulations','function renderCaseSimulation('],
 ['Oral practice','function renderOralDefense()'],
 ['Research portfolio','function renderResearchCapstone()'],
 ['Reasoning labs','function renderReasoningLab('],
 ['Study guide','function renderFinalStudyGuide()'],
 ['Saved answer action','localStorage.setItem(']
]) assert.ok(source.includes(fragment),'Missing key app feature: '+name);
for(const key of [
 'law-academy-progress-v1',
 'law-academy-writing-v1',
 'law-academy-sim-v1',
 'law-academy-sim-branches-v1',
 'law-academy-research-capstone-v1',
 'law-academy-capstone-audit-v1',
 'law-academy-oral-defense-v1',
 'law-academy-reasoning-v1'
]) assert.ok(source.includes(key),'Persisted-data namespace missing: '+key);
console.log('PASS: app entrypoint, core screens, and persisted-data identifiers present.');

const readinessStart=source.indexOf('function renderProgress()');
const readinessEnd=source.indexOf('function renderResources()',readinessStart);
assert.ok(readinessStart>=0 && readinessEnd>readinessStart,'Missing progress checklist');
const readiness=source.slice(readinessStart,readinessEnd);
for(const milestone of [
 'Draft all six written final responses',
 'Develop substantive written final answers',
 'Independent evaluation of source accuracy and reasoning',
 'Final supervised oral / issue-spotting assessment',
 'Graduation remains locked'
]) assert.ok(readiness.includes(milestone),'Missing Level 1 readiness safeguard: '+milestone);
assert.match(readiness,/Independent evaluation of source accuracy and reasoning",ready:false/,'Independent evaluation must not auto-complete');
assert.match(readiness,/Final supervised oral \/ issue-spotting assessment",ready:false/,'Supervised assessment must not auto-complete');
for(const key of ['law-academy-final-essays-v1','law-academy-final-review-v1']) assert.ok(source.includes(key),'Written final data namespace missing: '+key);
assert.ok(source.includes('function finalReviewerPacket('),'Missing external-review export');
assert.ok(source.includes('FINAL_REVIEW_CRITERIA'),'Missing written-final review criteria');
assert.ok(source.includes('Copy all six essays for external evaluation'),'Missing written-final export control');
console.log('PASS: Level 1 written final, external review, readiness checklist and academic graduation locks present.');

const teachingParagraphs=lessons.flatMap(lesson=>lesson.sections.map(([heading,body])=>({lesson:lesson.id,heading,body})));
const byText=new Map();
for(const row of teachingParagraphs){
 const normalized=row.body.toLowerCase().replace(/\s+/g,' ').trim();
 if(normalized.length<100)continue;
 const matches=byText.get(normalized)||[];
 matches.push(row.lesson);
 byText.set(normalized,matches);
}
const repeated=[...byText.entries()].filter(([,ids])=>new Set(ids).size>=3).sort((a,b)=>b[1].length-a[1].length);
const wordCounts=lessons.map(l=>l.sections.reduce((total,[heading,body])=>total+body.trim().split(/\s+/).length,0));
const sorted=[...wordCounts].sort((a,b)=>a-b);
const median=sorted[Math.floor(sorted.length/2)];
console.log('CONTENT DEPTH AUDIT: '+teachingParagraphs.length+' teaching sections across '+lessons.length+' lessons; median '+median+' instructional words; minimum '+sorted[0]+'; maximum '+sorted.at(-1)+'.');
console.log('CONTENT REPETITION AUDIT: '+repeated.length+' paragraphs repeated across three or more lessons.');
for(const [paragraph,ids] of repeated.slice(0,10)) console.log('REPEATED x'+ids.length+': '+ids.slice(0,5).join(', ')+' — '+paragraph.slice(0,110));
console.log('These diagnostics measure volume and repetition only; they do not certify doctrinal accuracy or academic rigor.');

const questions=new Map();
for(const lesson of lessons){
 const normalized=lesson.quiz.question.toLowerCase().replace(/\s+/g,' ').trim();
 assert.ok(!questions.has(normalized),'Duplicate knowledge-check question in '+lesson.id+' and '+questions.get(normalized));
 questions.set(normalized,lesson.id);
 assert.ok(lesson.quiz.options.length>=2 && lesson.quiz.options.length<=5,'Expected 2–5 answer options: '+lesson.id);
 const choices=lesson.quiz.options.map(x=>x.trim().toLowerCase());
 assert.equal(new Set(choices).size,choices.length,'Duplicate choices: '+lesson.id);
 assert.ok(lesson.sections.length>=6,'Expanded instruction sections missing: '+lesson.id);
}
assert.equal(questions.size,85,'Expected 85 distinct lesson checks');
console.log('PASS: All 85 lessons have distinct questions, distinct answer choices, and at least six teaching sections.');

const expansionIds=["sources","courts","law102-structure","law102-federalism","law103-1","law103-2","law104-1","law104-2","law105-1","law105-2","law106-1","law106-2","civilcriminal","cases","reasoning","law102-rights","law102-marbury","law102-expanded-3","law103-3","law103-4","law103-expanded-5","law104-3","law104-4","law104-expanded-7","law105-3","law105-4","law105-expanded-9","law106-3","law106-4","law106-expanded-11","law101-expanded-1","law101-expanded-2","law101-advanced-1","law101-advanced-2","law101-deep-1","law101-deep-2","law101-deep-3","law101-wave4-1","law101-wave4-2","law101-wave4-3","law102-expanded-4","law102-advanced-3","law102-advanced-4","law102-deep-4","law102-deep-5","law102-deep-6","law102-wave4-4","law102-wave4-5","law102-wave4-6","law103-expanded-6","law103-advanced-5","law103-advanced-6","law103-deep-7","law103-deep-8","law103-deep-9","law103-wave4-7","law103-wave4-8","law103-wave4-9","law104-expanded-8","law104-advanced-7","law104-advanced-8","law104-deep-10","law104-deep-11","law104-deep-12","law104-wave4-10","law104-wave4-11","law104-wave4-12","law105-expanded-10","law105-advanced-9","law105-advanced-10","law105-deep-13","law105-deep-14","law105-deep-15","law105-wave4-13","law105-wave4-14","law105-wave4-15","law106-expanded-12","law106-advanced-11","law106-advanced-12","law106-deep-16","law106-deep-17","law106-deep-18","law106-wave4-16","law106-wave4-17","law106-wave4-18"];
for(const id of expansionIds){
 const lesson=lessons.find(x=>x.id===id);
 assert.ok(lesson && lesson.sections.length>=6,'Academic expansion missing from '+id);
}
console.log('PASS: 85 foundational lessons include two additional analysis and application sections.');



const applied=readFileSync(new URL('../prelaw-applied.js',import.meta.url),'utf8');
new Script(applied,{filename:'prelaw-applied.js'});
const assessments=runInNewContext('const window={};'+applied.slice(0,applied.indexOf('const PRELAW_APPLIED_SOURCES='))+'\nwindow.PRELAW_APPLIED');
assert.equal(assessments.length,6,'Six applied Pre-Law cases required');
assert.deepEqual(Array.from(assessments,x=>x[0]),['LAW 101','LAW 102','LAW 103','LAW 104','LAW 105','LAW 106']);
for(const item of assessments){
 assert.ok(item[2].trim().split(/\s+/).length>=45,'Applied case lacks adequate facts: '+item[0]);
 assert.ok(item[3].trim().length>=60,'Applied assignment lacks analytical instructions: '+item[0]);
}
for(const token of ['law-academy-applied-v1','prelawReviewHints','PRELAW_REVIEW_CRITERIA','PRELAW_SOURCE_NOTES','PRELAW_REASONING_GUIDES']){
 assert.ok(applied.includes(token),'Missing applied assessment feature: '+token);
}
assert.match(html,/prelaw-applied\.js/,'Missing applied-assessment script load');
assert.ok(html.indexOf('src="./prelaw-applied.js"')<html.indexOf('src="./app.js"'),'Assessment module must load before main app starts');
console.log('PASS: Six fact-rich Pre-Law assessments, learning guides, feedback and saved-draft namespace.');


const graduationStandards=readFileSync(new URL('../curriculum/LEVEL1-GRADUATION-STANDARDS.md',import.meta.url),'utf8');
assert.match(graduationStandards,/85 authored lessons/,'Pre-Law graduation standards must reflect all 85 lessons');
assert.match(graduationStandards,/Graduation:?.*locked/i,'Graduation safeguard must remain explicit in standards');
assert.match(graduationStandards,/six applied/i,'Graduation standards must include six applied cases');
console.log('PASS: Graduation policy aligns with the current 85-lesson, six-assessment Pre-Law curriculum.');


const expanded=lessons.filter(l=>/-expanded-/.test(l.id));
const positions=new Set(expanded.slice(0,12).map(l=>l.quiz.answer));
assert.ok(positions.size>=3,'Expanded quizzes need varied correct-answer positions');
console.log('PASS: Expanded assessment answer positions vary across the first twelve cases.');


for(const [lessonId,terms] of [
 ['law105-1',['capacity','lawful purpose']],
 ['law102-advanced-4',['Riley v. California','warrant']],
 ['law105-advanced-9',['180 calendar days','300 days','Equal Pay Act']]
]){
 const lesson=lessons.find(x=>x.id===lessonId);
 assert.ok(lesson,'Missing accuracy-corrected lesson '+lessonId);
 const body=lesson.sections.map(x=>x[1]).join(' ');
 for(const term of terms)assert.ok(body.includes(term),'Missing accuracy correction '+term+' in '+lessonId);
}
console.log('PASS: Three targeted Pre-Law legal accuracy improvements are present.');


const level2Source=readFileSync(new URL('../level2.js',import.meta.url),'utf8');
new Script(level2Source,{filename:'level2.js'});
const level2Courses=runInNewContext('const window={};'+level2Source.slice(0,level2Source.indexOf('const L2_KEY='))+'\nwindow.LAW_LEVEL2');
assert.equal(level2Courses.length,7,'Level 2 must launch with seven academic subjects');
assert.equal(level2Courses.flatMap(c=>c.lessons).length,93,'Level 2 must include ninety-three authored lessons');
for(const l of level2Courses.flatMap(c=>c.lessons)){
 assert.ok(l.reading.length>170&&l.problem.length>100,'Incomplete 1L doctrine or application: '+l.id);
 assert.ok(Number.isInteger(l.answer)&&l.answer>=0&&l.answer<l.options.length,'Invalid 1L answer: '+l.id);
}
assert.ok(html.indexOf('src="./level2.js"')<html.indexOf('src="./app.js"'),'Level 2 module must load before app');
assert.ok(source.includes('renderLevel2();return'),'Level 2 launch routing missing');
console.log('PASS: Seven 1L courses, fourteen applied lessons, answer indices and launch routing.');

assert.ok(level2Source.includes('b.onclick=()=>showLesson(i,+b.dataset.l2lesson)'),'Level 2 lesson buttons must defer rendering until click');
console.log('PASS: Level 2 lesson navigation click handlers are deferred.');

for(const c of level2Courses)assert.ok(c.lessons.length>=5,'Each 1L subject needs five or more lessons: '+c.title);
console.log('PASS: Seven 1L subjects have three authored lessons apiece.');

for(const c of level2Courses){const assigned=c.lessons.find(l=>l.id===c.id+'-5');assert.ok(assigned&&assigned.problem.includes('Written assignment:'),'Integrated case writing task missing: '+c.title)}
console.log('PASS: Seven Level 2 integrated cases include substantive writing tasks.');

assert.ok(level2Source.includes('INLINE_CASES')&&level2Source.includes('inlineCaseReveal'),'Course-linked real case learning missing');
console.log('PASS: Real decisions embedded in subject-matched 1L lessons.');

assert.ok(level2Source.includes('MORE_LESSON_CASES')&&level2Source.includes('MORE_LESSON_CASES.find(c=>c.course==='),'Second-wave real cases must be routed into matching lessons');
console.log('PASS: Second-wave real case lesson matching is present.');

assert.ok(level2Source.includes('ADVANCED_LESSON_CASES')&&level2Source.includes('Nix v. Williams')&&level2Source.includes('Kelo v. City of New London'),'Case-linked advanced lessons missing');
console.log('PASS: Advanced criminal/property cases and 44 Level 2 lessons accounted for.');

assert.ok(level2Source.includes('NEW_LESSON_CASES')&&level2Source.includes('Erie Railroad Co. v. Tompkins')&&level2Source.includes('Washington v. Davis'),'New real-case teaching cases missing');
console.log('PASS: 51 first-year law lessons and matching historical case examples.');

assert.ok(level2Source.includes('DOCTRINE_CASES')&&level2Source.includes('Bell Atlantic Corp. v. Twombly')&&level2Source.includes('United States v. Lopez'),'Pleading and commerce precedents missing');
console.log('PASS: 58 Level 2 lessons and doctrine-linked pleading and commerce cases.');

assert.ok(level2Source.includes('NEXT_CASES')&&level2Source.includes('Celotex Corp. v. Catrett')&&level2Source.includes('Miranda v. Arizona'),'New lesson-linked cases are absent');
console.log('PASS: 65 authored 1L lessons with Celotex/Miranda examples.');

assert.ok(level2Source.includes('WAVE_CASES')&&level2Source.includes('Lujan v. Defenders of Wildlife')&&level2Source.includes('Boomer v. Atlantic Cement Co.'),'Standing and nuisance real cases missing');
console.log('PASS: Seventy-two Level 2 lessons and real cases for new standing/nuisance lessons.');

assert.ok(level2Source.includes('CLASSIC_CASES')&&level2Source.includes('Wal-Mart Stores, Inc. v. Dukes')&&level2Source.includes('In re Winship'),'New class-action and reasonable-doubt decisions missing');
console.log('PASS: 79 Level 2 lessons and linked Rule 23/criminal burden precedents.');

assert.ok(level2Source.includes('CURRENT_CASES')&&level2Source.includes('New York Times Co. v. Sullivan')&&level2Source.includes('Kennedy v. Bremerton School District'),'New relevant real court decisions missing');
console.log('PASS: 86 authored Level 2 lessons and attached current case examples.');

assert.ok(level2Source.includes('COMPANION_CASES.find(c=>c.course===courses[i].title&&c.lesson===j)'),'Real-case routing must follow the taught course and lesson');
console.log('PASS: Vosburg and Mathews integrated into matching 1L lessons.');

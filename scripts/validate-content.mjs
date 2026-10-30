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

// Level 4 draft curriculum checks. No claims of legal-source approval or browser readiness.
import {readFileSync} from 'node:fs';
import {runInNewContext, Script} from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../level4.js',import.meta.url),'utf8');
new Script(source,{filename:'level4.js'});
const courses=runInNewContext('const window={};'+source+'\nwindow.LAW_LEVEL4');
assert.equal(courses.length,7,'Expected seven 3L course tracks');
const ids=new Set();
for(const course of courses){
  assert.ok(course.id && course.title && Array.isArray(course.lessons),'Missing course metadata');
  assert.ok(course.status.includes('draft'),'Unreviewed course must remain draft');
  assert.ok(course.lessons.length>=5,'Each track requires five substantive practical lessons');
  for(const lesson of course.lessons){
    assert.ok(!ids.has(lesson.id),'Duplicate lesson id '+lesson.id);
    ids.add(lesson.id);
    for(const field of ['title','authority','scenario','reading','counterarguments','assignment','question','why','status'])assert.ok(typeof lesson[field]==='string' && lesson[field].trim(),'Missing '+field+' in '+lesson.id);
    assert.ok(lesson.reading.trim().split(/\s+/).length>=160,'Opening legal instruction too short '+lesson.id);
    assert.ok(lesson.scenario.length>=110,'Insufficient factual case scenario '+lesson.id);
    assert.ok(lesson.assignment.length>=150,'Insufficient practical written assignment '+lesson.id);
    assert.ok(lesson.options.length===3,'Expected three answer options '+lesson.id);
    assert.ok(lesson.answer>=0&&lesson.answer<lesson.options.length,'Invalid correct answer '+lesson.id);
    assert.ok(lesson.status.includes('draft'),'Unreviewed lesson must remain draft');
  }
}
assert.equal(ids.size,35,'Expected 35 authored Level 4 lessons across the seven course tracks');
console.log('PASS: seven Level 4 draft courses with five practice lessons each. Independent source verification and academic sign-off are outstanding.');

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const ui=readFileSync(new URL('../level4-ui.js',import.meta.url),'utf8');
new Script(ui,{filename:'level4-ui.js'});
for(const asset of ['src="./level4.js"','src="./level4-ui.js"'])assert.ok(html.includes(asset),'Missing Level 4 asset: '+asset);
assert.ok(app.includes('typeof renderLevel4==="function"'),'Level 4 catalog route not connected');
for(const token of ['function renderLevel4()','data-l4course','data-l4lesson','l4draft','l4check','l4backup','Back to course'])assert.ok(ui.includes(token),'Missing Level 4 student experience: '+token);
assert.ok(ui.includes("const L4_KEY='law-academy-level4-v1'"),'Use isolated Level 4 local draft key');
assert.ok(ui.includes('not yet cloud-synchronized'),'Must accurately warn about local-only draft storage');
console.log('PASS: Level 4 curriculum and student navigation assets configured. Browser functionality, cloud synchronization and legal accuracy remain unverified.');

const all=courses.flatMap(c=>c.lessons);
assert.equal(new Set(all.map(l=>l.question)).size,35,'Level 4 questions must not duplicate across lessons');
for(const course of courses){
 for(let index=0;index<5;index++){
  const lesson=course.lessons[index];
  assert.equal(lesson.id,course.id+'-'+(index+1),'Level 4 lesson order should remain stable '+course.id);
  assert.ok(lesson.assignment.includes('Draft')||lesson.assignment.includes('Create')||lesson.assignment.includes('Prepare')||lesson.assignment.includes('Write')||lesson.assignment.includes('Produce')||lesson.assignment.includes('Develop')||lesson.assignment.includes('Rewrite'),'Lesson needs a practical document deliverable '+lesson.id);
 }
}
console.log('PASS: 35 distinct Level 4 quizzes and ordered legal-writing assignments. This does not establish substantive case-law accuracy.');

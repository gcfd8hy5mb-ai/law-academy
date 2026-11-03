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
  assert.ok(course.lessons.length>=1,'Each track requires a practical starting lesson');
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
assert.equal(ids.size,7,'Only seven initial Level 4 lessons should exist in this batch');
console.log('PASS: seven Level 4 draft courses with one practical opening lesson each. Not published to the app; no independent source verification or academic sign-off.');

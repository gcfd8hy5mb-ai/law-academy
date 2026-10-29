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

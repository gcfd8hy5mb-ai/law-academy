// Run with node scripts/validate-level3.mjs. Structural checks only.
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../level3.js',import.meta.url),'utf8');
new Script(source,{filename:'level3.js'});
const courses=runInNewContext('const window={};'+source+'\nwindow.LAW_LEVEL3');
assert.equal(courses.length,7);
const all=courses.flatMap(c=>c.lessons);
assert.equal(all.length,35);
assert.equal(new Set(all.map(x=>x.id)).size,35);
for(const course of courses){assert.equal(course.lessons.length,5,'Expected five authored lessons in '+course.id);for(const lesson of course.lessons){
 assert.ok(lesson.title&&lesson.authority&&lesson.scenario&&lesson.reading&&lesson.counterarguments&&lesson.assignment);
 assert.ok(lesson.reading.split(/\s+/).length>=110,'Instruction too brief '+lesson.id);
 assert.equal(lesson.options.length,3);
 assert.ok(Number.isInteger(lesson.answer)&&lesson.answer>=0&&lesson.answer<3);
 assert.ok(lesson.status.includes('review'));
}}
console.log('PASS: 35 Level 3 authored lessons across seven courses and draft review warnings. This does not establish legal currency or academic approval.');

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
assert.ok(ui.includes('length<100'),'Reveal must require a substantive writing attempt');
assert.ok(!ui.includes('...(l.worked?'),'Model reasoning must not be rendered in public lesson sections');

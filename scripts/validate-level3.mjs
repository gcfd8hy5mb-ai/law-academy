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

console.log('Level 3 authored lesson count: '+all.length+'; shortest doctrinal reading: '+Math.min(...all.map(l=>l.reading.trim().split(/\\s+/).length))+' words. Content review remains separate from structural validation.');

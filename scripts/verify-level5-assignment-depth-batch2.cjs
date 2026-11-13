/* Academic regression: 23 individual Level 5 written assignment specifications.
 * Non-mutating verification of progress IDs, authored quizzes and exam rubrics.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=['level5.js','level5-batch2-coursework.js','level5-batch3-coursework.js','level5-final-module-coursework.js','level5-depth-workshops-batch1.js','level5-depth-workshops-batch2.js','level5-depth-workshops-batch3.js','level5-depth-workshops-batch4.js','level5-depth-workshops-batch5.js'];
const ctx={window:{}};vm.createContext(ctx);
for(const path of src)vm.runInContext(fs.readFileSync(path,'utf8'),ctx,{filename:path,timeout:10000});
const before=ctx.window.LAW_LEVEL5.flatMap(c=>c.lessons);
assert.equal(before.length,140);
const originals=new Map(before.map(l=>[l.id,{assignment:l.assignment,question:l.question,answer:l.answer,
 options:JSON.stringify(l.options),why:l.why,exam:JSON.stringify(l.exam||null),rubric:JSON.stringify(l.rubric||null)}]));
const path='level5-written-assignment-depth-batch2-2026.js',code=fs.readFileSync(path,'utf8');
vm.runInContext(code,ctx,{filename:path,timeout:10000});
const ids=Array.from(ctx.window.LAW_LEVEL5_ASSIGNMENT_BATCH2_IDS);
assert.equal(ids.length,23,'Exactly 23 short-assignment targets must be expanded');
assert.equal(new Set(ids).size,23,'Duplicate assignment IDs');
const after=ctx.window.LAW_LEVEL5.flatMap(c=>c.lessons);
assert.deepEqual(after.map(l=>l.id),before.map(l=>l.id),'Progress IDs/order changed');
for(const l of after){
 const old=originals.get(l.id);assert.ok(old,'Unexpected lesson '+l.id);
 assert.equal(l.question,old.question,'Question changed '+l.id);
 assert.equal(l.answer,old.answer,'Answer changed '+l.id);
 assert.equal(JSON.stringify(l.options),old.options,'Options changed '+l.id);
 assert.equal(l.why,old.why,'Explanation changed '+l.id);
 assert.equal(JSON.stringify(l.exam||null),old.exam,'Final exam changed '+l.id);
 assert.equal(JSON.stringify(l.rubric||null),old.rubric,'Rubric changed '+l.id);
 if(ids.includes(l.id)){
  assert.ok(l.assignment.startsWith(old.assignment),'Original prompt was replaced '+l.id);
  assert.ok(l.assignment.length>old.assignment.length+350,'Case-specific written assessment too short '+l.id);
  assert.match(l.assignment,/counter|oppos|advers|defens|challenger|alternative/i,'No competing legal analysis '+l.id);
 }else assert.equal(l.assignment,old.assignment,'Untargeted assignment changed '+l.id);
}
const once=ids.map(id=>after.find(l=>l.id===id).assignment);
vm.runInContext(code,ctx,{filename:path,timeout:10000});
assert.deepEqual(ids.map(id=>after.find(l=>l.id===id).assignment),once,'Repeated overlay duplicates tasks');
const h=fs.readFileSync('index.html','utf8');
assert.ok(h.indexOf('src="./level5-final-module-coursework.js"')<h.indexOf('src="./'+path+'"'),'Task overlay before lessons');
assert.ok(h.indexOf('src="./'+path+'"')<h.indexOf('src="./level5-ui.js"'),'Task overlay after UI');
console.log('PASS: 23 Level 5 written assignments expanded; 140 stable lesson IDs, keyed questions, final exams and rubrics unchanged.');
console.log('NOT VERIFIED: actual current law, independent written-exam scoring, academic accreditation or bar eligibility.');

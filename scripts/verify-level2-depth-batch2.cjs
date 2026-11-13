/* Academic-only regression for the 14 Level 2 instructional depth expansions.
 * Does not read or write student progress, Firebase or browser storage.
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('level2.js','utf8'),cut=source.indexOf('const L2_KEY=');
assert.ok(cut>0,'Level 2 source boundary missing');
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(source.slice(0,cut),ctx,{filename:'level2.js',timeout:10000});
const before=new Map(ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons.map(l=>[l.id,{
 id:l.id,question:l.question,options:JSON.stringify(l.options),answer:l.answer,why:l.why,problem:l.problem,reading:l.reading
}])));
const first=ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons);
assert.equal(first.length,128,'Level 2 baseline must remain 128 lessons');
const overlay=fs.readFileSync('level2-instructional-depth-batch2-2026.js','utf8');
vm.runInContext(overlay,ctx,{filename:'level2-instructional-depth-batch2-2026.js'});
const ids=Array.from(ctx.window.LAW_LEVEL2_DEPTH_BATCH2_IDS);
assert.equal(ids.length,14,'Expected exactly 14 case-specific seminars');
assert.equal(new Set(ids).size,14,'Duplicated enhancement target');
const after=ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons);
assert.deepEqual(after.map(l=>l.id),first.map(l=>l.id),'Lesson IDs or order changed');
for(const lesson of after){
 const old=before.get(lesson.id);assert.ok(old,'Unknown new lesson ID');
 for(const field of ['id','question','answer','why','problem'])
  assert.equal(lesson[field],old[field],'Existing '+field+' changed for '+lesson.id);
 assert.equal(JSON.stringify(lesson.options),old.options,'Existing answer options changed for '+lesson.id);
 if(ids.includes(lesson.id)){
  assert.ok(lesson.reading.length>old.reading.length+500,'Additional depth too small '+lesson.id);
  assert.match(lesson.reading,/COUNTERARGUMENT|COUNTERARGUMENTS|defense|DEFENSE|competing|opposing/i,'Missing adversarial reasoning '+lesson.id);
  assert.match(lesson.reading,/WRITTEN PRODUCT|Submit an?|Deliver an?|Prepare an?|Draft an?|Create an?/i,'Missing original written deliverable '+lesson.id);
 }else assert.equal(lesson.reading,old.reading,'Untargeted lesson was changed '+lesson.id);
}
const updated=ids.map(id=>after.find(l=>l.id===id).reading);
vm.runInContext(overlay,ctx,{filename:'level2-instructional-depth-batch2-2026.js'});
assert.deepEqual(ids.map(id=>ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons).find(l=>l.id===id).reading),updated,'Overlay duplicated text after repeated execution');
const html=fs.readFileSync('index.html','utf8');
assert.ok(html.indexOf('src="./level2.js"')<html.indexOf('src="./level2-instructional-depth-batch2-2026.js"'),'Depth overlay must follow source data');
assert.ok(html.indexOf('src="./level2-instructional-depth-batch2-2026.js"')<html.indexOf('src="./app.js"'),'Depth overlay must precede main app');
console.log('PASS: 14 case-specific legal seminars loaded, all 128 lesson IDs and assessment keys unchanged; repeat safe.');
console.log('NOT VERIFIED: independent legal accuracy, primary-source currency and qualified human grading.');

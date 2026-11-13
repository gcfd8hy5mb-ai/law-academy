/* Academic-only Level 2 Batch 7 regression. No network or student records. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('level2.js','utf8'),cut=s.indexOf('const L2_KEY=');
assert.ok(cut>0,'Missing curriculum boundary');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(s.slice(0,cut),ctx,{filename:'level2.js'});
const lessons=()=>ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons);
const base=new Map(lessons().map(l=>[l.id,{reading:l.reading,problem:l.problem,question:l.question,why:l.why,answer:l.answer,options:JSON.stringify(l.options)}]));
assert.equal(base.size,128);
const file='level2-instructional-depth-batch7-2026.js',code=fs.readFileSync(file,'utf8');
vm.runInContext(code,ctx,{filename:file});
const ids=Array.from(ctx.window.LAW_LEVEL2_DEPTH_BATCH7_IDS);
assert.equal(ids.length,14);assert.equal(new Set(ids).size,14);
for(const lesson of lessons()){
 const orig=base.get(lesson.id);assert.ok(orig,'Unexpected lesson ID');
 for(const field of ['problem','question','why','answer'])assert.equal(lesson[field],orig[field],field+' altered '+lesson.id);
 assert.equal(JSON.stringify(lesson.options),orig.options,'Answer options altered '+lesson.id);
 if(ids.includes(lesson.id)){
  assert.ok(lesson.reading.startsWith(orig.reading),'Original text overwritten '+lesson.id);
  assert.ok(lesson.reading.length-orig.reading.length>=550,'Insufficient new material '+lesson.id);
  assert.match(lesson.reading,/CHANGED FACT/i,'Changed facts missing '+lesson.id);
  assert.match(lesson.reading,/Deliver|Prepare|Submit|Draft|Produce|Create/i,'Writing deliverable missing '+lesson.id);
 }else assert.equal(lesson.reading,orig.reading,'Untargeted reading altered '+lesson.id);
}
const once=ids.map(id=>lessons().find(l=>l.id===id).reading);
vm.runInContext(code,ctx,{filename:file});
assert.deepEqual(ids.map(id=>lessons().find(l=>l.id===id).reading),once,'Double import duplicates content');
const h=fs.readFileSync('index.html','utf8');
assert.ok(h.indexOf('src="./level2.js"')<h.indexOf('src="./'+file+'"'));
assert.ok(h.indexOf('src="./'+file+'"')<h.indexOf('src="./app.js"'));
console.log('PASS: 14 advanced Level 2 legal seminars; all 128 original IDs, problems, answers and feedback preserved.');
console.log('PENDING: substantive verification of judicial holdings and live external sign-off.');

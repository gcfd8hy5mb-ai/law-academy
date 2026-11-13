/* Curriculum-only Level 2 Batch 4 regression. No learner records or network access. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('level2.js','utf8'),end=source.indexOf('const L2_KEY=');
assert.ok(end>0,'Level 2 lesson data boundary unavailable');
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(source.slice(0,end),ctx,{filename:'level2.js'});
const lessons=()=>ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons);
const baseline=new Map(lessons().map(l=>[l.id,{reading:l.reading,problem:l.problem,question:l.question,answer:l.answer,why:l.why,options:JSON.stringify(l.options)}]));
assert.equal(baseline.size,128);
const overlay=fs.readFileSync('level2-instructional-depth-batch4-2026.js','utf8');
vm.runInContext(overlay,ctx);
const ids=Array.from(ctx.window.LAW_LEVEL2_DEPTH_BATCH4_IDS);
assert.equal(ids.length,14);assert.equal(new Set(ids).size,14);
for(const l of lessons()){
 const b=baseline.get(l.id);assert.ok(b,'Unexpected lesson '+l.id);
 for(const k of ['problem','question','answer','why'])assert.equal(l[k],b[k],'Existing field changed '+l.id+' '+k);
 assert.equal(JSON.stringify(l.options),b.options,'Existing answer choices changed '+l.id);
 if(ids.includes(l.id)){
   assert.ok(l.reading.startsWith(b.reading),'Original reading overwritten '+l.id);
   assert.ok(l.reading.length-b.reading.length>650,'Supplementary case analysis short '+l.id);
   assert.match(l.reading,/CHANGED FACT|CHANGE FACTS|ALTERED FACTS/i,'Missing counterfactual '+l.id);
   assert.match(l.reading,/SELLER|BUYER|PLAINTIFF|DEFENDANT|OWNER|SHOP|CUSTOMER|MERCHANT|PATIENT|PROVIDER|EMPLOYEE|EMPLOYER/i,'No identifiable party position '+l.id);
 }else assert.equal(l.reading,b.reading,'Unrelated curriculum was rewritten '+l.id);
}
const once=ids.map(id=>lessons().find(l=>l.id===id).reading);
vm.runInContext(overlay,ctx);
assert.deepEqual(ids.map(id=>lessons().find(l=>l.id===id).reading),once,'Batch 4 overlay duplicated on reload');
const h=fs.readFileSync('index.html','utf8');
assert.ok(h.indexOf('src="./level2.js"')<h.indexOf('src="./level2-instructional-depth-batch4-2026.js"'));
assert.ok(h.indexOf('src="./level2-instructional-depth-batch4-2026.js"')<h.indexOf('src="./app.js"'));
console.log('PASS: fourteen targeted legal reasoning seminars, all 128 Level 2 progress IDs and assessment keys preserved.');
console.log('NOT VERIFIED: current governing law, independent legal source treatment or professional grading.');

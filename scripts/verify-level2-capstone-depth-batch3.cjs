/* Seven Level 2 capstone additions — regression, not independent legal review. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const s=fs.readFileSync('level2.js','utf8'),end=s.indexOf('const L2_KEY=');
assert.ok(end>0,'Level 2 course boundary missing');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(s.slice(0,end),ctx);
const lessons=()=>ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons);
const before=new Map(lessons().map(l=>[l.id,{reading:l.reading,problem:l.problem,question:l.question,options:JSON.stringify(l.options),answer:l.answer,why:l.why}]));
const overlay=fs.readFileSync('level2-capstone-depth-batch3-2026.js','utf8');
vm.runInContext(overlay,ctx);
const ids=Array.from(ctx.window.LAW_LEVEL2_CAPSTONE_DEPTH_BATCH3_IDS);
assert.equal(ids.length,7,'Seven capstones expected');assert.equal(new Set(ids).size,7);
assert.equal(lessons().length,128,'Existing 128 lessons must remain');
for(const l of lessons()){
 const b=before.get(l.id);assert.ok(b);
 for(const key of ['problem','question','answer','why'])assert.equal(l[key],b[key],'Existing '+key+' changed '+l.id);
 assert.equal(JSON.stringify(l.options),b.options,'Exam choices changed '+l.id);
 if(ids.includes(l.id)){assert.ok(l.reading.startsWith(b.reading),'Original lesson truncated '+l.id);
  assert.ok(l.reading.length>b.reading.length+850,'Additional capstone dossier absent '+l.id);
  assert.match(l.reading,/SUBMISSION:|SUBMISSION —/i,'Written exam product absent '+l.id);
  assert.match(l.reading,/DEFENSE|OPPOSING|CHALLENGER|SELLER'S POSITION|LATER CLAIMANT/i,'Adverse argument absent '+l.id);
 }else assert.equal(l.reading,b.reading,'Non-target lesson modified '+l.id);
}
const prior=ids.map(id=>lessons().find(l=>l.id===id).reading);
vm.runInContext(overlay,ctx);
assert.deepEqual(ids.map(id=>lessons().find(l=>l.id===id).reading),prior,'Double load duplicates coursework');
const html=fs.readFileSync('index.html','utf8');
assert.ok(html.indexOf('src="./level2.js"')<html.indexOf('src="./level2-capstone-depth-batch3-2026.js"'));
assert.ok(html.indexOf('src="./level2-capstone-depth-batch3-2026.js"')<html.indexOf('src="./app.js"'));
console.log('PASS — seven Level 2 capstone dossiers, all 128 lesson IDs, MCQs and original writing prompts preserved.');
console.log('PENDING — governing-law review, examiner calibration and independent professional sign-off.');

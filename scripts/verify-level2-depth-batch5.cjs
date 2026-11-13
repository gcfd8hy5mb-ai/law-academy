/* Level 2 depth Batch 5 regression, no writes to saved academic work. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('level2.js','utf8'),end=src.indexOf('const L2_KEY=');
assert.ok(end>0);
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(src.slice(0,end),ctx);
const lessons=()=>ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons);
const originals=new Map(lessons().map(l=>[l.id,{reading:l.reading,problem:l.problem,question:l.question,answer:l.answer,options:JSON.stringify(l.options),why:l.why}]));
const path='level2-instructional-depth-batch5-2026.js',code=fs.readFileSync(path,'utf8');
vm.runInContext(code,ctx,{filename:path});
const ids=Array.from(ctx.window.LAW_LEVEL2_DEPTH_BATCH5_IDS);
assert.equal(ids.length,14);assert.equal(new Set(ids).size,14);
assert.equal(lessons().length,128);
for(const l of lessons()){
 const before=originals.get(l.id);assert.ok(before,'Unrecognized lesson '+l.id);
 for(const field of ['problem','question','answer','why'])assert.equal(l[field],before[field],field+' changed '+l.id);
 assert.equal(JSON.stringify(l.options),before.options,'Options changed '+l.id);
 if(ids.includes(l.id)){
  assert.ok(l.reading.startsWith(before.reading),'Original reading overwritten '+l.id);
  assert.ok(l.reading.length-before.reading.length>=650,'No substantive new depth '+l.id);
  assert.match(l.reading,/CHANGED FACT|CHANGE FACT|CHANGED FACTS/i,'Missing alternate facts '+l.id);
  assert.match(l.reading,/DEFENSE|GOVERNMENT|PROSECUTION|PLAINTIFF|CLAIMANT|CITY|DISTRICT|ORGANIZATION|AGENCY|SELLER|EMPLOYEES/i,'No adversarial perspective '+l.id);
 }else assert.equal(l.reading,before.reading,'Unrelated reading changed '+l.id);
}
const originalAppended=ids.map(id=>lessons().find(l=>l.id===id).reading);
vm.runInContext(code,ctx,{filename:path});
assert.deepEqual(ids.map(id=>lessons().find(l=>l.id===id).reading),originalAppended,'Overlay duplicates reading');
const html=fs.readFileSync('index.html','utf8');
assert.ok(html.indexOf('src="./level2.js"')<html.indexOf('src="./'+path+'"'));
assert.ok(html.indexOf('src="./'+path+'"')<html.indexOf('src="./app.js"'));
console.log('PASS: 14 Level 2 advanced seminars, original 128 progress identifiers, case problems and quiz answers preserved.');
console.log('PENDING: current law/source verification and independent substantive academic sign-off.');

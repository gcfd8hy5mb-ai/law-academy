/* Level 2 Batch 6 academic depth regression. No user data, grades or network. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('level2.js','utf8'),end=source.indexOf('const L2_KEY=');
assert.ok(end>0,'Missing level2 data boundary');
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(source.slice(0,end),ctx,{filename:'level2.js'});
const all=()=>ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons);
const before=new Map(all().map(l=>[l.id,{reading:l.reading,problem:l.problem,question:l.question,answer:l.answer,options:JSON.stringify(l.options),why:l.why}]));
const path='level2-instructional-depth-batch6-2026.js',extra=fs.readFileSync(path,'utf8');
vm.runInContext(extra,ctx,{filename:path});
const ids=Array.from(ctx.window.LAW_LEVEL2_DEPTH_BATCH6_IDS);
assert.equal(ids.length,15);assert.equal(new Set(ids).size,15);assert.equal(all().length,128);
for(const l of all()){
 const b=before.get(l.id);assert.ok(b,'Unexpected lesson '+l.id);
 for(const field of ['problem','question','answer','why'])assert.equal(l[field],b[field],field+' changed '+l.id);
 assert.equal(JSON.stringify(l.options),b.options,'Original options changed '+l.id);
 if(ids.includes(l.id)){
  assert.ok(l.reading.startsWith(b.reading),'Replaced prior reading '+l.id);
  assert.ok(l.reading.length-b.reading.length>700,'Supplementary case analysis missing '+l.id);
  assert.match(l.reading,/CHANGED FACT/i,'Missing changed factual test '+l.id);
  assert.match(l.reading,/Deliver|Submit|Prepare|Draft|Build|Create/i,'Missing written deliverable '+l.id);
 }else assert.equal(l.reading,b.reading,'Untargeted reading changed '+l.id);
}
const once=ids.map(id=>all().find(l=>l.id===id).reading);
vm.runInContext(extra,ctx,{filename:path});
assert.deepEqual(ids.map(id=>all().find(l=>l.id===id).reading),once,'Overlay duplicated material');
const html=fs.readFileSync('index.html','utf8');
assert.ok(html.indexOf('src="./level2.js"')<html.indexOf('src="./'+path+'"'));
assert.ok(html.indexOf('src="./'+path+'"')<html.indexOf('src="./app.js"'));
console.log('PASS — 15 property/research original teaching supplements and all 128 saved lesson IDs, cases and answer keys retained.');
console.log('NOT VERIFIED — current law, qualified grading, professional legal signoff.');

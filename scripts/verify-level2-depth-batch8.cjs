/* Level 2 Batch 8 academic regression; never interacts with student data. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=fs.readFileSync('level2.js','utf8'),boundary=base.indexOf('const L2_KEY=');
assert.ok(boundary>0);
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(base.slice(0,boundary),ctx);
const lessons=()=>ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons);
const before=new Map(lessons().map(l=>[l.id,{reading:l.reading,problem:l.problem,question:l.question,answer:l.answer,options:JSON.stringify(l.options),why:l.why}]));
const name='level2-instructional-depth-batch8-2026.js',code=fs.readFileSync(name,'utf8');
vm.runInContext(code,ctx,{filename:name});
const ids=Array.from(ctx.window.LAW_LEVEL2_DEPTH_BATCH8_IDS);
assert.equal(ids.length,12);assert.equal(new Set(ids).size,12);assert.equal(lessons().length,128);
for(const l of lessons()){
 const old=before.get(l.id);assert.ok(old,'Unexpected lesson '+l.id);
 for(const key of ['problem','question','answer','why'])assert.equal(l[key],old[key],'Original '+key+' changed '+l.id);
 assert.equal(JSON.stringify(l.options),old.options,'Choices changed '+l.id);
 if(ids.includes(l.id)){assert.ok(l.reading.startsWith(old.reading),'Original lesson replaced '+l.id);
  assert.ok(l.reading.length-old.reading.length>=500,'Additional instruction too short '+l.id);
  assert.match(l.reading,/CHANGED FACT/i,'Required alternate-fact analysis absent '+l.id);
  assert.match(l.reading,/DEFENSE|STATE|GOVERNMENT|DEFENDANT|CITY|SCHOOL|VENUE|CHALLENGER|PROSECUTOR/i,'Missing contesting party '+l.id);
 }else assert.equal(l.reading,old.reading,'Untargeted lesson changed '+l.id);
}
const once=ids.map(id=>lessons().find(l=>l.id===id).reading);
vm.runInContext(code,ctx,{filename:name});
assert.deepEqual(ids.map(id=>lessons().find(l=>l.id===id).reading),once,'Supplement must not duplicate on reload');
const html=fs.readFileSync('index.html','utf8');
assert.ok(html.indexOf('src="./level2.js"')<html.indexOf('src="./'+name+'"'));
assert.ok(html.indexOf('src="./'+name+'"')<html.indexOf('src="./app.js"'));
console.log('PASS: 12 expanded criminal/constitutional case analyses, 128 stable lesson IDs and all original assessment keys.');
console.log('NOT CHECKED: operative law, reported-case subsequent treatment, independently evaluated exam responses.');

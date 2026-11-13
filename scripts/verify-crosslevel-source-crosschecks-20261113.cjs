/* Dated source-crosscheck overlay structural regression for eight advanced lessons.
 * These checks cannot certify current case law or external academic sign-off.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(f,'utf8');
const html=read('index.html');
const scripts=[...html.matchAll(/<script[^>]*src="\.\/([^"]+\.js)"/g)].map(m=>m[1]);
const ctx={window:{}};vm.createContext(ctx);
const lev3='level3.js';vm.runInContext(read(lev3),ctx,{filename:lev3,timeout:10000});
const start=scripts.indexOf('level4.js'),end=scripts.indexOf('level4-audit-inventory-2026.js');
assert.ok(start>=0&&end>start,'Missing Level 4 source module window');
for(const f of scripts.slice(start,end+1))vm.runInContext(read(f),ctx,{filename:f,timeout:10000});
for(const f of ['level5.js','level5-batch2-coursework.js','level5-batch3-coursework.js','level5-final-module-coursework.js','level5-depth-workshops-batch1.js','level5-depth-workshops-batch2.js','level5-depth-workshops-batch3.js','level5-depth-workshops-batch4.js','level5-depth-workshops-batch5.js','level5-written-assignment-depth-batch2-2026.js'])vm.runInContext(read(f),ctx,{filename:f,timeout:10000});
const collections=['LAW_LEVEL3','LAW_LEVEL4','LAW_LEVEL5'];
const all=()=>collections.flatMap(name=>ctx.window[name].flatMap(c=>c.lessons));
const before=new Map(all().map(l=>[l.id,{reading:l.reading,question:l.question,options:JSON.stringify(l.options),answer:l.answer,why:l.why,assignment:l.assignment,scenario:l.scenario}]));
assert.equal(before.size,310,'All 70 + 100 + 140 advanced lessons must exist');
const overlay='law-crosslevel-primary-source-crosschecks-20261113.js';
assert.ok(scripts.indexOf(overlay)>scripts.indexOf('level5-written-assignment-depth-batch2-2026.js'));
assert.ok(scripts.indexOf(overlay)<scripts.indexOf('level5-ui.js'));
vm.runInContext(read(overlay),ctx,{filename:overlay,timeout:10000});
const ids=Array.from(ctx.window.LAW_CROSSLEVEL_PRIMARY_SOURCE_20261113_IDS);
assert.equal(ids.length,8,'Expected eight discrete source crosschecks');
assert.equal(new Set(ids).size,8);
for(const l of all()){
 const b=before.get(l.id);assert.ok(b,'Unknown academic lesson ID '+l.id);
 for(const field of ['question','answer','why','assignment','scenario'])assert.equal(l[field],b[field],field+' replaced '+l.id);
 assert.equal(JSON.stringify(l.options),b.options,'Original quiz choices changed '+l.id);
 if(ids.includes(l.id)){
  assert.ok(l.reading.startsWith(b.reading),'Original reading overwritten '+l.id);
  assert.ok(l.reading.length-b.reading.length>=470,'Narrow authority crosscheck absent '+l.id);
  assert.match(l.reading,/2026-11-13/,'Missing source date '+l.id);
  assert.match(l.reading,/https:\/\//,'No primary source research pointer '+l.id);
 }else assert.equal(l.reading,b.reading,'Untargeted lesson altered '+l.id);
}
const once=ids.map(id=>all().find(l=>l.id===id).reading);
vm.runInContext(read(overlay),ctx,{filename:overlay,timeout:10000});
assert.deepEqual(ids.map(id=>all().find(l=>l.id===id).reading),once,'Repeated source overlay duplicates readings');
console.log('PASS: eight source-checked educational notes across Levels 3-5; all 310 advanced lesson IDs and original exam questions, answers, writing prompts, scenarios preserved.');
console.log('LIMITATION: cited source text was reviewed only for stated propositions; all subsequent treatment and academic review remain PENDING.');

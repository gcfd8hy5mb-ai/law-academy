/* Batch 2 bounded source check regression: Smith, Jarkesy and CASA.
 * Structural integrity only, NOT review of subsequent treatment or independent exam grading.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(f,'utf8'),html=read('index.html');
const scripts=[...html.matchAll(/<script[^>]*src="\.\/([^"]+\.js)"/g)].map(m=>m[1]);
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(read('level3.js'),ctx,{filename:'level3.js',timeout:10000});
const lo=scripts.indexOf('level4.js'),hi=scripts.indexOf('level4-audit-inventory-2026.js');
assert.ok(lo>=0&&hi>lo);
for(const name of scripts.slice(lo,hi+1))vm.runInContext(read(name),ctx,{filename:name,timeout:10000});
for(const name of ['level5.js','level5-batch2-coursework.js','level5-batch3-coursework.js','level5-final-module-coursework.js','level5-depth-workshops-batch1.js','level5-depth-workshops-batch2.js','level5-depth-workshops-batch3.js','level5-depth-workshops-batch4.js','level5-depth-workshops-batch5.js','level5-written-assignment-depth-batch2-2026.js','law-crosslevel-primary-source-crosschecks-20261113.js'])vm.runInContext(read(name),ctx,{filename:name,timeout:10000});
const all=()=>['LAW_LEVEL3','LAW_LEVEL4','LAW_LEVEL5'].flatMap(name=>ctx.window[name].flatMap(c=>c.lessons));
const base=new Map(all().map(l=>[l.id,{reading:l.reading,question:l.question,why:l.why,options:JSON.stringify(l.options),answer:l.answer,scenario:l.scenario,assignment:l.assignment}]));
assert.equal(base.size,310);
const file='law-crosslevel-primary-source-crosschecks-batch2-20261113.js',code=read(file);
assert.ok(scripts.indexOf(file)>scripts.indexOf('law-crosslevel-primary-source-crosschecks-20261113.js'),'Source notes should load after initial source checks');
assert.ok(scripts.indexOf(file)<scripts.indexOf('level5-ui.js'),'Source notes must load before lesson rendering');
vm.runInContext(code,ctx,{filename:file,timeout:10000});
const ids=Array.from(ctx.window.LAW_CROSSLEVEL_PRIMARY_SOURCE_BATCH2_IDS);
assert.equal(ids.length,11);assert.equal(new Set(ids).size,11);
const byId=new Map(all().map(l=>[l.id,l]));
for(const l of all()){
 const b=base.get(l.id);assert.ok(b,'Unexpected progress ID '+l.id);
 for(const k of ['question','why','answer','scenario','assignment'])assert.equal(l[k],b[k],'Changed '+k+' '+l.id);
 assert.equal(JSON.stringify(l.options),b.options,'Changed answers '+l.id);
 if(ids.includes(l.id)){
  assert.ok(l.reading.startsWith(b.reading),'Replaced original source '+l.id);
  assert.ok(l.reading.length-b.reading.length>=650,'Insufficient bounded source note '+l.id);
  assert.match(l.reading,/https:\/\/www\.law\.cornell\.edu\/supremecourt\/text\//,'No cited source '+l.id);
  assert.match(l.reading,/not|did not|does not|different|distinct|separate|unresolved/i,'Holding limitations missing '+l.id);
 }else assert.equal(l.reading,b.reading,'Untargeted reading changed '+l.id);
}
const once=ids.map(id=>byId.get(id).reading);
vm.runInContext(code,ctx,{filename:file,timeout:10000});
assert.deepEqual(ids.map(id=>byId.get(id).reading),once,'Duplicate legal notes on reload');
console.log('PASS: 11 bounded Supreme Court source notes; 310 Level 3-5 progress IDs, scenarios, written prompts and all original question keys preserved.');
console.log('PENDING: independent legal/currentness assessment and qualified examiner review.');

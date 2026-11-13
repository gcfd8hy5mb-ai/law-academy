/* Regression: 16 current-law source distinction notes, no learner data modifications.
 * Narrow primary-law propositions not comprehensive subsequent-treatment approval.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(f,'utf8'),html=read('index.html');
const scripts=[...html.matchAll(/<script[^>]*src="\.\/([^"]+\.js)"/g)].map(m=>m[1]);
const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(read('level3.js'),ctx,{filename:'level3.js',timeout:10000});
const lo=scripts.indexOf('level4.js'),hi=scripts.indexOf('level4-audit-inventory-2026.js');
assert.ok(lo>=0&&hi>lo,'Level 4 load order missing');
for(const f of scripts.slice(lo,hi+1))vm.runInContext(read(f),ctx,{filename:f,timeout:10000});
for(const f of ['level5.js','level5-batch2-coursework.js','level5-batch3-coursework.js','level5-final-module-coursework.js','level5-depth-workshops-batch1.js','level5-depth-workshops-batch2.js','level5-depth-workshops-batch3.js','level5-depth-workshops-batch4.js','level5-depth-workshops-batch5.js','level5-written-assignment-depth-batch2-2026.js','law-crosslevel-primary-source-crosschecks-20261113.js','law-crosslevel-primary-source-crosschecks-batch2-20261113.js'])vm.runInContext(read(f),ctx,{filename:f,timeout:10000});
const all=()=>['LAW_LEVEL3','LAW_LEVEL4','LAW_LEVEL5'].flatMap(name=>ctx.window[name].flatMap(c=>c.lessons));
const old=new Map(all().map(l=>[l.id,{reading:l.reading,question:l.question,options:JSON.stringify(l.options),answer:l.answer,why:l.why,scenario:l.scenario,assignment:l.assignment,exam:JSON.stringify(l.exam||null)}]));
assert.equal(old.size,310);
const file='law-crosslevel-primary-source-crosschecks-batch3-20261113.js',code=read(file);
assert.ok(scripts.indexOf(file)>scripts.indexOf('law-crosslevel-primary-source-crosschecks-batch2-20261113.js'));
assert.ok(scripts.indexOf(file)<scripts.indexOf('level5-ui.js'));
vm.runInContext(code,ctx,{filename:file,timeout:10000});
const ids=Array.from(ctx.window.LAW_CROSSLEVEL_PRIMARY_SOURCE_BATCH3_IDS);
assert.equal(ids.length,16);assert.equal(new Set(ids).size,14,'Sixteen source notes cover fourteen distinct lessons');
const sourceGroup=ids.filter(x=>x.startsWith('L3-')).length;
assert.ok(sourceGroup>=5,'Level 3 not well represented');
const covered=ids.filter(id=>id.startsWith('L4-')).length;
assert.ok(covered>=4,'Level 4 not well represented');
for(const l of all()){
 const b=old.get(l.id);assert.ok(b,'Unexpected lesson ID '+l.id);
 for(const k of ['question','answer','why','scenario','assignment'])assert.equal(l[k],b[k],k+' modified '+l.id);
 assert.equal(JSON.stringify(l.options),b.options,'Options changed '+l.id);
 assert.equal(JSON.stringify(l.exam||null),b.exam,'Written finals changed '+l.id);
 if(ids.includes(l.id)){
  assert.ok(l.reading.startsWith(b.reading),'Base teaching overwritten '+l.id);
  assert.ok(l.reading.length-b.reading.length>=580,'Insufficient case-specific source note '+l.id);
  assert.match(l.reading,/2026-11-13/,'Source audit date absent '+l.id);
  assert.match(l.reading,/https:\/\//,'Legal source URL absent '+l.id);
 }else assert.equal(l.reading,b.reading,'Untargeted teaching altered '+l.id);
}
const once=ids.map(id=>all().find(l=>l.id===id).reading);
vm.runInContext(code,ctx,{filename:file});
assert.deepEqual(ids.map(id=>all().find(l=>l.id===id).reading),once,'Second run duplicated source notes');
console.log('PASS: 16 bounded legal notes, stable 310 advanced lesson IDs, questions, answers, finals and original problem scenarios.');
console.log('PENDING: independent negative treatment, jurisdiction-specific source review and grading.');

/* Level 2 final short-reading queue: content, ID and assessment preservation.
 * No local student data, Firebase or grades are read or written.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const text=p=>fs.readFileSync(p,'utf8'),s=text('level2.js'),end=s.indexOf('const L2_KEY=');
assert.ok(end>0);const ctx={window:{}};vm.createContext(ctx);
vm.runInContext(s.slice(0,end),ctx);
const items=()=>ctx.window.LAW_LEVEL2.flatMap(c=>c.lessons);
const original=new Map(items().map(l=>[l.id,{reading:l.reading,problem:l.problem,question:l.question,answer:l.answer,why:l.why,options:JSON.stringify(l.options)}]));
const html=text('index.html');
const files=[...html.matchAll(/src="\.\/(level2-[^"]+\.js)"/g)].map(m=>m[1]);
assert.ok(files.includes('level2-instructional-depth-batch9-2026.js'));
for(const path of files)vm.runInContext(text(path),ctx,{filename:path,timeout:10000});
const ids=Array.from(ctx.window.LAW_LEVEL2_DEPTH_BATCH9_IDS);
assert.equal(ids.length,29);assert.equal(new Set(ids).size,29);
assert.equal(items().length,128);assert.equal(new Set(items().map(l=>l.id)).size,128);
for(const l of items()){
 const old=original.get(l.id);assert.ok(old,'Unexpected student progress identifier '+l.id);
 for(const k of ['problem','question','answer','why'])assert.equal(l[k],old[k],k+' changed '+l.id);
 assert.equal(JSON.stringify(l.options),old.options,'Answer options changed '+l.id);
 assert.ok(l.reading.startsWith(old.reading),'Original course reading removed '+l.id);
 if(ids.includes(l.id)){
  assert.ok(l.reading.length-old.reading.length>500,'Case analysis insufficient '+l.id);
  assert.match(l.reading,/Change|Compare|CHANGED|changed/i,'Requires alternative record '+l.id);
 }
}
const under=items().filter(l=>l.reading.trim().split(/\s+/).length<220).map(l=>l.id);
console.log('Level 2 remaining primary-reading screening flags: '+under.length+' — '+under.join(', '));
assert.ok(under.length===0,'Unresolved short primary readings beyond review target: '+under.join(', '));
const previous=ids.map(id=>items().find(l=>l.id===id).reading);
vm.runInContext(text('level2-instructional-depth-batch9-2026.js'),ctx);
assert.deepEqual(ids.map(id=>items().find(l=>l.id===id).reading),previous,'Double inclusion duplicates reading');
console.log('PASS: 29 targeted case studies, stable 128 lesson IDs, original cases, MCQs and answer keys preserved.');
console.log('PENDING: legal currency, independent legal accuracy, human exam scoring.');

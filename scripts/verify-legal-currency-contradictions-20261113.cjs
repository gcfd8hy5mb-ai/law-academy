/* Legal currency contradiction regression, 2026-11-13.
 * Verifies a direct substantive correction, not a human legal sign-off.
 * Does not write student grades, progress or cloud data.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=p=>fs.readFileSync(p,'utf8');
const original=src('level4.js'),start=original.indexOf('window.LAW_LEVEL4=');
assert.ok(start>=0);
const ctx={window:{}};vm.createContext(ctx);
const html=src('index.html'),files=[...html.matchAll(/<script[^>]*src="\.\/([^"]+\.js)"/g)].map(x=>x[1]);
const first=files.indexOf('level4.js'),last=files.indexOf('level4-audit-inventory-2026.js');
assert.ok(first>=0&&last>first,'Full Level 4 course scripts not available');
for(const file of files.slice(first,last+1))vm.runInContext(src(file),ctx,{filename:file,timeout:15000});
const all=ctx.window.LAW_LEVEL4.flatMap(c=>c.lessons);
assert.equal(all.length,100);assert.equal(new Set(all.map(l=>l.id)).size,100);
const final=all.find(l=>l.id==='L4-3-10');
assert.ok(final&&final.reading.includes('sections 1 and 2 generally apply to acts and transactions before, on, or after enactment'),'Original M&A final lacks actual retroactive effect');
assert.ok(final.reading.includes('February 17, 2025'),'Missing statutory exception date');
assert.ok(!final.reading.includes('Use the statute effective for the transaction date'),'Obsolete transaction-date-only instruction present');
assert.ok(!original.includes('rather than applying a contemporary statute retroactively'),'Unqualified anti-retroactivity instruction remains');
const before=all.map(l=>({id:l.id,question:l.question,answer:l.answer,options:JSON.stringify(l.options),why:l.why}));
vm.runInContext(src('level4-legal-updates-final-2026.js'),ctx,{filename:'level4-legal-updates-final-2026.js',timeout:10000});
const after=ctx.window.LAW_LEVEL4.flatMap(c=>c.lessons);
assert.deepEqual(after.map(l=>({id:l.id,question:l.question,answer:l.answer,options:JSON.stringify(l.options),why:l.why})),before,'Currency alerts changed keyed student assessments');
const de=after.find(l=>l.id==='L4-3-6').legalCurrencyAlerts.find(a=>a.type==='DE144_2025');
assert.ok(de&&de.text.includes('before, on, or after enactment')&&de.text.includes('February 17, 2025'),'Delaware source note inaccurately treats transaction date as dispositive');
const ids=['L4-1-3','L4-1-4','L4-1-12'];
for(const id of ids){
 const l=after.find(x=>x.id===id);assert.ok(l,'Missing Rule 801 target '+id);
 const note=l.legalCurrencyAlerts.find(x=>x.type==='FRE801_PENDING');
 assert.ok(note&&note.text.includes('Supreme Court has already adopted'),'2026 adoption status inaccurate '+id);
 assert.ok(note.text.includes('December 1, 2026')&&note.text.includes('not yet operative'),'Wrong pre-effective date status '+id);
 assert.ok(note.sources.includes('https://www.supremecourt.gov/orders/courtorders/frev26_da3i.pdf'),'No actual SCOTUS rule order '+id);
}
console.log('PASS: Original M&A final correctly describes DGCL §144 retroactivity and Feb. 17 exceptions; adopted but non-operative FRE 801 status accurate in three lessons.');
console.log('PASS: all 100 Level 4 lesson IDs and existing quiz options, keys and feedback retained after dated legal update.');
console.log('PENDING: remaining governing-law contradictions, later case treatment and qualified independent review.');

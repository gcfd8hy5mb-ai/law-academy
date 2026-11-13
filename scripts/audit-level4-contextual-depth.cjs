/* Level 4 contextual instruction audit: distinguish short main reading from full casework.
 * Generates 100-lesson (including 24 flagged) review evidence, NOT legal certification.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),html=read('index.html');
const ordered=[...html.matchAll(/<script[^>]*src="\.\/([^"]+\.js)"/g)].map(x=>x[1]);
const first=ordered.indexOf('level4.js'),last=ordered.indexOf('level4-audit-inventory-2026.js');
assert.ok(first>=0&&last>first,'Level 4 coursework script loading sequence missing');
const ctx={window:{}};vm.createContext(ctx);
for(const path of ordered.slice(first,last+1))vm.runInContext(read(path),ctx,{filename:path,timeout:10000});
const courses=ctx.window.LAW_LEVEL4||[],lessons=courses.flatMap(c=>c.lessons||[]);
assert.equal(courses.length,7);assert.equal(lessons.length,100);
const wordCount=x=>String(x||'').split(/\s+/).filter(Boolean).length;
const flagged=[],rows=[['lesson_id','course','title','reading_words','scenario_words','assignment_words','counterargument_words','worked_guide_present','worked_guide_words','source_authority_present','source_check_independent','rubric_present','contextual_status','reviewer_action']];
for(const course of courses)for(const l of course.lessons){
 const n=wordCount(l.reading),short=n<220,guide=l.workedGuide||null;
 const g=guide?wordCount(Object.values(guide).filter(v=>typeof v==='string').join(' ')):0;
 const hasAuthority=Boolean(l.authority||l.sourceUrls||l.sourceReview?.sourceUrls);
 const rubric=Boolean(l.formativeRubric||l.rubric);
 const scenario=wordCount(l.scenario),assignment=wordCount(l.assignment),counter=wordCount(l.counterarguments);
 assert.ok(l.id&&l.question&&Array.isArray(l.options)&&Number.isInteger(l.answer)&&l.answer>=0&&l.answer<l.options.length,'Malformed original assessment '+l.id);
 if(short)flagged.push(l.id);
 const context=(short&&(g>0&&scenario>8&&assignment>12&&counter>8))?'SUPPORTING CASEWORK PRESENT — HUMAN DEPTH REVIEW PENDING':short?'ADDITIONAL CONTEXT CHECK REQUIRED':'MAIN READING LENGTH NOT FLAGGED';
 rows.push([l.id,course.title,l.title,n,scenario,assignment,counter,Boolean(guide),g,hasAuthority,'NO — QUALIFIED REVIEW PENDING',rubric,context,short?'Check core reading with worked guide, case packet and any law changes':'Check legal holdings and grade written work with examiner']);
}
assert.equal(flagged.length,24,'Expected 24 short primary-reading flags, found '+flagged.length);
const esc=s=>'"'+String(s).replace(/"/g,'""').replace(/[\r\n]+/g,' ')+'"';
fs.writeFileSync('audit/level4-100-lesson-contextual-depth-register.csv',rows.map(r=>r.map(esc).join(',')).join('\n')+'\n');
console.log('PASS: generated 100-lesson Level 4 contextual-depth review register; 24 short main readings correctly queued.');
console.log('Flagged lessons: '+flagged.join(', '));
console.log('Guides present for flagged lessons: '+rows.slice(1).filter(r=>r[3]<220&&r[7]===true).length+' / 24');
console.log('PENDING: independent source accuracy, later treatment, holistic academic depth and qualified essay assessment.');

/* Read-only audit of Level 4 traceability across lesson records and authoring registers.
 * Run from repository root: node scripts/audit-level4-traceability.cjs
 * Passing means the inventory is internally consistent, NOT legally certified.
 */
'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const sources=[...html.matchAll(/<script[^>]*src="\.\/([^"]+)"[^>]*>/g)].map(m=>m[1]);
const first=sources.indexOf('level4.js');
const last=sources.indexOf('level4-audit-inventory-2026.js');
assert.ok(first>=0 && last>first,'Level 4 scripts not found in the actual page');
const scripts=sources.slice(first,last+1);
const ctx={window:{}};vm.createContext(ctx);
for(const path of scripts){
  assert.ok(path==='level4.js'||path.startsWith('level4-'),'Unexpected script in curriculum load window: '+path);
  vm.runInContext(fs.readFileSync(path,'utf8'),ctx,{filename:path,timeout:5000});
}
const lessons=ctx.window.LAW_LEVEL4.flatMap(course=>course.lessons);
assert.equal(ctx.window.LAW_LEVEL4.length,7,'Expected seven Level 4 courses');
const ids=lessons.map(l=>l.id),unique=new Set(ids);
assert.equal(ids.length,100,'Expected 100 lesson records');
assert.equal(unique.size,100,'Duplicate Level 4 lesson ID');
const byId=new Map(lessons.map(l=>[l.id,l]));
const completed=ctx.window.LAW_LEVEL4_COMPLETION_AUDIT?.records||[];
const inventory=ctx.window.LAW_LEVEL4_AUDIT?.records||[];
const sourceRegister=fs.readFileSync('LEVEL4-LEGAL-ACCURACY-SOURCE-REGISTER-2026-11.md','utf8');
const canonicalSourceTable=sourceRegister.split('## Reviewer acceptance criteria')[0];
const sourceRows=canonicalSourceTable.split(/\r?\n/).filter(line=>/^\| L4-\d+-\d+ \|/.test(line));
function exactSet(items,label){
 assert.equal(items.length,100,label+' does not have exactly 100 entries');
 const keys=items.map(i=>typeof i==='string'?i:i.id);
 assert.equal(new Set(keys).size,100,label+' contains duplicate entries');
 assert.deepEqual([...keys].sort(),[...unique].sort(),label+' IDs differ from live course lessons');
}
exactSet(completed,'Completion audit');
exactSet(inventory,'Source inventory');
exactSet(sourceRows.map(line=>line.split('|')[1].trim()),'Lesson source register');
const fullFields=['legalPropositionsVerified','fullPrimarySourcesChecked','subsequentTreatmentChecked',
 'jurisdictionAndEffectiveDateChecked','practicalAssessmentHumanGraded','independentReviewerApproved','liveBrowserAccepted'];
for(const record of completed){
 for(const field of fullFields)
  assert.equal(record.review[field],false,'Unsupported review certification '+record.id+' '+field);
}
for(const item of inventory){
 assert.equal(item.approved,false,'False academic review approval '+item.id);
 assert.equal(item.reviewer,null,'Reviewer metadata without verified evidence '+item.id);
}
const reviewed=lessons.filter(l=>l.advancedQuiz2026?.authorityReview);
assert.equal(reviewed.length,100,'Not every lesson has an advanced-question authority review record');
let bounded=0,family=0;
for(const lesson of reviewed){
 const q=lesson.advancedQuiz2026, rec=q.authorityReview;
 assert.equal(q.id,lesson.id,'Question ID mismatch '+lesson.id);
 assert.ok(Array.isArray(q.options)&&q.options.length===3,'Missing options '+lesson.id);
 assert.ok(Number.isInteger(q.answer)&&q.options[q.answer],'Invalid keyed answer '+lesson.id);
 assert.equal(rec.independentApproval,false,'Unsubstantiated approval '+lesson.id);
 assert.equal(rec.legalAccuracyCertified,false,'Unsubstantiated legal accuracy certification '+lesson.id);
 assert.ok(rec.sourceUrls?.length>0,'No advanced-question research reference '+lesson.id);
 assert.ok(rec.sourceUrls.every(url=>url.startsWith('https://')),'Malformed advanced source '+lesson.id);
 if(rec.sourceFamilyReviewed===true){
  family++;
  assert.equal(rec.answerHashBasis,q.options[q.answer],'Answer drift after recorded review '+lesson.id);
  assert.equal(rec.questionHashBasis,q.question,'Question drift after recorded review '+lesson.id);
  assert.equal(rec.fullKeyCertified,false,'Generic source family incorrectly certified '+lesson.id);
 } else bounded++;
}
assert.equal(family,92,'Expected 92 family-only cross-references');
assert.equal(bounded,8,'Expected eight bounded earlier checks');
const supplemental=lessons.filter(l=>Number(l.id.split('-')[2])>10);
assert.equal(supplemental.length,30,'Expected 30 supplemental case labs');
let provisionalLinks=0;
for(const lesson of supplemental){
 const ref=lesson.sourceReview?.sourceUrls||lesson.sourceUrls||[];
 assert.ok(ref.length>0,'No starting source for '+lesson.id);
 assert.ok(ref.every(url=>/^https:\/\//.test(url)),'Malformed research source '+lesson.id);
 assert.ok(lesson.question&&lesson.options[lesson.answer]&&lesson.why,'Missing MCQ in '+lesson.id);
 if(lesson.sourceReview?.sourceRole)provisionalLinks++;
}
assert.ok(provisionalLinks>=2,'The two contract/agency source-scope cautions were lost');
for(const id of ['L4-1-12','L4-1-13','L4-1-14','L4-3-12','L4-5-12']){
 assert.ok(byId.has(id),'Tracked correction target disappeared: '+id);
}
assert.ok(sourceRegister.includes('Independent attorney/law-faculty review') &&
 sourceRegister.includes('outstanding'),'Source register lost external sign-off disclaimer');
console.log('PASS — 100/100 course lessons aligned with completion, inventory and legal source registers.');
console.log('PASS — 100/100 advanced-question metadata, source presence and unchanged keyed answers checked.');
console.log('PASS — 30/30 supplemental lesson source references and answer indices structurally checked.');
console.log('PASS — independent legal/academic and device acceptance flags remain unapproved.');
console.log('NOT VERIFIED — substantive holdings, case citator treatment, human essay grading, live account/device sync or independent approval.');

/* Structural regression for authored Level 5, not independent legal verification.
 * Run: node scripts/verify-level5.cjs
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const js=fs.readFileSync('level5.js','utf8'),ui=fs.readFileSync('level5-ui.js','utf8'),app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8');
new vm.Script(js,{filename:'level5.js'});new vm.Script(ui,{filename:'level5-ui.js'});new vm.Script(app,{filename:'app.js'});
const extraSrc=fs.readFileSync('level5-batch2-coursework.js','utf8');
new vm.Script(extraSrc,{filename:'level5-batch2-coursework.js'});
const thirdSrc=fs.readFileSync('level5-batch3-coursework.js','utf8');
new vm.Script(thirdSrc,{filename:'level5-batch3-coursework.js'});
const caseSrc=fs.readFileSync('level5-capstone-case-packet.js','utf8'),diagSrc=fs.readFileSync('level5-bar-diagnostic.js','utf8');
new vm.Script(caseSrc,{filename:'level5-capstone-case-packet.js'});new vm.Script(diagSrc,{filename:'level5-bar-diagnostic.js'});
const box={window:{}};vm.createContext(box);vm.runInContext(js,box,{timeout:4000});vm.runInContext(extraSrc,box,{timeout:4000});vm.runInContext(thirdSrc,box,{timeout:4000});vm.runInContext(caseSrc,box,{timeout:4000});vm.runInContext(diagSrc,box,{timeout:4000});
const courses=box.window.LAW_LEVEL5,lessons=courses.flatMap(c=>c.lessons);
assert.equal(courses.length,7,'Expected seven original advanced tracks');
assert.equal(lessons.length,98,'Three batches require 98 authored lessons');
assert.equal(new Set(lessons.map(l=>l.id)).size,98,'Duplicate lesson ID');
let finals=0;
for(const [ci,c] of courses.entries()){
 assert.equal(c.id,'L5-'+(ci+1));
 assert.equal(c.lessons.length,14,'Each course must include three substantial modules');
 for(const [li,l] of c.lessons.entries()){
  assert.equal(l.id,c.id+'-'+(li+1),'Lesson ID and order mismatch');
  for(const field of ['title','authority','sourceUrl','scenario','reading','rule','counterarguments','assignment','variation','question','why','sourceCheck','status'])assert.ok(typeof l[field]==='string' && l[field].trim().length >= (['reading','scenario','rule','counterarguments','assignment','variation','why'].includes(field)?45:4),'Missing substantial lesson field '+l.id+':'+field);
  assert.ok(l.reading.split(/\s+/).length>=220,'Insufficient detailed instruction '+l.id);
  assert.ok(l.scenario.length>100,'Weak scenario '+l.id);
  assert.ok(l.assignment.length>80,'Weak written task '+l.id);
  assert.ok(l.sourceUrl.startsWith('https://'),'Missing official or reported case starting point '+l.id);
  assert.ok(Array.isArray(l.options)&&l.options.length===3&&new Set(l.options).size===3,'Bad options '+l.id);
  assert.ok(Number.isInteger(l.answer)&&l.answer>=0&&l.answer<3,'Invalid answer '+l.id);
  assert.ok(l.options[l.answer].length>40,'Unhelpful correct key '+l.id);
  assert.ok(l.workedGuide,'Missing worked guide '+l.id);
  for(const section of ['threshold','analysis','counter','variations','source','exemplar','status'])assert.ok(l.workedGuide[section]?.length>45,'Short worked guide '+l.id+':'+section);
  assert.equal(l.rubric.reduce((n,x)=>n+x.points,0),100,'Written grading rubric not 100 '+l.id);
  assert.equal(l.review.independentReviewerApproved,false,'False human sign-off '+l.id);
  assert.equal(l.review.legalAccuracyCertified,false,'False legal accuracy certification '+l.id);
  assert.equal(l.review.humanGraded,false,'Unverified grading '+l.id);
  assert.equal(l.barPractice.officialNCBE,false,'Misrepresented exam source '+l.id);
  if(l.exam){finals++;assert.ok(li===3||li===8||li===13,'Written final should close module I, II or III '+l.id);assert.equal(l.exam.points,100);assert.equal(l.exam.humanReviewRequired,true);assert.equal(l.exam.independentApproval,false)}
 }
}
assert.equal(finals,21,'Three modules require 21 written finals');
const distribution=[0,1,2].map(k=>lessons.filter(l=>l.answer===k).length);
assert.ok(Math.max(...distribution)-Math.min(...distribution)<=1,'Advanced lesson answer positions should be balanced');
assert.ok(html.includes('src="./level5.js"')&&html.includes('src="./level5-batch2-coursework.js"')&&html.includes('src="./level5-batch3-coursework.js"')&&html.includes('src="./level5-ui.js"'),'Missing page script references');
assert.ok(html.includes('src="./level5-capstone-case-packet.js"')&&html.includes('src="./level5-bar-diagnostic.js"'),'Missing assessment scripts');
const capstone=lessons.find(l=>l.id==='L5-7-4').casePacket;
assert.ok(capstone&&capstone.fictional&&capstone.timeline.length>=7&&capstone.exhibits.length===6&&capstone.unknowns.length>=6&&capstone.variations.length>=3,'Incomplete interdisciplinary final capstone dossier');
assert.equal(capstone.reviewRubric.reduce((n,x)=>n+x.maxPoints,0),100,'Capstone independent scoring rubric should total 100');
assert.equal(capstone.independentExaminerApproved,false,'Do not imply approved examiner');
const bank=box.window.LAW_LEVEL5_DIAGNOSTIC;
assert.equal(bank.length,21,'Expected 21 original diagnostic prompts');
assert.equal(new Set(bank.map(x=>x.id)).size,21,'Duplicate diagnostic ID');
for(const item of bank){assert.ok(courses.some(c=>c.id===item.course),'Question assigned to missing course');assert.ok(item.options.length===3&&new Set(item.options).size===3,'Invalid distinct diagnostic options');assert.ok(Number.isInteger(item.answer)&&item.options[item.answer],'Missing keyed diagnostic answer');assert.ok(item.why.length>45,'Insufficient rule-application feedback')}
assert.ok(ui.includes("const diagnostic=")&&ui.includes("l5dxcheck")&&ui.includes("l5diagnostic"),'Diagnostic navigation not connected');
assert.ok(ui.includes("l.casePacket")&&ui.includes("l.casePacket.exhibits"),'Capstone dossier UI missing');

assert.ok(html.indexOf('src="./level5.js"')<html.indexOf('src="./level5-ui.js"')&&html.indexOf('src="./level5-ui.js"')<html.indexOf('src="./app.js"'),'Incorrect boot order');
assert.ok(app.includes('renderLevel5();return'),'Level 5 catalog route missing');
assert.ok(app.includes('Advanced Law & Bar Capstone'),'Level 5 catalog name absent');
assert.ok(ui.includes("const L5_KEY='law-academy-level5-v1'"),'Level 5 progress should have isolated key');
assert.ok(ui.includes("const latest=read()"),'Level 5 saves must merge current storage');
assert.ok(ui.includes("changed()"),'Missing stale-write guard');
assert.ok(ui.includes('renderBarSimulator()'),'Existing bar simulator link lost');
assert.ok(ui.includes('const words=field.value.trim()'),'Missing worked guide attempt gate');
for(const oldKey of ['law-academy-level3-v1','law-academy-level4-v1','law-academy-level4-finals-v1'])assert.ok(!js.includes(oldKey)&&!ui.includes(oldKey),'Legacy storage key touched '+oldKey);
console.log('PASS: 7 courses, 98 complete lesson records, 21 100-point written finals, one six-exhibit capstone and 21 original diagnostic prompts.');
console.log('PASS: Level 5 catalog assets, independent local draft key, conflict guard and existing bar simulator route.');
console.log('NOT TESTED: legal holdings/subsequent treatment, physical device, live Firebase, human grading or accreditation.');

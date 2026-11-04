// Level 4 draft curriculum checks. No claims of legal-source approval or browser readiness.
import {readFileSync} from 'node:fs';
import {runInNewContext, Script} from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../level4.js',import.meta.url),'utf8');
new Script(source,{filename:'level4.js'});
const courses=runInNewContext('const window={};'+source+'\nwindow.LAW_LEVEL4');
assert.equal(courses.length,7,'Expected seven 3L course tracks');
const ids=new Set();
for(const course of courses){
  assert.ok(course.id && course.title && Array.isArray(course.lessons),'Missing course metadata');
  assert.ok(course.status.includes('draft'),'Unreviewed course must remain draft');
  assert.ok(course.lessons.length===10,'Each track requires ten authored practical lessons including a final');
  for(const lesson of course.lessons){
    assert.ok(!ids.has(lesson.id),'Duplicate lesson id '+lesson.id);
    ids.add(lesson.id);
    for(const field of ['title','authority','scenario','reading','counterarguments','assignment','question','why','status'])assert.ok(typeof lesson[field]==='string' && lesson[field].trim(),'Missing '+field+' in '+lesson.id);
    assert.ok(lesson.reading.trim().split(/\s+/).length>=160,'Opening legal instruction too short '+lesson.id);
    assert.ok(lesson.scenario.length>=110,'Insufficient factual case scenario '+lesson.id);
    assert.ok(lesson.assignment.length>=150,'Insufficient practical written assignment '+lesson.id);
    assert.ok(lesson.options.length===3,'Expected three answer options '+lesson.id);
    assert.ok(lesson.answer>=0&&lesson.answer<lesson.options.length,'Invalid correct answer '+lesson.id);
    assert.ok(lesson.status.includes('draft'),'Unreviewed lesson must remain draft');
  }
}
assert.equal(ids.size,70,'Expected 70 authored Level 4 lessons across seven course tracks');
console.log('PASS: seven Level 4 draft courses with ten lessons each. Independent source verification and academic sign-off are outstanding.');

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const ui=readFileSync(new URL('../level4-ui.js',import.meta.url),'utf8');
new Script(ui,{filename:'level4-ui.js'});
for(const asset of ['src="./level4.js"','src="./level4-ui.js"'])assert.ok(html.includes(asset),'Missing Level 4 asset: '+asset);
assert.ok(app.includes('typeof renderLevel4==="function"'),'Level 4 catalog route not connected');
for(const token of ['function renderLevel4()','data-l4course','data-l4lesson','l4draft','l4check','l4backup','Back to course'])assert.ok(ui.includes(token),'Missing Level 4 student experience: '+token);
assert.ok(ui.includes("const L4_KEY='law-academy-level4-v1'"),'Use isolated Level 4 local draft key');
assert.ok(ui.includes('not yet cloud-synchronized'),'Must accurately warn about local-only draft storage');
console.log('PASS: Level 4 curriculum and student navigation assets configured. Browser functionality, cloud synchronization and legal accuracy remain unverified.');

const all=courses.flatMap(c=>c.lessons);
assert.equal(new Set(all.map(l=>l.question)).size,70,'Level 4 questions must not duplicate across lessons');
for(const course of courses){
 for(let index=0;index<10;index++){
  const lesson=course.lessons[index];
  assert.equal(lesson.id,course.id+'-'+(index+1),'Level 4 lesson order should remain stable '+course.id);
  assert.ok(lesson.assignment.includes('Build')||lesson.assignment.includes('Draft')||lesson.assignment.includes('Create')||lesson.assignment.includes('Prepare')||lesson.assignment.includes('Write')||lesson.assignment.includes('Produce')||lesson.assignment.includes('Develop')||lesson.assignment.includes('Rewrite'),'Lesson needs a practical document deliverable '+lesson.id);
 }
}
console.log('PASS: 70 distinct Level 4 quizzes and ordered legal-writing assignments. This does not establish substantive case-law accuracy.');

for(const course of courses){
 const final=course.lessons[9];
 assert.ok(final.title.includes('Final Examination'),'Final exam title missing '+course.id);
 assert.ok(final.scenario.startsWith('FICTIONAL THIRD-YEAR FINAL CASE FILE:'),'Final needs a marked hypothetical '+course.id);
 assert.ok(final.examRubric?.points===100,'Final exam rubric missing '+course.id);
 assert.equal(final.examRubric.areas.reduce((sum,a)=>sum+a.points,0),100,'Final rubric allocation mismatch '+course.id);
 assert.ok(final.examRubric.examinerQuestions.length>=4,'Missing examiner prompts '+course.id);
 assert.ok(final.assignment.includes('qualified human substantive review'),'Automated grade may not imply mastery '+course.id);
}
console.log('PASS: seven distinct Level 4 written finals contain 100-point rubrics and human assessment gates.');

const finalGuideFields=['status','threshold','analysis','counter','variations','source','exemplar'];
for(const course of courses){
 const lesson=course.lessons[9],guide=lesson.workedGuide;
 assert.ok(guide&&typeof guide==='object','Final lacks worked reasoning guide '+course.id);
 for(const field of finalGuideFields)assert.ok(typeof guide[field]==='string'&&guide[field].trim().length>=45,'Final guide section missing or too brief '+course.id+': '+field);
 assert.ok(guide.status.includes('not an official key'),'Do not imply model guide is legally approved '+course.id);
 assert.ok(lesson.assignment.includes('qualified human substantive review'),'Final human assessment boundary missing '+course.id);
}
assert.ok(ui.includes("if(lesson.workedGuide)"),'Guide reveal handler missing');
assert.ok(ui.includes("if(words<100)"),'Worked reasoning must follow a written attempt');
assert.ok(ui.includes("l4guideBody")&&ui.includes("l4showGuide"),'Guide display UI missing');
console.log('PASS: seven complete provisional reasoning comparisons with reveal-after-attempt gate. Does not verify current law, sources or browser persistence.');

const reviewedAuthorityChecks=[
 ['L4-1-4','https://www.law.cornell.edu/rules/fre/rule_702','more likely than not'],
 ['L4-1-6','https://www.law.cornell.edu/rules/frcp/rule_50','28-day'],
 ['L4-4-5','https://supreme.justia.com/cases/federal/us/515/304/','Johnson v. Jones'],
 ['L4-4-9','https://supreme.justia.com/cases/federal/us/556/418/','Nken v. Holder']
];
for(const [id,url,required] of reviewedAuthorityChecks){
 const lesson=all.find(l=>l.id===id);
 assert.ok(lesson&&lesson.reading.includes(url)&&lesson.reading.includes(required),'Primary-authority checkpoint absent '+id);
 assert.equal(lesson.sourceReview?.checkedAsOf,'2026-11-03','Checkpoint date absent '+id);
 assert.ok(lesson.sourceReview.scope.includes('not a complete subsequent-treatment review'),'Review boundary absent '+id);
}
console.log('PASS: four targeted authority checkpoints are recorded, without representing comprehensive legal verification.');

const extendedChecks={
 'L4-1-1':'frcp/rule_37','L4-1-2':'frcp/rule_56',
 'L4-2-8':'476/79','L4-2-9':'title28-section2254',
 'L4-4-7':'436/658','L4-5-2':'449/383','L4-7-2':'frcp/rule_37'
};
for(const [id,sourceFragment] of Object.entries(extendedChecks)){
 const lesson=all.find(l=>l.id===id);
 assert.ok(lesson?.reading.includes('TARGETED PRIMARY-AUTHORITY CROSSCHECK'),'Crosscheck missing '+id);
 assert.ok(lesson.reading.includes(sourceFragment),'Incorrect source link '+id);
 assert.equal(lesson.sourceReview?.checkedAsOf,'2026-11-03','Missing dated checkpoint '+id);
 assert.ok(lesson.sourceReview.scope.includes('not complete subsequent-treatment verification'),'Checkpoint scope is overstated '+id);
}
assert.equal(all.filter(l=>l.sourceReview).length,11,'Expected exactly eleven documented targeted source checkpoints');
console.log('PASS: eleven bounded primary-authority checkpoints; not a citator or full legal accuracy certification.');

const newSourceReviewChecks={
 'L4-1-3':['frcp/rule_30','fre/rule_613'],
 'L4-1-5':['frcp/rule_68'],
 'L4-1-7':['frcp/rule_69'],
 'L4-1-8':['frcp/rule_16'],
 'L4-1-9':['frcp/rule_51'],
 'L4-4-1':['uscode/text/28/1292'],
 'L4-4-2':['frap/rule_28'],
 'L4-6-7':['model_rules_of_professional_conduct/rule_4_1_truthfulness_in_statements_to_others']
};
for(const [id,fragments] of Object.entries(newSourceReviewChecks)){
 const lesson=all.find(l=>l.id===id);
 assert.ok(lesson?.sourceReview,'Dated source checkpoint absent '+id);
 assert.equal(lesson.sourceReview.checkedAsOf,'2026-11-03','Incorrect source review date '+id);
 assert.ok(lesson.sourceReview.scope.includes('no complete subsequent-treatment'),'Source review overclaim '+id);
 for(const fragment of fragments)assert.ok(lesson.reading.includes(fragment)&&lesson.sourceReview.sourceUrls.some(u=>u.includes(fragment)),'Source mismatch '+id+': '+fragment);
}
assert.ok(all.find(l=>l.id==='L4-1-3').reading.includes('December 1, 2024'),'FRE 613(b) amendment timing missing');
assert.equal(all.filter(l=>l.sourceReview).length,19,'Expected nineteen bounded source checkpoints');
console.log('PASS: nineteen limited authority reviews documented. Neither a comprehensive citator check nor professional sign-off.');

const recentReviewIds=['L4-2-1','L4-2-5','L4-3-1','L4-3-3','L4-5-1','L4-5-5','L4-6-1','L4-6-3','L4-6-4','L4-6-8','L4-7-1','L4-7-4','L4-7-5','L4-7-8'];
for(const id of recentReviewIds){
 const lesson=all.find(l=>l.id===id);
 assert.ok(lesson?.sourceReview&&lesson.reading.includes('TARGETED LEGAL-AUTHORITY CROSSCHECK'),'Missing current batch source review '+id);
 assert.equal(lesson.sourceReview.checkedAsOf,'2026-11-03','Incorrect dated review '+id);
 assert.ok(lesson.sourceReview.sourceUrls?.length>=1 && lesson.sourceReview.sourceUrls.every(u=>u.startsWith('https://')),'Missing primary source or agency link '+id);
}
assert.ok(all.find(l=>l.id==='L4-3-3').reading.includes('March 19, 2026'),'2026 HSR regulatory procedural update missing');
assert.equal(all.filter(l=>l.sourceReview).length,33,'Expected 33 targeted source checks');
console.log('PASS: 33 limited legal-source checks, including the March 2026 HSR form change; external substantive review remains pending.');

const auditBatchSeven={
 'L4-2-3':['559/356','566/156'],
 'L4-2-4':['565/228'],
 'L4-2-6':['2026-guidelines-manual/annotated-2026-chapter-6'],
 'L4-4-6':['528/167'],
 'L4-4-8':['supct/rule_10'],
 'L4-5-3':['t5/s706'],
 'L4-5-6':['t5/s706'],
 'L4-7-9':['449/383']
};
for(const [id,fragments] of Object.entries(auditBatchSeven)){
 const lesson=all.find(l=>l.id===id);
 assert.ok(lesson?.sourceReview,'Source review marker missing '+id);
 assert.equal(lesson.sourceReview.checkedAsOf,'2026-11-03','Source review date missing '+id);
 for(const fragment of fragments)assert.ok(lesson.sourceReview.sourceUrls.some(u=>u.includes(fragment)),'Expected source absent '+id+': '+fragment);
 assert.ok(lesson.reading.includes('Bounded rule/opinion review only'),'Legal review must disclose limited scope '+id);
}
assert.equal(all.filter(l=>l.sourceReview).length,41,'Expected 41 bounded source checkpoints');
console.log('PASS: 41 targeted authority checkpoints, no comprehensive legal accuracy or qualified academic review implied.');

const auditBatchEight=['L4-1-10','L4-2-7','L4-2-10','L4-3-2','L4-3-4','L4-4-3','L4-4-4','L4-4-10','L4-5-4','L4-5-7','L4-6-2','L4-6-9'];
for(const id of auditBatchEight){
 const lesson=all.find(l=>l.id===id);
 assert.ok(lesson?.sourceReview&&lesson.reading.includes('TARGETED PRIMARY-SOURCE RESEARCH NOTE'),'Missing eighth audit note '+id);
 assert.equal(lesson.sourceReview.checkedAsOf,'2026-11-03','Review date missing '+id);
 assert.ok(lesson.sourceReview.sourceUrls?.every(url=>url.startsWith('https://')),'Unsafe or missing source '+id);
 assert.ok(lesson.sourceReview.scope.includes('independent citation currency'),'Legal accuracy qualification absent '+id);
}
assert.equal(all.filter(l=>l.sourceReview).length,53,'Expected 53 limited authority checkpoints');
console.log('PASS: 53 marked, narrowly scoped source checks; independent legal and academic assessment remains outstanding.');

const finalSourceAuditIds=['L4-2-2','L4-3-5','L4-3-6','L4-3-7','L4-3-8','L4-3-9','L4-3-10','L4-5-8','L4-5-9','L4-5-10','L4-6-5','L4-6-6','L4-6-10','L4-7-3','L4-7-6','L4-7-7','L4-7-10'];
for(const id of finalSourceAuditIds){
 const lesson=all.find(l=>l.id===id);
 assert.ok(lesson?.sourceReview&&lesson.reading.includes('TARGETED SOURCE REVIEW'),'Missing final source note '+id);
 assert.equal(lesson.sourceReview.checkedAsOf,'2026-11-03','Wrong source-check date '+id);
 assert.ok(lesson.sourceReview.sourceUrls?.length>0&&lesson.sourceReview.sourceUrls.every(u=>u.startsWith('https://')),'Missing source link '+id);
 assert.ok(lesson.sourceReview.scope.includes('no exhaustive legal accuracy'),'Source review scope missing '+id);
}
assert.equal(all.filter(l=>l.sourceReview).length,70,'All 70 lessons must contain a bounded source checkpoint');
assert.ok(all.find(l=>l.id==='L4-3-6').reading.includes('2025'),'DGCL 144 amendment warning absent');
assert.ok(all.find(l=>l.id==='L4-6-5').reading.includes('45-day'),'ADEA group waiver distinction absent');
console.log('PASS: 70 of 70 lessons include a limited authority marker; this does NOT constitute independent exhaustive verification.');

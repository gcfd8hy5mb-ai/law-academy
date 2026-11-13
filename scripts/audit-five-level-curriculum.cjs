/* Cross-level academic completion register — authoring/structural evidence only.
 * Generates a complete 523-lesson review queue. NO network, Firebase, grading or uploads.
 * A PASS never means professional legal verification or independent academic approval.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const file=p=>fs.readFileSync(p,'utf8');
const contexts={};
const app=file('app.js'),appBoundary=app.indexOf('const app=document.querySelector');
assert.ok(appBoundary>0,'Level 1 curriculum boundary missing');
contexts.l1=vm.runInNewContext(app.slice(0,appBoundary)+'\nCOURSES');
function load(files,end){
 const ctx={window:{}};vm.createContext(ctx);
 for(const f of files)vm.runInContext(file(f),ctx,{filename:f,timeout:10000});
 return ctx.window[end];
}
const l2src=file('level2.js'),l2end=l2src.indexOf('const L2_KEY=');
assert.ok(l2end>0,'Level 2 data boundary missing');
contexts.l2=loadSource(l2src.slice(0,l2end),'LAW_LEVEL2');
function loadSource(source,key){const ctx={window:{}};vm.runInNewContext(source,ctx);return ctx.window[key]}
contexts.l3=load(['level3.js'],'LAW_LEVEL3');
const html=file('index.html');
const sources=[...html.matchAll(/<script[^>]*src="\.\/([^"]+)"[^>]*>/g)].map(x=>x[1]);
const first=sources.indexOf('level4.js'),last=sources.indexOf('level4-audit-inventory-2026.js');
assert.ok(first>=0&&last>first,'Level 4 module window missing');
contexts.l4=load(sources.slice(first,last+1),'LAW_LEVEL4');
const l5files=['level5.js','level5-batch2-coursework.js','level5-batch3-coursework.js','level5-final-module-coursework.js','level5-depth-workshops-batch1.js','level5-depth-workshops-batch2.js','level5-depth-workshops-batch3.js','level5-depth-workshops-batch4.js','level5-depth-workshops-batch5.js'];
contexts.l5=load(l5files,'LAW_LEVEL5');
const shapes=[
 {key:'l1',label:'Pre-Law',courses:6,lessons:85,prefix:null},
 {key:'l2',label:'Level 2',courses:7,lessons:128,prefix:'L2'},
 {key:'l3',label:'Level 3',courses:7,lessons:70,prefix:'L3'},
 {key:'l4',label:'Level 4',courses:7,lessons:100,prefix:'L4'},
 {key:'l5',label:'Level 5',courses:7,lessons:140,prefix:'L5'}
];
const ids=new Set(),rows=[],summaries=[];
const wordCount=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
const csv=x=>'"'+String(x??'').replace(/"/g,'""').replace(/[\r\n]+/g,' ')+'"';
for(const shape of shapes){
 const courses=contexts[shape.key];assert.equal(courses.length,shape.courses,shape.label+' course count drift');
 const lessons=courses.flatMap(c=>c.lessons);
 assert.equal(lessons.length,shape.lessons,shape.label+' lesson count drift');
 let totalWords=0,assessments=0,written=0,casework=0,sourcePointers=0,shortReadings=0;
 for(const course of courses){
  assert.ok(course.id&&course.title,shape.label+' course metadata missing');
  if(shape.prefix)assert.ok(course.id.startsWith(shape.prefix+'-'),'Wrong course level '+course.id);
  for(const lesson of course.lessons){
   const globalId=shape.key==='l1'?course.id+'/'+lesson.id:lesson.id;
   assert.ok(!ids.has(globalId),'Collision/renamed lesson ID '+globalId);ids.add(globalId);
   if(shape.prefix)assert.ok(globalId.startsWith(course.id+'-'),'Lesson not in its course '+globalId);
   assert.ok(lesson.title&&lesson.title.trim(),'Missing lesson title '+globalId);
   let instruction,assessment,caseText='',writing='',source='';
   if(shape.key==='l1'){
    assert.ok(Array.isArray(lesson.sections)&&lesson.sections.length>=4,'Thin Level 1 lesson '+globalId);
    instruction=lesson.sections.map(v=>v[1]).join(' ');
    assessment=lesson.quiz;caseText=instruction;writing=instruction;source='';
   }else{
    instruction=lesson.reading||'';
    assessment=lesson;
    caseText=lesson.scenario||lesson.problem||'';
    writing=lesson.assignment||lesson.problem||'';
    source=lesson.sourceUrl||lesson.authority||'';
   }
   const words=wordCount(instruction);totalWords+=words;
   assert.ok(words>70,'Incomplete teaching body '+globalId);
   if(words<220)shortReadings++;
   const validQ=Boolean(assessment&&assessment.question&&Array.isArray(assessment.options)&&assessment.options.length>=2&&
     Number.isInteger(assessment.answer)&&assessment.answer>=0&&assessment.answer<assessment.options.length&&
     typeof (assessment.why)==='string'&&assessment.why.trim());
   assert.ok(validQ,'Missing/malformed assessment '+globalId);
   assessments++;
   if(wordCount(writing)>=12)written++;
   if(wordCount(caseText)>=12)casework++;
   if(source)sourcePointers++;
   if(shape.key==='l5'){
    assert.equal(lesson.review?.independentReviewerApproved,false,'Inappropriate Level 5 approval '+globalId);
    assert.equal(lesson.review?.legalAccuracyCertified,false,'Inappropriate Level 5 certification '+globalId);
   }
   if(shape.key==='l4'){
    assert.match(lesson.status||'',/draft|review|pending/i,'Level 4 unsupported status '+globalId);
   }
   rows.push([shape.label,course.id,course.title,lesson.id,lesson.title,words,validQ?'PRESENT':'MISSING',
    wordCount(writing)>=12?'PRESENT':'CHECK',wordCount(caseText)>=12?'PRESENT':'CHECK',
    source||'course-level source inventory','PENDING QUALIFIED LEGAL REVIEW','PENDING HUMAN ASSESSMENT REVIEW',
    'PENDING INDEPENDENT ACADEMIC SIGNOFF','']);
  }
 }
 summaries.push({level:shape.label,courses:courses.length,lessons:lessons.length,questions:assessments,
   withWritingTasks:written,withCaseMaterial:casework,withLessonSourcePointers:sourcePointers,shortReadings,
   teachingWords:totalWords});
}
assert.equal(rows.length,523,'Program-wide curriculum record count changed');
assert.equal(ids.size,523,'Cross-level identifiers are not distinct');
assert.equal(summaries.reduce((n,s)=>n+s.questions,0),523,'Question count drift');
const header=['level','course_id','course_title','lesson_id','lesson_title','teaching_words','assessment',
 'written_work','case_or_application','source_starting_point_not_verified','legal_review','exam_review','academic_signoff','reviewer_notes'];
const outfile='audit/five-level-academic-review-inventory.csv';
fs.mkdirSync('audit',{recursive:true});
fs.writeFileSync(outfile,[header,...rows].map(a=>a.map(csv).join(',')).join('\n')+'\n');
console.log('PASS: 34 courses, 523 unique lessons, 523 valid lesson assessments, five-level crosswalk; IDs preserved.');
for(const s of summaries)console.log(JSON.stringify(s));
console.log('Generated '+outfile+' with 523 lesson-level review tasks. All professional approval fields PENDING.');
console.log('NOT VERIFIED: doctrinal accuracy, current law, case treatment, external examiner grading or independent academic comparability.');

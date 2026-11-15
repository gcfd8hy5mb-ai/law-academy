// Read-only academic audit queue generator. Records evidence in authored files, NOT legal accuracy.
// Run: node scripts/audit-five-level-readiness.mjs
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const evaluate=(file,expression,cutAt)=>{
 const src=read(file);
 const code=cutAt?src.slice(0,src.indexOf(cutAt)):src;
 if(cutAt)assert.ok(src.indexOf(cutAt)>0,'Missing data boundary: '+file);
 return runInNewContext('const window={};\n'+code+'\n'+expression,{}, {timeout:8000});
};
const prelaw=evaluate('app.js','COURSES','const app=document.querySelector');
const level2=evaluate('level2.js','window.LAW_LEVEL2','const L2_KEY');
const level3=evaluate('level3.js','window.LAW_LEVEL3');
const level4=evaluate('level4.js','window.LAW_LEVEL4');
const bar=evaluate('bar-simulator-data.js','window.LAW_BAR_BANK');
const academic=[['Pre-Law',prelaw],['1L',level2],['2L',level3],['3L',level4]];
const words=text=>String(text||'').trim().split(/\s+/).filter(Boolean).length;
const plain=value=>String(value??'').replace(/\r?\n/g,' ');
const csv=value=>'"'+plain(value).replaceAll('"','""')+'"';
const urls=text=>[...new Set((String(text||'').match(/https:\/\/[^\s"'<>]+/g)||[]).map(s=>s.replace(/[.,;)]+$/,'')))];
const allRows=[],seen=new Set(),summary=[];
for(const [level,courses] of academic){
 assert.ok(Array.isArray(courses)&&courses.length>0,'No courses for '+level);
 let count=0,withSource=0,weak=0;
 for(const course of courses){
  for(const lesson of course.lessons||[]){
   assert.ok(lesson.id&&!seen.has(lesson.id),'Missing or duplicate lesson ID '+lesson.id);
   seen.add(lesson.id);count++;
   const body=level==='Pre-Law'?(lesson.sections||[]).map(s=>s[0]+' '+s[1]).join('\n'):String(lesson.reading||'');
   const readingWords=words(body),record=lesson.sourceReview||{};
   const references=urls([body,lesson.authority||'',record.sourceUrls||[]].flat().join(' '));
   const hasBounded=Boolean(record.checkedAsOf&&record.scope);
   if(hasBounded)withSource++;
   const findings=[];
   if(readingWords<(level==='Pre-Law'?250:300))findings.push('DEPTH_REVIEW');
   if(!references.length)findings.push('NO_DIRECT_PRIMARY_LINK_IN_LESSON');
   if(!hasBounded)findings.push('NO_DATED_BOUNDED_SOURCE_CHECK');
   if(!lesson.assignment&&level!=='Pre-Law')findings.push('NO_WRITING_ASSIGNMENT');
   if(findings.length)weak++;
   const status='PENDING_INDEPENDENT_LEGAL_ACCURACY_REVIEW';
   allRows.push([level,course.id,course.title,lesson.id,lesson.title,readingWords,
      lesson.authority||'',references.join(' | '),record.checkedAsOf||'',record.scope||'',
      findings.join(' | ')||'STRUCTURALLY_DOCUMENTED_NOT_SUBSTANTIVELY_VERIFIED',
      status,'','','','','']);
  }
 }
 summary.push({level,courses:courses.length,authoredLessons:count,datedBoundedSourceMarkers:withSource,lessonsFlaggedForTriage:weak});
}
assert.equal(seen.size,prelaw.flatMap(c=>c.lessons).length+level2.flatMap(c=>c.lessons).length+level3.flatMap(c=>c.lessons).length+level4.flatMap(c=>c.lessons).length);
const questions=Array.isArray(bar.questions)?bar.questions:[];
const tasks=Array.isArray(bar.tasks)?bar.tasks:[];
const bankRows=questions.map(q=>({
 id:q.id,subject:q.subject||'',questionWords:words(q.question),
 explanationWords:words(q.explanation),hasSourceLink:urls((q.explanation||'')+' '+(q.facts||'')).length>0,
 review:'PENDING_INDEPENDENT_LEGAL_ACCURACY_REVIEW'
}));
const report={
 generatedDate:'2026-11-15',
 scope:'Repository-only automated authoring and triage inventory',
 limitations:[
  'A source URL or dated sourceReview marker does not verify accurate quotation, current law, case subsequent treatment, controlling jurisdiction, or completeness.',
  'No external lawyer or academic reviewed these lessons by running this script.',
  'No degree, academic equivalency, bar eligibility, or legal competency is established.',
  'Bar simulator is a formative practice destination; it must not be counted as a complete fifth academic course level.',
  'All analyses are read-only; student drafts, grades, cloud records and curricula are unchanged.'
 ],
 summary,
 barPractice:{questions:questions.length,writingTasks:tasks.length,questionReview:bankRows},
 proposedReviewOrder:[
  'Priority A: Validate primary authorities and jurisdiction in lessons lacking direct primary links.',
  'Priority B: Check cited dates, amendments, subsequent case treatment and factual case briefs, especially tax and procedural rules.',
  'Priority C: Review instructional depth, issue spotting and independent writing rubrics with qualified faculty.',
  'Priority D: Separately evaluate and design Level 5 substantive course scope; do not treat bar practice as course completion.'
 ]
};
mkdirSync(new URL('../audit/',import.meta.url),{recursive:true});
const header=['level','course_id','course_title','lesson_id','lesson_title','reading_words','asserted_authority','direct_urls_in_lesson','bounded_source_date','bounded_source_scope','triage_flags','external_review_status','jurisdiction_review','source_text_review','negative_treatment_review','qualified_reviewer','review_date'];
writeFileSync(new URL('../audit/five-level-academic-review-queue.csv',import.meta.url),[header,...allRows].map(r=>r.map(csv).join(',')).join('\n')+'\n');
writeFileSync(new URL('../audit/five-level-readiness-summary.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log('PASS read-only audit: '+JSON.stringify(summary));
console.log('PASS bar practice inventory: '+questions.length+' questions, '+tasks.length+' writing tasks; not a fifth course level');
console.log('REVIEW STATUS: independent legal and academic assessment pending for all authored lessons.');

/* Course-level exam blueprint from the audited 523-lesson inventory.
 * No automated legal accuracy or writing-quality certification.
 */
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const path='audit/five-level-academic-review-inventory.csv';
assert.ok(fs.existsSync(path),'Run scripts/audit-five-level-curriculum.cjs first');
const lines=fs.readFileSync(path,'utf8').trimEnd().split(/\r?\n/);
function csvDecode(line){
 const values=[],rx=/"((?:[^"]|"")*)"(?:,|$)/g;let m;
 while((m=rx.exec(line)))values.push(m[1].replace(/""/g,'"'));
 return values;
}
const fields=csvDecode(lines[0]);
const idx=key=>{const i=fields.indexOf(key);assert.ok(i>=0,'Required inventory field '+key);return i};
const keys=['level','course_id','course_title','lesson_id','assessment','written_work','case_or_application','teaching_words','legal_review','exam_review'];
const at=Object.fromEntries(keys.map(k=>[k,idx(k)]));
const rows=lines.slice(1).map(csvDecode);
assert.equal(rows.length,523);
for(const row of rows)assert.equal(row.length,fields.length,'Malformed reviewer inventory record');
const byCourse=new Map();
for(const row of rows){
 const id=row[at.course_id],level=row[at.level],lesson=row[at.lesson_id];
 if(!byCourse.has(id))byCourse.set(id,{level,id,title:row[at.course_title],lessons:0,lessonChecks:0,writtenWork:0,caseRecords:0,shortReadings:0,manualLegalReview:0,humanExamReview:0,flaggedLessonIds:[]});
 const c=byCourse.get(id);assert.equal(c.level,level);c.lessons++;
 if(row[at.assessment]==='PRESENT')c.lessonChecks++;
 if(row[at.written_work]==='PRESENT')c.writtenWork++;
 if(row[at.case_or_application]==='PRESENT')c.caseRecords++;
 if(Number(row[at.teaching_words])<220){c.shortReadings++;c.flaggedLessonIds.push(lesson)}
 if(row[at.legal_review].startsWith('PENDING'))c.manualLegalReview++;
 if(row[at.exam_review].startsWith('PENDING'))c.humanExamReview++;
}
assert.equal(byCourse.size,34);
const out=[['stage','course_id','course_title','lessons','valid_lesson_questions','written_assignment_fields','case_application_fields','under_220_word_screen','flagged_lesson_ids','primary_law_qualified_review_pending','written_exam_human_review_pending','next_review_action']];
for(const c of byCourse.values()){
 assert.equal(c.lessonChecks,c.lessons,'Missing lesson question '+c.id);
 assert.equal(c.manualLegalReview,c.lessons,'Missing professional-review caution '+c.id);
 assert.equal(c.humanExamReview,c.lessons,'Missing grader-review caution '+c.id);
 let action=c.shortReadings?'Inspect flagged readings with adjoining case labs and examination packets':'Review actual written finals, source currency and examiner moderation';
 out.push([c.level,c.id,c.title,c.lessons,c.lessonChecks,c.writtenWork,c.caseRecords,c.shortReadings,c.flaggedLessonIds.join(' '),c.manualLegalReview,c.humanExamReview,action]);
}
const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
const outfile='audit/five-level-exam-blueprint-screen.csv';
fs.writeFileSync(outfile,out.map(row=>row.map(q).join(',')).join('\n')+'\n');
console.log('PASS: generated '+outfile+' for 34 courses and 523 lesson-level question/writing coverage records.');
console.log('SCREEN ONLY: this does not establish comprehensive issue coverage, exam validity, human grading or current legal authority.');
for(const stage of ['Pre-Law','Level 2','Level 3','Level 4','Level 5']){
 const cc=[...byCourse.values()].filter(c=>c.level===stage);
 console.log(stage+': '+cc.length+' courses, '+cc.reduce((n,c)=>n+c.lessons,0)+' lessons; '+cc.reduce((n,c)=>n+c.shortReadings,0)+' short-reading flags.');
}

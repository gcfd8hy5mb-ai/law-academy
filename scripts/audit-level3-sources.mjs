// Generate a reproducible source-review queue; not a determination of legal accuracy.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../level3.js',import.meta.url),'utf8');
const courses=runInNewContext('const window={};'+src+'\nwindow.LAW_LEVEL3');
const q=v=>'"'+String(v??'').replaceAll('"','""').replace(/\r?\n/g,' ')+'"';
const rows=[['course_id','course','lesson_id','lesson','asserted_authorities','review_status','jurisdiction_checked','operative_date_checked','primary_text_checked','negative_treatment_checked','reviewer','notes']];
for(const course of courses)for(const lesson of course.lessons)rows.push([
 course.id,course.title,lesson.id,lesson.title,lesson.authority,
 'PENDING QUALIFIED SOURCE REVIEW','','','','','',''
]);
if(rows.length!==71)throw Error('Expected 70 lessons in source-review inventory');
const output=new URL('../audit/level3-source-review-inventory.csv',import.meta.url);
mkdirSync(new URL('../audit/',import.meta.url),{recursive:true});
writeFileSync(output,rows.map(row=>row.map(q).join(',')).join('\n')+'\n');
console.log('Generated 70-row Level 3 primary-law review queue. No sources have been certified.');

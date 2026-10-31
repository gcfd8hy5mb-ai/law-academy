// Pre-Law lesson-by-lesson source audit inventory. Run: node scripts/audit-prelaw-sources.mjs
// This is a triage report, not legal verification or academic sign-off.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const boundary=source.indexOf('const app=document.querySelector');
if(boundary<0)throw Error('Course-data boundary missing');
const courses=runInNewContext(source.slice(0,boundary)+'\nCOURSES');
const startingPoints={
 law101:'https://www.uscourts.gov/about-federal-courts/court-role-and-structure',
 law102:'https://constitution.congress.gov/',
 law103:'https://www.law.cornell.edu/',
 law104:'https://www.uscourts.gov/',
 law105:'https://www.law.cornell.edu/',
 law106:'https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/'
};
const esc=s=>'"'+String(s??'').replaceAll('"','""')+'"';
const rows=[['course_id','course','lesson_id','lesson','instruction_words','question','starting_reference_not_verified','jurisdiction_review','primary_source_review','doctrinal_review','reviewer','review_date','notes']];
for(const c of courses){for(const l of c.lessons){
 const words=l.sections.reduce((n,p)=>n+p[1].trim().split(/\s+/).length,0);
 rows.push([c.id,c.title,l.id,l.title,words,l.quiz.question,startingPoints[c.id]||'', 'PENDING','PENDING','PENDING','','','']);
}}
const output=rows.map(row=>row.map(esc).join(',')).join('\n')+'\n';
mkdirSync(new URL('../audit/',import.meta.url),{recursive:true});
writeFileSync(new URL('../audit/prelaw-85-source-review.csv',import.meta.url),output);
console.log('Generated '+(rows.length-1)+' lesson review rows; every source/accuracy status remains PENDING.');

/* Five-level source-law triage for 523 lessons.
 * The three narrowly confirmed propositions below are NOT complete validation
 * of any lesson, and neither this script nor its artifacts approve a source.
 * Consumes the existing 523-lesson review queue; never writes student data.
 */
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const lines=fs.readFileSync('audit/five-level-academic-review-inventory.csv','utf8').trimEnd().split(/\r?\n/);
function parse(line){const result=[],re=/"((?:[^"]|"")*)"(?:,|$)/g;let m;while((m=re.exec(line)))result.push(m[1].replace(/""/g,'"'));return result}
const keys=parse(lines[0]),records=lines.slice(1).map(parse),idx=s=>{const i=keys.indexOf(s);assert.ok(i>=0,'Missing source field '+s);return i};
assert.equal(records.length,523,'Expected complete 523-lesson source-review queue');
const col=Object.fromEntries(['level','course_id','lesson_id','lesson_title','source_starting_point_not_verified'].map(k=>[k,idx(k)]));
const narrow={
 'L3-3-2':'Loper Bright (2024): ambiguity alone does not mandate Chevron deference',
 'L3-3-1':'Loper Bright (2024): court independent judgment and valid statutory delegation distinction',
 'L3-1-9':'FRE 702 (2023): proponent more-likely-than-not gatekeeping and separate appellate review',
 'L4-1-4':'FRE 702 (2023): facts, methods and opinion application to the case',
 'L4-5-1':'Loper Bright (2024): statutory meaning versus delegated policy choices',
 'L5-1-2':'Rahimi (2024): facial challenge and credible-threat application; not every prohibition decided',
 'L5-4-1':'FRE 702 (2023): admissibility threshold distinct from generic Daubert familiarity',
 'L5-6-2':'Loper Bright (2024): APA independent judgment and agency delegation limits',
 'L3-7-9':'Smith (2024): absent analyst truth use distinct from unresolved testimonial inquiry',
 'L3-1-5':'Smith (2024): hearsay/expert basis is distinct from confrontation inquiry',
 'L4-2-4':'Smith (2024): substitute analyst and independently testimonial statements',
 'L5-4-2':'Smith (2024): surrogate forensic statements used for truth',
 'L5-4-7':'Smith (2024): independent expert versus absent analyst facts',
 'L3-3-4':'Jarkesy (2024): SEC fraud civil penalties and jury right',
 'L3-3-5':'Jarkesy (2024): specific penalty cause and agency forum',
 'L4-5-3':'Jarkesy (2024): civil-fraud penalty versus ordinary agency adjudication',
 'L5-1-3':'CASA (2025): universal preliminary injunction versus underlying merits',
 'L4-4-9':'CASA (2025): stay and injunction scope, class distinction',
 'L4-4-10':'CASA (2025): appellate relief without deciding merits'
};
const source={
 'Loper Bright':'https://www.supremecourt.gov/opinions/23pdf/22-451_7m58.pdf',
 'Rahimi':'https://www.supremecourt.gov/opinions/23pdf/22-915_8o6b.pdf',
 'FRE 702':'https://www.law.cornell.edu/rules/fre/rule_702',
 'Smith':'https://www.law.cornell.edu/supremecourt/text/22-899',
 'Jarkesy':'https://www.law.cornell.edu/supremecourt/text/22-859',
 'CASA':'https://www.law.cornell.edu/supremecourt/text/24A884'
};
const header=['level','course_id','lesson_id','lesson_title','existing_authority_or_research_starting_point','narrow_bounded_review_note','specific_source_for_bounded_review','jurisdiction_specific_source_validated','effective_date_validated','subsequent_treatment_validated','written_legal_reasoning_human_reviewed','reviewer_and_review_date','required_next_action'];
const out=[header],seen=new Set();
for(const row of records){
 assert.equal(row.length,keys.length,'Malformed lesson queue row');
 const id=row[col.lesson_id];assert.ok(!seen.has(id),'Duplicate lesson '+id);seen.add(id);
 const detail=narrow[id]||'',sourceUrl=detail.startsWith('Loper Bright')?source['Loper Bright']:detail.startsWith('Rahimi')?source['Rahimi']:detail.startsWith('FRE 702')?source['FRE 702']:detail.startsWith('Smith')?source['Smith']:detail.startsWith('Jarkesy')?source['Jarkesy']:detail.startsWith('CASA')?source['CASA']:'';
 out.push([row[col.level],row[col.course_id],id,row[col.lesson_title],row[col.source_starting_point_not_verified],detail,sourceUrl,'NO — PENDING QUALIFIED REVIEW','NO — PENDING QUALIFIED REVIEW','NO — PENDING QUALIFIED REVIEW','NO — PENDING QUALIFIED REVIEW','',detail?'Verify full doctrinal context, controlling forum and later negative treatment despite bounded source note':'Find operative primary authorities, controlling forum and dates; verify exact holdings/negative treatment and review case application']);
}
assert.equal(seen.size,523);
assert.equal(Object.keys(narrow).filter(id=>seen.has(id)).length,19,'Unmatched bounded-source-review ID');
const quote=v=>'"'+String(v??'').replace(/"/g,'""').replace(/[\r\n]+/g,' ')+'"';
const path='audit/five-level-primary-law-523-lesson-review-register.csv';
fs.writeFileSync(path,out.map(r=>r.map(quote).join(',')).join('\n')+'\n');
console.log('PASS: 523-lesson five-level primary-law review queue; 19 bounded source propositions identified and all full/current-law/legal-signoff fields PENDING.');
console.log('Generated '+path+'. Does not certify citation currentness or independently validate curricula.');

/* Substantive-scaffold triage of 24 shorter Level 4 main readings with their worked guides.
 * Automated evidence presence/length, not doctrinal certification.
 */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),html=read('index.html');
const scripts=[...html.matchAll(/<script[^>]*src="\.\/([^"]+\.js)"/g)].map(m=>m[1]);
const lo=scripts.indexOf('level4.js'),hi=scripts.indexOf('level4-audit-inventory-2026.js');
assert.ok(lo>=0&&hi>lo);
const context={window:{}};vm.createContext(context);
for(const name of scripts.slice(lo,hi+1))vm.runInContext(read(name),context,{filename:name,timeout:10000});
const cs=context.window.LAW_LEVEL4,lessons=cs.flatMap(c=>c.lessons);
assert.equal(cs.length,7);assert.equal(lessons.length,100);
const count=x=>String(x||'').trim().split(/\s+/).filter(Boolean).length;
const flagged=lessons.filter(l=>count(l.reading)<220),records=[];
assert.equal(flagged.length,24,'Depth-screening target changed; reconcile before certifying');
for(const l of flagged){
 const g=l.workedGuide||{};
 const check={
  id:l.id,mainReadingWords:count(l.reading),workedAnalysisWords:count(g.analysis),
  ruleThresholdWords:count(g.threshold),adverseTheoryWords:count(g.counter),
  factualVariationWords:count(g.variations),exemplarWords:count(g.exemplar),
  sourceInstructionsWords:count(g.source),assignmentWords:count(l.assignment),
  scenarioWords:count(l.scenario),rubricAvailable:Boolean(l.formativeRubric||l.rubric),
  humanReviewed:false
 };
 assert.ok(g.analysis&&g.threshold,'Missing foundational worked analysis '+l.id);
 assert.ok(g.counter&&g.variations,'Missing adverse analysis or factual variation '+l.id);
 assert.ok(g.source&&g.exemplar,'Missing source-check plan or exemplar '+l.id);
 assert.ok(check.scenarioWords>=8&&check.assignmentWords>=12,'Insufficient case/assignment context '+l.id);
 records.push(check);
}
const rows=[['lesson_id','core_reading_words','worked_analysis_words','rule_threshold_words','adverse_argument_words','changed_fact_words','exemplar_words','source_check_words','assignment_words','scenario_words','rubric_field_present','human_substantive_review','review_priority']];
for(const v of records){
 const flags=[];
 if(v.workedAnalysisWords<80)flags.push('worked analysis short');
 if(v.adverseTheoryWords<24)flags.push('adverse argument short');
 if(v.factualVariationWords<24)flags.push('factual variation short');
 if(v.sourceInstructionsWords<18)flags.push('source verification short');
 if(!v.rubricAvailable)flags.push('rubric field missing or outside assessed window');
 rows.push([v.id,v.mainReadingWords,v.workedAnalysisWords,v.ruleThresholdWords,v.adverseTheoryWords,v.factualVariationWords,v.exemplarWords,v.sourceInstructionsWords,v.assignmentWords,v.scenarioWords,v.rubricAvailable,'PENDING qualified academic and legal review',flags.length?flags.join('; '):'structure present — validate doctrine/citations and written response']);
}
const csv=x=>'"'+String(x??'').replace(/"/g,'""').replace(/[\r\n]+/g,' ')+'"';
const output='audit/level4-24-worked-guides-substantive-triage.csv';
fs.writeFileSync(output,rows.map(r=>r.map(csv).join(',')).join('\n')+'\n');
console.log('PASS: 24/24 short-reading Level 4 cases have threshold, worked analysis, opposing argument, variation, exemplar and source instructions.');
console.log('Detailed qualitative screening flags: '+rows.slice(1).filter(r=>r[12]!=='structure present — validate doctrine/citations and written response').length+' / 24.');
console.log('Generated '+output+'. Human correctness, authority currentness and actual grading are NOT validated.');

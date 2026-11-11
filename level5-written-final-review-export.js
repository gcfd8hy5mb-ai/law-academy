// Independent written final review packet, Level 5. Created locally only; no upload or automatic grade.
(function(){'use strict';
function generate(lesson,draft){
 if(!lesson?.exam||typeof draft!=='string'||!draft.trim())throw new Error('A written final and a nonempty student draft are required.');
 const text=v=>String(v??'').trim();
 const lines=[
  'LAW ACADEMY — LEVEL 5 WRITTEN FINAL — INDEPENDENT REVIEW COPY',
  'Original, unofficial law-education exercise. NOT a degree, bar qualification or certified exam.',
  'Assessment ID: '+text(lesson.id),
  'Title: '+text(lesson.title),
  'Review status: provisional; primary law and case treatment must be checked',
  'Blind candidate identifier (separate from personal identity): _________________',
  'Reviewer / date / qualifications / jurisdiction: _________________',
  'Review independence and conflict-of-interest statement: _________________',
  '',
  'PROCEDURAL SETTING AND FICTIONAL FACTS',
  text(lesson.scenario),
  '',
  'ASSIGNMENT AND DELIVERABLES',
  text(lesson.assignment),
  ...lesson.exam.deliverables.map((x,i)=>(i+1)+'. '+text(x)),
  '',
  'RESEARCH STARTING POINT — VERIFY DATE, JURISDICTION, HOLDING AND LATER TREATMENT',
  text(lesson.authority),
  text(lesson.sourceUrl),
  '',
  'CANDIDATE ANSWER (UNEDITED)',
  draft,
  '',
  'QUALIFIED EXAMINER SCORING — NO AUTOMATED PASS/FAIL',
  ...lesson.rubric.map(r=>text(r.name)+' — 0 to '+r.points+' points | Awarded: ____ | Supporting quote/page: ____ | Reason: ____'),
  'TOTAL: ____ / 100',
  'Controlling authorities verified, with date: __________________',
  'Material legal errors, omitted adverse sources, unsupported facts: __________________',
  'Record and remedy analysis / revision instructions: __________________',
  'Examiner signature and dated independent approval (if actually given): _________________',
  '',
  'No examiner signature or grading is implied by the existence of this packet.'
 ];
 return lines.join('\n');
}
window.LAW_LEVEL5_REVIEW_PACKET={version:'2026-11-10-draft',generate,automatedScoring:false,independentApproval:false};
})();
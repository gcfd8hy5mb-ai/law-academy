// Share-ready, de-identified reviewer packet generator. No account ID, self-ratings, or model answers.
// Called explicitly by student, never transmitted or uploaded by the application.
(function(){'use strict';
function generate(exam,draft){
 if(!exam||!exam.id||typeof draft!=='string')throw new Error('Exam and response required');
 const p=exam.casePacket||{},g=exam.examinerCalibration2026||{};
 const text=s=>String(s??'').trim();
 const list=(items,format)=>Array.isArray(items)?items.map((x,i)=>(i+1)+'. '+(format?format(x):text(x))).join('\n'):'';
 const rubric=Array.isArray(exam.rubric)?exam.rubric.map((c,i)=>{
  const guide=g.criteria?.[i];
  return (i+1)+'. '+text(c.name)+' — 0 to '+c.points+' points\n   Awarded points: ______\n   Evidence from candidate response: ______\n   Reason for score: ______'+(guide?'\n   Strong anchor: '+text(guide.strong)+'\n   Developing anchor: '+text(guide.developing)+'\n   Inadequate anchor: '+text(guide.inadequate):'');
 }).join('\n\n'):'';
 return [
 'LAW ACADEMY — INDEPENDENT PRACTICAL EXAM REVIEW PACKET',
 'Exam ID: '+text(exam.id),
 'Course: '+text(exam.course),
 'Case: '+text(exam.title),
 'Case is fictional. All supplied facts and authorities require independent verification.',
 'Candidate name: [not included — use a separate random blind identifier if needed]',
 'Reviewer identifier: __________  Review date: __________',
 'Reviewer qualifications and jurisdiction: ____________________________',
 'Reviewer conflict-of-interest check: ____________________________',
 'INSTRUCTIONS: Score independently. Do not infer accreditation, bar readiness, or external approval from this worksheet.',
 '',
 'CASE POSTURE AND PARTIES',
 text(p.parties),
 text(p.posture),
 text(p.jurisdiction),
 '',
 'EXAM PROMPT',
 text(exam.scenario),
 '',
 'SOURCE-AUTHORITY RESEARCH STARTING POINTS',
 text(exam.authority),
 text(exam.sourceUrl),
 '',
 'DATED CASE TIMELINE',
 list(p.timeline,x=>text(x[0])+' — '+text(x[1])),
 '',
 'EVIDENCE EXHIBITS',
 list(p.exhibits,x=>text(x[0])+': '+text(x[1])+'\n   Significance to investigate: '+text(x[2])),
 '',
 'FACTS NOT YET ESTABLISHED',
 list(p.unknowns),
 '',
 'FACT VARIATIONS',
 list(p.changedFacts),
 '',
 'REQUIRED DELIVERABLES',
 list(exam.requirements),
 '',
 'CANDIDATE ANSWER — UNEDITED BY REVIEW PACKET',
 draft,
 '',
 'INDEPENDENT WRITTEN SCORING (0–100)',
 rubric,
 '',
 'CATEGORY SUM: ______ / 100',
 'KEY LEGAL ERRORS / MISSING EVIDENCE: _________________________',
 'UNVERIFIED AUTHORITIES OR EFFECTIVE-DATE ISSUES: _________________________',
 'ADVERSE ARGUMENTS NOT ANSWERED: _________________________',
 'MOST IMPORTANT REMEDIATION: _________________________',
 'REVIEWER FINAL COMMENTS: _________________________',
 '',
 'SECOND REVIEW / MODERATION (optional)',
 'Second reviewer identifier: ______  Independent score: ______ / 100',
 'Category-level discrepancies and agreed reasons: _________________________',
 'Moderated score (if independently approved): ______ / 100',
 'Signed reviewer verification and date: _________________________',
 '',
 'DISCLAIMER: An unfilled worksheet is not independent evaluation. It excludes student self-ratings, teacher model answers and stored exam completion state.'
 ].join('\n');
}
window.LAW_LEVEL4_REVIEW_PACKET={version:'2026-11-08',generate};
})();
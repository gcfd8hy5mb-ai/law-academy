// Additive formative writing rubrics for Level 4 lessons without an examiner-specific rubric.
// Draft instructional scaffolding, not calibrated examiner marking or source validation.
(function(){
'use strict';
const courses=window.LAW_LEVEL4;if(!Array.isArray(courses))return;
const names={
 'L4-1':'Civil litigation and trial practice',
 'L4-2':'Criminal litigation and procedural safeguards',
 'L4-3':'Transactions, corporate governance and negotiation',
 'L4-4':'Constitutional and appellate advocacy',
 'L4-5':'Administrative and regulatory practice',
 'L4-6':'Client counseling and professional responsibility',
 'L4-7':'Integrated general counsel and complex practice'
};
const special={
 'L4-1':['Identify pleading/trial stage, evidentiary foundation and burden.','Specify admissibility, preservation and procedural deadlines.','Explain a viable motion, order or trial strategy.'],
 'L4-2':['Separate investigation, charge, trial, sentence or review posture.','Distinguish constitutional rights, evidence questions and remedies.','Protect the client decision and test both prejudice and alternative explanations.'],
 'L4-3':['Identify the entity, decision maker and source of transaction authority.','Separate fiduciary, statutory, contract and regulatory obligations.','Specify closing, indemnity, diligence or negotiation protections.'],
 'L4-4':['Identify jurisdiction, standing, preservation and standard of review.','Distinguish merits, prejudice and emergency or final remedy.','Write a neutral, record-grounded alternative holding.'],
 'L4-5':['Identify the enabling statute, agency procedure and final action.','Separate legal interpretation, factual record and enforcement discretion.','Recommend lawful process, compliance and review options.'],
 'L4-6':['Identify the client, authority to decide, conflicts and confidentiality.','Separate ethical confidentiality from privilege and evidentiary rules.','Explain informed options and realistic communication safeguards.'],
 'L4-7':['Coordinate civil, corporate, regulatory and ethical issues by forum.','Rank preservation, client authority and actual reporting deadlines.','Give conditional board/client options with accountable next actions.']
};
let added=0;
for(const course of courses){for(const lesson of course.lessons||[]){
 if(lesson.examRubric)continue;
 const focus=names[course.id]||'Applied legal analysis', guidance=special[course.id]||[];
 lesson.formativeRubric={
  status:'Draft formative self-review only — not examiner calibrated or approved',
  total:100,level:'Level 4',
  focus,lessonId:lesson.id,
  criteria:[
   {label:'Issue spotting, client and procedural posture',points:15,fullCredit:'Identify the main legal issue for "'+lesson.title+'", the client or decision maker, forum and posture. '+(guidance[0]||''),lowCredit:'Recount facts without stating the governing legal question, posture or burden.'},
   {label:'Accurate, current primary authority',points:20,fullCredit:'Verify "'+lesson.authority+'" against current operative primary law, effective date, local or state adoption, and controlling decisions. Note any disputed legal proposition.',lowCredit:'Assert unverified law or treat the lesson source list as certified and universally applicable.'},
   {label:'Fact-specific application and work product',points:30,fullCredit:'Use the case record to explain elements, relevant evidence, alternative interpretations, and the precise deliverables required by this assignment: '+lesson.assignment.slice(0,340),lowCredit:'Write a generic legal essay that does not apply the scenario or produce the requested professional work.'},
   {label:'Counterarguments, uncertainty and altered facts',points:20,fullCredit:'Address the adverse legal and factual position: '+lesson.counterarguments.slice(0,300)+' Then explain how missing or changed facts could affect the outcome.',lowCredit:'Ignore the strongest opposing argument or describe an outcome as guaranteed without needed evidence.'},
   {label:'Practical recommendation, ethics and clarity',points:15,fullCredit:'Give a conditional conclusion, remedies or client decisions and next steps. '+(guidance[2]||'')+' State what remains for qualified review.',lowCredit:'Give a conclusory recommendation without alternatives, ethics, deadlines or identified uncertainty.'}
  ],
  reviewSteps:['Verify primary law before scoring any criterion.','Underline each fact-to-rule connection and identify the cited case record.','Write the strongest response for the other side.','Describe two factual changes that could reverse or narrow the conclusion.','Self-score each category only after a complete draft; request qualified review for legal accuracy.'],
  commonErrors:['Unverified legal currency or jurisdiction','Bare rule recitation without element-level analysis','Absent strongest adverse argument','Omitted professional deliverable or remedial alternative'],
  reviewerStatus:'independent review pending'
 };
 added++;
}}
window.LAW_LEVEL4_FORMATIVE_RUBRIC_COUNT=added;
})();
window.PRELAW_APPLIED=[
 [
  "LAW 101",
  "Sources and Courts",
  "A city fines a neighborhood association for an outdoor weekend event under a municipal noise ordinance. The association argues that a state statute authorizes public gatherings and claims the ordinance infringes freedom of expression. A trial court dismissed the association's complaint without reaching whether the ordinance violates the Constitution. The record does not explain which procedural rule supported dismissal or whether the gathering involved expressive conduct.",
  "Identify legal authority, procedural posture, missing facts and possible appellate issues."
 ],
 [
  "LAW 102",
  "University Speech",
  "A public university regularly allows student organizations to reserve a meeting room. Administrators reject one organization's application after speakers criticized university policy, while approving a different organization for a similar event. Administrators say insufficient staffing, rather than disagreement with the group's views, explains the denial. The university's written room policy, room classification, booking history, and correspondence have not been provided.",
  "Analyze state action, forum classification, competing arguments and missing evidence."
 ],
 [
  "LAW 103",
  "Lease Research",
  "A tenant asks whether a lease clause requiring a thirty-day written notice before moving out is enforceable. Neither the state nor the lease date has been identified. The landlord relies on a five-year-old online article, and the tenant points to a newer secondary blog post. You do not have the current state landlord-tenant statute, local ordinance, or relevant appellate decisions.",
  "Plan primary-source research, record citations, verify currentness and explain uncertainty."
 ],
 [
  "LAW 104",
  "Negligence Memo",
  "A store employee saw liquid on an aisle floor at 1:05 p.m. but did not immediately mark or clean the spill. At 1:20 p.m. a customer slipped, fell, and reported an injury. A surveillance recording may show the customer looking at a phone. The state, floor conditions, injury records, employee testimony, and applicable comparative-fault rules are not supplied.",
  "Write an objective IRAC memorandum analyzing elements and both sides."
 ],
 [
  "LAW 105",
  "Contractor Dispute",
  "A homeowner paid a contractor a deposit for repairs under a document listing an estimated start date. The contractor missed that date and cited supply-chain problems. The agreement includes an ambiguous cancellation fee and an arbitration clause. The parties disagree about whether the contractor gave notice, whether the start date was guaranteed, and which state law controls.",
  "Analyze agreement terms, possible remedies, and dispute-resolution questions."
 ],
 [
  "LAW 106",
  "Conflicts of Interest",
  "A lawyer has an ongoing attorney-client relationship with Company A. A prospective client consults the lawyer about a transaction potentially adverse to Company A and reveals sensitive business information. The lawyer has not agreed to representation, and the relevant jurisdiction, scope of the current engagement, relationship between the transactions, and possible consent are unresolved.",
  "Identify conflicts, confidentiality concerns and jurisdiction-specific safeguards."
 ]
];
const PRELAW_APPLIED_SOURCES=[
["U.S. Constitution (Congress)","https://constitution.congress.gov/"],
["First Amendment (Congress)","https://constitution.congress.gov/browse/amendment-1/"],
["Cornell LII legal research starting point","https://www.law.cornell.edu/"],
["Cornell LII negligence introduction","https://www.law.cornell.edu/wex/negligence"],
["Cornell LII contract introduction","https://www.law.cornell.edu/wex/contract"],
["ABA Model Rules (verify jurisdiction rules)","https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/"]
];
const PRELAW_REASONING_GUIDES=[
["Distinguish the ordinance, state statute and constitutional claim.","Ask whether the dismissal was jurisdictional, procedural or on the merits.","Separate possible appellate standards from factual disputes."],
["Identify government action and the nature of the forum.","Compare the university's neutral staffing justification with the available evidence of viewpoint discrimination.","State which booking records and controlling cases you need."],
["Identify state, dates, parties and exact contract language.","Find current state statutes and binding cases rather than relying on a web article.","Keep a citation and currentness log; specify unanswered questions."],
["Organize duty, breach, actual/proximate causation and damages.","Examine notice, timing and possible comparative fault on both sides.","Avoid predicting an outcome without applicable state law."],
["Distinguish express terms from estimated timelines and representations.","Analyze cure, cancellation, arbitration and consumer statute questions.","Identify missing documents before recommending a remedy."],
["Identify duties to current and prospective clients.","Consider confidential information, conflicts screening and possible consent limits.","Check locally adopted rules before proposing representation."]
];
const PRELAW_FEEDBACK_CHECKS=[
 [["authority","jurisdiction"],["procedur","dismiss"],["appeal","review"],["argument","however"]],
 [["forum","speech"],["viewpoint","neutral"],["evidence","record"],["however","counter"]],
 [["state","jurisdiction"],["statute","primary"],["date","current"],["citation","source"]],
 [["duty","breach"],["causation","damage"],["notice","time"],["defense","comparative"]],
 [["contract","term"],["delay","breach"],["consumer","statute"],["arbitration","remedy"]],
 [["conflict","client"],["confidential","information"],["consent","screen"],["jurisdiction","rules"]]
];
function prelawReviewHints(i,draft){
 const text=String(draft).toLowerCase();
 const checks=PRELAW_FEEDBACK_CHECKS[i]||[];
 const missing=checks.filter(group=>!group.some(word=>text.includes(word)));
 const hints=missing.map(group=>'Consider discussing: '+group.join(' / ')+'.');
 return {count:checks.length-missing.length,total:checks.length,hints};
}
function prelawApplied(){
const key="law-academy-applied-v1";
let drafts={};try{drafts=JSON.parse(localStorage.getItem(key)||"{}")||{}}catch(e){}
const safe=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const renderList=()=>{
shell('<div class="pagehead"><h1>Pre-Law Applied Assessments</h1><p>Six independent writing exercises. Practice only; not a final grade.</p></div><div class="level-list">'+PRELAW_APPLIED.map((x,i)=>'<button class="level-row" data-applied="'+i+'"><span class="level-text"><strong>'+safe(x[0]+' — '+x[1])+'</strong><small>'+(drafts[i]?'Draft saved':'Start writing')+'</small></span><span class="level-arrow">›</span></button>').join('')+'</div><button id="appliedClose" class="button secondary">Home</button>','more');
document.querySelectorAll('[data-applied]').forEach(b=>b.onclick=()=>renderOne(Number(b.dataset.applied)));
document.querySelector('#appliedClose').onclick=renderHome;
};
const renderOne=i=>{
const a=PRELAW_APPLIED[i];
shell('<div class="pagehead"><h1>'+safe(a[0]+' — '+a[1])+'</h1><p>'+safe(a[2])+'</p></div><div class="review-item"><h3>Assignment</h3><p>'+safe(a[3])+'</p></div><div class="review-item"><h3>Research starting point</h3><p><a href="'+PRELAW_APPLIED_SOURCES[i][1]+'" target="_blank" rel="noopener noreferrer">'+safe(PRELAW_APPLIED_SOURCES[i][0])+'</a></p><p>Verify the controlling primary authority, applicable jurisdiction and currentness before relying on this reference.</p></div><div class="review-item"><h3>Reasoning guide</h3><ol>'+PRELAW_REASONING_GUIDES[i].map(item=>'<li>'+safe(item)+'</li>').join('')+'</ol><p>Use these prompts to develop independent arguments, not as an answer key.</p></div><label for="appliedDraft">Your analysis</label><textarea id="appliedDraft" class="writing-field" rows="12"></textarea><p id="appliedStatus" role="status"></p><button id="appliedSave" class="gold-button">Save</button><button id="appliedCopy" class="button secondary">Copy for review</button><button id="appliedFeedback" class="button secondary">Review my draft structure</button><div id="appliedFeedbackResult" aria-live="polite"></div><div class="review-item"><h3>Reviewer rubric (100 points)</h3><p>Issues 15 · Accurate law and sources 25 · Application and opposing arguments 30 · Jurisdiction and missing facts 15 · Clear conclusion 15.</p><p>Only a qualified independent reviewer can assess legal accuracy. This is not an automatically graded final.</p></div><button id="appliedBack" class="button secondary">All assessments</button>','more');
const field=document.querySelector('#appliedDraft'),status=document.querySelector('#appliedStatus');field.value=drafts[i]||'';
const save=()=>{drafts[i]=field.value;try{localStorage.setItem(key,JSON.stringify(drafts));status.textContent='Saved on this device';return true}catch(e){status.textContent='Save failed: copy your answer';return false}};
field.addEventListener('input',save);document.querySelector('#appliedSave').onclick=save;
document.querySelector('#appliedCopy').onclick=async()=>{save();try{await navigator.clipboard.writeText(a.join('\n')+'\nStudent answer:\n'+field.value);status.textContent='Copied for external review'}catch(e){status.textContent='Copy unavailable'}};
document.querySelector('#appliedFeedback').onclick=()=>{save();const review=prelawReviewHints(i,field.value);const notes=review.hints.length?review.hints.map(h=>'<li>'+safe(h)+'</li>').join(''):'<li>All topic indicators appeared; now verify whether your arguments and legal authorities are actually correct.</li>';document.querySelector('#appliedFeedbackResult').innerHTML='<div class="review-item"><h3>Draft structure feedback — not a grade</h3><p>'+review.count+' / '+review.total+' topic indicators detected. Keyword detection does not evaluate correctness or award points.</p><ul>'+notes+'</ul><p>Have an independent reviewer evaluate current primary law, factual application, counterarguments, and conclusions before considering this work assessed.</p></div>'};
document.querySelector('#appliedBack').onclick=()=>{save();renderList()};
};renderList();
}

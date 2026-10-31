window.PRELAW_APPLIED=[
["LAW 101","Sources and Courts","A city noise ordinance is challenged after a procedural dismissal.","Identify legal authority, procedural posture, missing facts and possible appellate issues."],
["LAW 102","University Speech","A public university denies a meeting-room request after controversial speech.","Analyze state action, forum classification, competing arguments and missing evidence."],
["LAW 103","Lease Research","A renter asks about a lease notice clause without identifying the state.","Plan primary-source research, record citations, verify currentness and explain uncertainty."],
["LAW 104","Negligence Memo","A retail employee reports a spill before a customer slips.","Write an objective IRAC memorandum analyzing elements and both sides."],
["LAW 105","Contractor Dispute","A contractor misses a proposed start date after receiving a deposit.","Analyze agreement terms, possible remedies, and dispute-resolution questions."],
["LAW 106","Conflicts of Interest","A prospective client's interests may be adverse to an existing client's.","Identify conflicts, confidentiality concerns and jurisdiction-specific safeguards."]
];
const PRELAW_APPLIED_SOURCES=[
["U.S. Constitution (Congress)","https://constitution.congress.gov/"],
["First Amendment (Congress)","https://constitution.congress.gov/browse/amendment-1/"],
["Cornell LII legal research starting point","https://www.law.cornell.edu/"],
["Cornell LII negligence introduction","https://www.law.cornell.edu/wex/negligence"],
["Cornell LII contract introduction","https://www.law.cornell.edu/wex/contract"],
["ABA Model Rules (verify jurisdiction rules)","https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/"]
];
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
shell('<div class="pagehead"><h1>'+safe(a[0]+' — '+a[1])+'</h1><p>'+safe(a[2])+'</p></div><div class="review-item"><h3>Assignment</h3><p>'+safe(a[3])+'</p></div><div class="review-item"><h3>Research starting point</h3><p><a href="'+PRELAW_APPLIED_SOURCES[i][1]+'" target="_blank" rel="noopener noreferrer">'+safe(PRELAW_APPLIED_SOURCES[i][0])+'</a></p><p>Verify the controlling primary authority, applicable jurisdiction and currentness before relying on this reference.</p></div><label for="appliedDraft">Your analysis</label><textarea id="appliedDraft" class="writing-field" rows="12"></textarea><p id="appliedStatus" role="status"></p><button id="appliedSave" class="gold-button">Save</button><button id="appliedCopy" class="button secondary">Copy for review</button><div class="review-item"><h3>Reviewer rubric (100 points)</h3><p>Issues 15 · Accurate law and sources 25 · Application and opposing arguments 30 · Jurisdiction and missing facts 15 · Clear conclusion 15.</p><p>Only a qualified independent reviewer can assess legal accuracy. This is not an automatically graded final.</p></div><button id="appliedBack" class="button secondary">All assessments</button>','more');
const field=document.querySelector('#appliedDraft'),status=document.querySelector('#appliedStatus');field.value=drafts[i]||'';
const save=()=>{drafts[i]=field.value;try{localStorage.setItem(key,JSON.stringify(drafts));status.textContent='Saved on this device';return true}catch(e){status.textContent='Save failed: copy your answer';return false}};
field.addEventListener('input',save);document.querySelector('#appliedSave').onclick=save;
document.querySelector('#appliedCopy').onclick=async()=>{save();try{await navigator.clipboard.writeText(a.join('\n')+'\nStudent answer:\n'+field.value);status.textContent='Copied for external review'}catch(e){status.textContent='Copy unavailable'}};
document.querySelector('#appliedBack').onclick=()=>{save();renderList()};
};renderList();
}

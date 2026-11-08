// Original, local-only writing practice; never updates legacy grades or mastery.
(function(){
'use strict';
const KEY='law-academy-case-writing-v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tasks=()=>window.LAW_BAR_WRITING_LABS||[],cases=()=>window.LAW_BAR_INTEGRATED_CASES||[];
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return {}}};
const save=(id,changes)=>{try{const data=read();data[id]={...(data[id]||{}),...changes,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(data));return true}catch{return false}};
const words=s=>s.trim()?s.trim().split(/\s+/).length:0;
const page=html=>shell(html,'exams');
function home(){
const data=read();
page('<div class="pagehead"><span class="gold-label">BAR PREPARATION · WRITTEN CASEWORK</span><h1>Legal Writing Lab</h1><p>Seven original legal memos, case documents, provisional model reasoning and examiner-style self-review rubrics. Drafts are stored on this device.</p></div><div class="level-list">'+tasks().map((t,i)=>{const c=cases().find(c=>c.id===t.caseId),d=data[t.caseId]||{};return '<button class="level-row" data-task="'+i+'"><span class="level-icon">✎</span><span class="level-text"><strong>'+esc(c?.title||t.caseId)+'</strong><small>'+words(d.draft||'')+' words · '+(d.submitted?'comparison unlocked':'draft')+'</small></span><span class="level-arrow">›</span></button>'}).join('')+'</div><div class="review-item"><h3>Assessment standard</h3><p>Write at least 200 words of original legal analysis before unlocking the model reasoning guide. Self-ratings are study aids, never a professional legal grade or bar-passage prediction. Existing exam scores and completion data are untouched.</p></div><button class="button secondary" id="writingExit">Back to exams</button>');
document.querySelectorAll('[data-task]').forEach(b=>b.onclick=lesson.bind(null,Number(b.dataset.task)));
document.querySelector('#writingExit').onclick=renderExams;
}
function lesson(i){
const t=tasks()[i];if(!t)return home();const c=cases().find(x=>x.id===t.caseId),prev=read()[t.caseId]||{};
page('<div class="pagehead"><span class="gold-label">WRITTEN CASE · '+esc(t.caseId)+'</span><h1>'+esc(c?.title||'Legal analysis')+'</h1><p>Target '+esc(t.expectedWords)+' words</p></div><section class="feature-card"><h2>Assignment</h2><p>'+esc(t.prompt)+'</p><p><strong>Research:</strong> '+esc(t.authority)+'</p></section>'+
(c?c.documents.map(([name,body])=>'<details class="review-item"><summary>'+esc(name)+'</summary><p>'+esc(body)+'</p></details>').join(''):'')+
'<section class="review-item"><label for="legalDraft"><strong>Your memorandum</strong></label><textarea id="legalDraft" class="writing-field" rows="15" placeholder="Issue · Rule · Application · Counterargument · Conclusion"></textarea><p id="legalDraftStatus" role="status"></p><button class="gold-button" id="legalModelButton">Reveal comparison after 200 words</button></section>'+
'<section class="review-item" id="legalModel" hidden><h2>Provisional model reasoning</h2><h3>Elements and application</h3><p>'+esc(t.guide)+'</p><h3>Opposing case</h3><p>'+esc(t.counter)+'</p><h3>Defensible conclusion</h3><p>'+esc(t.exemplar)+'</p><p>Not a certified answer key. Check current, governing primary authority and later treatment.</p></section>'+
'<section class="review-item"><h2>Self-assessment rubric</h2><p>Rate each dimension 0 to the indicated maximum. The total is a self-estimate only.</p>'+t.criteria.map((x,j)=>'<div class="review-item"><strong>'+esc(x.name)+' — '+x.max+' possible points</strong><p>'+esc(x.guidance)+'</p><label for="legalScore'+j+'">Self-rating</label> <input id="legalScore'+j+'" type="number" min="0" max="'+x.max+'" step="1" style="padding:8px;width:85px" value="'+(Number.isInteger(prev.ratings?.[j])?prev.ratings[j]:'')+'"></div>').join('')+'<p id="legalScoreStatus" role="status"></p><button class="button secondary" id="legalScoreSave">Save self-review</button></section><button class="button secondary" id="legalBack">Back to writing lab</button>');
const input=document.querySelector('#legalDraft'),status=document.querySelector('#legalDraftStatus');input.value=prev.draft||'';let baseline=input.value;status.textContent=words(input.value)+' words · local draft';
const persist=()=>{const current=read()[t.caseId]||{};if((current.draft||'')!==baseline){status.textContent='Another tab changed this draft. Copy your text before reloading.';return false}if(save(t.caseId,{draft:input.value})){baseline=input.value;status.textContent=words(input.value)+' words · saved locally';return true}status.textContent='Save failed. Copy your work.';return false};
input.oninput=persist;
document.querySelector('#legalModelButton').onclick=()=>{if(words(input.value)<t.minimumWords){status.textContent='Write '+t.minimumWords+' words first; currently '+words(input.value)+'.';return}if(!persist())return;save(t.caseId,{submitted:true});document.querySelector('#legalModel').hidden=false;status.textContent='Comparison unlocked. Revise your answer after review.'};
document.querySelector('#legalScoreSave').onclick=()=>{const scores=t.criteria.map((x,j)=>document.querySelector('#legalScore'+j).value.trim()).map(x=>x===''?null:Number(x));const valid=scores.every((x,j)=>x===null||(Number.isInteger(x)&&x>=0&&x<=t.criteria[j].max));const note=document.querySelector('#legalScoreStatus');if(!valid){note.textContent='Use whole numbers within each range or leave fields blank.';return}if(!save(t.caseId,{ratings:scores})){note.textContent='Could not save self-review.';return}note.textContent=scores.every(x=>x!==null)?'Self-rating: '+scores.reduce((a,b)=>a+b,0)+'/100. Not an examiner grade.':'Partial self-review saved locally.'};
document.querySelector('#legalBack').onclick=()=>{persist();home()};
}
window.renderBarWritingLab=home;
})();
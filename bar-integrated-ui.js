// Integrated case practice: separate browser storage. No edits to legacy exam grades or lesson mastery.
(function(){
'use strict';
const KEY='law-academy-integrated-cases-v1',CASES=()=>window.LAW_BAR_INTEGRATED_CASES||[];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fresh=()=>({active:null,answers:{},deadline:null,attempts:[],submitted:null});
const read=()=>{try{const d=JSON.parse(localStorage.getItem(KEY)||'null');return d&&typeof d==='object'?{...fresh(),...d}:fresh()}catch{return fresh()}};
let state=read(),ticker=null;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{return false}};
const clearTimer=()=>{if(ticker!==null){clearInterval(ticker);ticker=null}};
const layout=html=>{clearTimer();shell(html,'exams')};
const current=()=>CASES().find(c=>c.id===state.active);
const remaining=()=>Math.max(0,Math.ceil((state.deadline-Date.now())/1000));
const label=n=>String.fromCharCode(65+n);
function home(){
state=read();const attempts=state.attempts||[];
layout('<div class="pagehead"><span class="gold-label">BAR PREPARATION · ORIGINAL CASE FILES</span><h1>Integrated Legal Analysis</h1><p>Three multipart case files, each with source documents and four applied questions. Practice only — not official or validated NextGen UBE material.</p></div><div class="level-list">'+CASES().map(c=>'<button class="level-row" data-case="'+esc(c.id)+'"><span class="level-icon">⚖</span><span class="level-text"><strong>'+esc(c.title)+'</strong><small>'+esc(c.subject)+' · '+c.minutes+' min · 4 questions</small></span><span class="level-arrow">›</span></button>').join('')+'</div>'+(state.active?'<div class="review-item"><h3>Saved session</h3><p>Resume your current case or choose a new one. Starting a different case replaces only the unfinished integrated-case session.</p><button class="gold-button" id="caseResume">Resume current case</button></div>':'')+'<div class="review-item"><h3>Integrated practice history</h3>'+(attempts.length?attempts.slice(-10).reverse().map(x=>'<p>'+esc(x.title)+' · '+x.correct+'/'+x.total+' correct · '+x.score+'% · '+esc(x.at)+'</p>').join(''):'<p>No completed case sets yet.</p>')+'</div><button class="button secondary" id="caseExit">Back to exams</button>');
document.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>{if(state.active&&state.active!==b.dataset.case&&!confirm('Replace the unfinished case session?'))return;const c=CASES().find(x=>x.id===b.dataset.case);if(!c)return;if(state.active!==c.id){state.active=c.id;state.answers={};state.deadline=Date.now()+c.minutes*60000;state.submitted=null;save()}run()});
if(state.active)document.querySelector('#caseResume').onclick=run;
document.querySelector('#caseExit').onclick=renderExams;
}
function run(){
state=read();const c=current();if(!c)return home();if(state.deadline<=Date.now())return finish(true);
layout('<div class="pagehead"><span class="gold-label">INTEGRATED CASE FILE · '+esc(c.id)+'</span><h1>'+esc(c.title)+'</h1><p>Remaining: <strong id="caseClock"></strong>. Read all documents before answering. Answers save locally.</p></div>'+c.documents.map(([name,body],i)=>'<section class="review-item"><span class="gold-label">DOCUMENT '+(i+1)+'</span><h3>'+esc(name)+'</h3><p>'+esc(body)+'</p></section>').join('')+'<div class="review-item"><h2>Applied questions</h2><p>All items require selecting one best answer. Answers are scored as a study exercise, not a bar-passage prediction.</p></div>'+c.questions.map((q,i)=>'<section class="review-item"><span class="gold-label">QUESTION '+(i+1)+'</span><h3>'+esc(q.question)+'</h3>'+q.options.map((o,j)=>'<label style="display:block;padding:9px 0"><input type="radio" name="caseQ'+i+'" value="'+j+'" '+(state.answers[i]===j?'checked':'')+'> '+label(j)+'. '+esc(o)+'</label>').join('')+'</section>').join('')+'<p id="caseStatus" role="status">Responses save locally.</p><button class="gold-button" id="caseFinish">Submit case for review</button> <button class="button secondary" id="caseLeave">Save and leave</button>');
c.questions.forEach((q,i)=>document.querySelectorAll('input[name="caseQ'+i+'"]').forEach(input=>input.onchange=()=>{state.answers[i]=Number(input.value);document.querySelector('#caseStatus').textContent=save()?'Saved locally.':'Unable to save — keep this page open.'}));
document.querySelector('#caseLeave').onclick=home;
document.querySelector('#caseFinish').onclick=()=>{if(confirm('Submit these four answers now?'))finish(false)};
const tick=()=>{const e=document.querySelector('#caseClock');if(!e){clearTimer();return}const sec=remaining();e.textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');if(sec<=0)finish(true)};
tick();ticker=setInterval(tick,1000);
}
function finish(expired){
clearTimer();state=read();const c=current();if(!c)return home();const correct=c.questions.filter((q,i)=>state.answers[i]===q.answer).length;
state.submitted={caseId:c.id,answers:{...state.answers},expired,correct,total:c.questions.length,score:Math.round(100*correct/c.questions.length)};
state.attempts=Array.isArray(state.attempts)?state.attempts:[];state.attempts.push({at:new Date().toISOString(),id:c.id,title:c.title,correct,total:c.questions.length,score:state.submitted.score});
state.attempts=state.attempts.slice(-40);state.active=null;state.answers={};state.deadline=null;save();review();
}
function review(){
state=read();const r=state.submitted,c=CASES().find(x=>r&&x.id===r.caseId);if(!c)return home();
layout('<div class="pagehead"><span class="gold-label">INTEGRATED CASE REVIEW</span><h1>'+r.score+'% · '+r.correct+'/'+r.total+' correct</h1><p>'+esc(c.title)+(r.expired?' · Time expired':'')+'. This is original educational practice, not official bar scoring.</p></div>'+c.questions.map((q,i)=>'<section class="review-item"><span class="gold-label">'+(r.answers[i]===q.answer?'CORRECT':'REVIEW')+' · QUESTION '+(i+1)+'</span><h3>'+esc(q.question)+'</h3><p><strong>Your answer:</strong> '+(r.answers[i]===undefined?'Not answered':esc(q.options[r.answers[i]]))+'</p><p><strong>Best answer:</strong> '+esc(q.options[q.answer])+'</p><p>'+esc(q.why)+'</p></section>').join('')+'<div class="feature-card"><h3>Next study step</h3><p>Brief the identified rule in your own words, state which document supports each conclusion, and explain how one missing fact could change the outcome. Verify current primary authority before relying on any legal claim.</p></div><button class="gold-button" id="caseBack">Choose another case</button>');document.querySelector('#caseBack').onclick=home;
}
window.renderIntegratedCaseExam=home;
})();
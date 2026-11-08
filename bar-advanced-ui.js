// Advanced bar-formats extension. Keeps original bar simulator and its saved data intact.
(function(){
'use strict';
const KEY='law-academy-bar-advanced-v1',OLD='law-academy-bar-simulator-v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
const save=x=>{try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch{return false}};
const bank=()=>window.LAW_BAR_BANK.questions.filter(q=>/^QB(49|5[0-9]|60)$/.test(q.id));
const correct=(q,a)=>q.type==='multiple-select'?Array.isArray(a)&&a.length===q.answers.length&&q.answers.every(i=>a.includes(i)):a===q.answer;
const answerText=(q,a)=>a===undefined?'Not answered':Array.isArray(a)?a.map(i=>q.options[i]).join(' / ')||'Not answered':q.options[a]||'Not answered';
let interval=null,state=read(KEY,{answers:{},history:[],deadline:null,active:false,result:null});
const persist=()=>save(state);
const page=content=>{if(interval)clearInterval(interval);interval=null;shell(content,'exams')};
const countDown=()=>{const remaining=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));const e=document.querySelector('#advancedClock');if(e)e.textContent=Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');if(state.active&&remaining===0)submit(true)};
function load(){state=read(KEY,{answers:{},history:[],deadline:null,active:false,result:null});home()}
function home(){
const old=read(OLD,{history:[]}),rows=(old.history||[]).filter(x=>Array.isArray(x.subjects)),map=new Map();
for(const h of rows){for(const entry of h.subjects){const old=map.get(entry.subject)||{correct:0,total:0};old.correct+=entry.correct;old.total+=entry.total;map.set(entry.subject,old)}}
const summary=[...map].filter(([,v])=>v.total).map(([name,v])=>({name,percent:Math.round(v.correct/v.total*100),...v})).sort((a,b)=>a.percent-b.percent);
page('<div class="pagehead"><span class="gold-label">ADVANCED BAR PRACTICE</span><h1>Four-option and select-all questions</h1><p>12 original questions · 24 minutes · single-best-answer and exact-match multiple-select. Formative only, not an official or validated bar examination.</p></div><section class="feature-card"><h2>Advanced exam</h2><p>Half of the questions require selecting all correct options. Answers and completed attempts are stored on this device separately from the original simulator.</p><button class="gold-button" id="advancedStart">'+(state.active?'Resume exam':'Start advanced exam')+'</button></section><section class="review-item"><h3>Study performance dashboard</h3><p>Historical exam results from the existing simulator are included as a study signal, not a readiness prediction. Repeated questions count as repeated responses.</p>'+(summary.length?summary.map(x=>'<p><strong>'+esc(x.name)+'</strong> · '+x.percent+'% ('+x.correct+'/'+x.total+')'+(x.percent<80?' · review priority':'')+'</p>').join(''):'<p>No scored subject history yet.</p>')+'</section><div class="review-item"><h3>Advanced attempts</h3>'+(state.history.length?state.history.slice(-8).reverse().map(h=>'<p>'+esc(h.date)+' · '+h.score+'% ('+h.correct+'/'+h.total+')</p>').join(''):'<p>No advanced attempts yet.</p>')+'</div><button class="button secondary" id="advancedExit">Back to exams</button>');
document.querySelector('#advancedStart').onclick=()=>{if(!state.active){state={answers:{},history:state.history,deadline:Date.now()+24*60000,active:true,result:null};persist()}draw()};
document.querySelector('#advancedExit').onclick=renderExams;
}
function draw(){
state=read(KEY,state);if(!state.active)return home();if(state.deadline<=Date.now())return submit(true);
const qs=bank();
page('<div class="pagehead"><span class="gold-label">TIMED ADVANCED PRACTICE</span><h1>Advanced questions</h1><p>Time remaining: <strong id="advancedClock"></strong></p></div>'+qs.map((q,i)=>'<div class="review-item"><span class="gold-label">'+(i+1)+' OF '+qs.length+' · '+esc(q.subject)+'</span><p>'+esc(q.facts)+'</p><h3>'+esc(q.question)+'</h3><p>'+(q.type==='multiple-select'?'Select all correct answers. Exact-match scoring.':'Select one best answer.')+'</p>'+q.options.map((o,j)=>'<label style="display:block;padding:10px 0"><input type="'+(q.type==='multiple-select'?'checkbox':'radio')+'" name="aq'+i+'" value="'+j+'" '+(q.type==='multiple-select'?(Array.isArray(state.answers[q.id])&&state.answers[q.id].includes(j)?'checked':''):(state.answers[q.id]===j?'checked':''))+'> '+esc(o)+'</label>').join('')+'</div>').join('')+'<p id="advancedSave" role="status">Answers save locally.</p><button class="gold-button" id="advancedSubmit">Submit for scoring</button><button class="button secondary" id="advancedPause">Save and leave</button>');
qs.forEach((q,i)=>document.querySelectorAll('input[name="aq'+i+'"]').forEach(control=>control.onchange=()=>{state.answers[q.id]=q.type==='multiple-select'?[...document.querySelectorAll('input[name="aq'+i+'"]:checked')].map(x=>Number(x.value)).sort((a,b)=>a-b):Number(control.value);document.querySelector('#advancedSave').textContent=persist()?'Saved locally.':'Save failed; copy your work.'}));
document.querySelector('#advancedSubmit').onclick=()=>{if(confirm('Finish and score this exam now?'))submit(false)};
document.querySelector('#advancedPause').onclick=home;
countDown();interval=setInterval(countDown,1000);
}
function submit(expired){
if(!state.active)return review();if(interval)clearInterval(interval);interval=null;
const qs=bank(),hits=qs.filter(q=>correct(q,state.answers[q.id])).length,score=Math.round(100*hits/Math.max(1,qs.length));
state.result={answers:{...state.answers},expired,score};state.history.push({date:new Date().toISOString(),score,correct:hits,total:qs.length});state.history=state.history.slice(-40);state.active=false;persist();review();
}
function review(){
const qs=bank(),result=state.result;if(!result)return home();
page('<div class="pagehead"><span class="gold-label">ADVANCED PRACTICE REVIEW</span><h1>'+result.score+'% · original practice score</h1><p>'+ (result.expired?'Time expired. Responses were graded.':'Responses graded.') +' Exact selection required for multiple-select items. This score does not predict bar passage.</p></div>'+qs.map(q=>'<section class="review-item"><span class="gold-label">'+(correct(q,result.answers[q.id])?'CORRECT':'REVIEW')+' · '+esc(q.subject)+'</span><h3>'+esc(q.question)+'</h3><p><strong>Your answer:</strong> '+esc(answerText(q,result.answers[q.id]))+'</p><p><strong>Correct:</strong> '+esc(answerText(q,q.type==='multiple-select'?q.answers:q.answer))+'</p><p>'+esc(q.explanation)+'</p><p><small>Authority research starting point: '+esc(q.authority)+'; verify current controlling law.</small></p></section>').join('')+'<button class="gold-button" id="advancedBack">Back to advanced practice</button>');
document.querySelector('#advancedBack').onclick=home;
}
window.renderAdvancedBarPractice=load;
})();

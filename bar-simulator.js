// Standalone formative practice. Never writes lesson completion, legacy exam scores, or cloud keys.
(function(){
'use strict';
const KEY='law-academy-bar-simulator-v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bank=()=>window.LAW_BAR_BANK||{questions:[],tasks:[]};
const blank=()=>({mode:null,startedAt:null,deadline:null,answers:{},drafts:{},submitted:false,history:[]});
const read=()=>{try{let x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&typeof x==='object'&&!Array.isArray(x)?{...blank(),...x}:blank()}catch{return blank()}};
let state=read(),interval=null;
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{return false}};
const stopTimer=()=>{if(interval!==null){clearInterval(interval);interval=null}};
const layout=html=>{stopTimer();shell(html,'exams')};
const back=()=>{stopTimer();if(typeof renderExams==='function')renderExams();else renderBarSimulator()};
const remaining=()=>state.deadline===null?null:Math.max(0,Math.ceil((state.deadline-Date.now())/1000));
const clockText=s=>s===null?'Untimed':String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
const ensureLive=()=>{if(!state.submitted&&state.deadline!==null&&remaining()===0){submit(true);return false}return true};
function start(mode){state={...blank(),history:Array.isArray(state.history)?state.history:[],mode,startedAt:Date.now(),deadline:mode==='questions'?Date.now()+24*60*1000:mode==='performance'?Date.now()+90*60*1000:null};persist();draw()}
function home(){
state=read();
const done=state.history.length,hasActive=state.mode&&!state.submitted;
layout('<div class="pagehead"><span class="gold-label">BAR PREPARATION · PRACTICE PREVIEW</span><h1>Bar Exam Simulator</h1><p>Original practice material: 12 multiple-choice questions in 24 minutes, or 2 written lawyering tasks in 90 minutes. This is not a full NCBE exam or a bar-passage prediction.</p></div>'+
'<section class="feature-card"><h2>Practice modes</h2><p>Explanations, subject-level feedback, manual writing rubric, and saved drafts. Timer runs against actual clock time, including when the app is closed. Answers remain on this browser unless your own backup system includes this new key.</p>'+
'<button class="gold-button" id="barStartQ">Start timed questions · 24 min</button> <button class="button secondary" id="barStartP">Start written performance tasks · 90 min</button></section>'+
(hasActive?'<div class="review-item"><h3>Unfinished session</h3><p>Resume the saved '+esc(state.mode)+' session. A finished deadline will automatically submit when you open it.</p><button class="gold-button" id="barResume">Resume session</button></div>':'')+
'<div class="review-item"><h3>Attempt history</h3>'+(done?state.history.slice(-8).reverse().map(x=>'<p>'+esc(new Date(x.at).toLocaleString())+' · '+esc(x.mode)+(x.score===null?' · writing submitted for self-review':' · '+x.score+'% ('+x.correct+'/'+x.total+')')+'</p>').join(''):'<p>No completed practice sessions yet.</p>')+'</div><button class="button secondary" id="barExit">Back to exams</button>');
document.querySelector('#barStartQ').onclick=()=>{if(hasActive&&!confirm('Start over? Your unfinished practice answers will be replaced.'))return;start('questions')};
document.querySelector('#barStartP').onclick=()=>{if(hasActive&&!confirm('Start over? Your unfinished practice answers will be replaced.'))return;start('performance')};
if(hasActive)document.querySelector('#barResume').onclick=draw;
document.querySelector('#barExit').onclick=back;
}
function draw(){
state=read();if(!state.mode)return home();if(state.submitted)return results();if(!ensureLive())return;
if(state.mode==='questions')questions();else performance();
}
function timer(){
if(state.deadline===null)return;
const el=document.querySelector('#barClock');if(el)el.textContent=clockText(remaining());
interval=setInterval(()=>{const e=document.querySelector('#barClock');if(!e){stopTimer();return}e.textContent=clockText(remaining());if(remaining()===0){stopTimer();submit(true)}},1000);
}
function questions(){
const q=bank().questions;
layout('<div class="pagehead"><span class="gold-label">FORMATIVE MULTIPLE CHOICE</span><h1>Timed mixed-subject exam</h1><p>Remaining: <strong id="barClock"></strong> · '+Object.keys(state.answers).length+'/'+q.length+' answered. You may change answers before submission.</p></div>'+
q.map((x,i)=>'<div class="review-item"><span class="gold-label">'+(i+1)+' / '+q.length+' · '+esc(x.subject)+'</span><p>'+esc(x.facts)+'</p><h3>'+esc(x.question)+'</h3><div role="group" aria-label="Question '+(i+1)+' answers">'+x.options.map((o,j)=>'<label style="display:block;margin:10px 0;padding:8px 0"><input type="radio" name="bar-'+i+'" value="'+j+'" '+(state.answers[x.id]===j?'checked':'')+'> '+esc(o)+'</label>').join('')+'</div></div>').join('')+
'<p id="barSaveStatus" role="status">Answers save on this device.</p><button class="gold-button" id="barSubmit">Submit and review</button> <button class="button secondary" id="barPause">Save and leave</button>');
q.forEach((x,i)=>document.querySelectorAll('input[name="bar-'+i+'"]').forEach(r=>r.onchange=()=>{state.answers[x.id]=Number(r.value);document.querySelector('#barSaveStatus').textContent=persist()?'Answer saved locally.':'Saving failed — keep this page open and copy any work.'}));
document.querySelector('#barSubmit').onclick=()=>{if(confirm('Submit the answers now? Unanswered questions count as incorrect.'))submit(false)};
document.querySelector('#barPause').onclick=home;timer();
}
function performance(){
const t=bank().tasks;
layout('<div class="pagehead"><span class="gold-label">WRITTEN PERFORMANCE · ORIGINAL TASKS</span><h1>Legal analysis and client advice</h1><p>Remaining: <strong id="barClock"></strong>. Write your own answers before viewing the scoring guide. No automated professional grading.</p></div>'+
t.map((x,i)=>'<section class="review-item"><span class="gold-label">TASK '+(i+1)+' · SUGGESTED '+x.minutes+' MIN</span><h2>'+esc(x.title)+'</h2><h3>File</h3><p>'+esc(x.file)+'</p><h3>Provided law library</h3><p>'+esc(x.library)+'</p><h3>Assignment</h3><p>'+esc(x.request)+'</p><label for="barDraft'+i+'">Your written legal memorandum</label><textarea id="barDraft'+i+'" class="writing-field" rows="14">'+esc(state.drafts[x.id]||'')+'</textarea><p id="barCount'+i+'"></p></section>').join('')+
'<p id="barSaveStatus" role="status">Drafts save locally as you type.</p><button class="gold-button" id="barSubmit">Submit writing for self-review</button> <button class="button secondary" id="barPause">Save and leave</button>');
t.forEach((x,i)=>{const el=document.querySelector('#barDraft'+i),count=document.querySelector('#barCount'+i);const wordCount=()=>el.value.trim()?el.value.trim().split(/\s+/).length:0;const update=()=>{state.drafts[x.id]=el.value;count.textContent=wordCount()+' words';document.querySelector('#barSaveStatus').textContent=persist()?'Draft saved on this device.':'Save failed. Copy your answer before leaving.'};el.addEventListener('input',update);count.textContent=wordCount()+' words'});
document.querySelector('#barSubmit').onclick=()=>{if(confirm('Finish writing and view the self-assessment rubric?'))submit(false)};
document.querySelector('#barPause').onclick=home;timer();
}
function submit(expired){
if(state.submitted)return results();stopTimer();
const questions=bank().questions,valid=state.mode==='questions';
const correct=valid?questions.filter(q=>state.answers[q.id]===q.answer).length:null;
const record={at:new Date().toISOString(),mode:state.mode,expired:!!expired,score:valid?Math.round(100*correct/questions.length):null,correct,total:valid?questions.length:null};
state.history=Array.isArray(state.history)?state.history:[];state.history.push(record);state.history=state.history.slice(-40);state.submitted=true;persist();results();
}
function results(){
const q=bank().questions,t=bank().tasks,writing=state.mode==='performance';
let body='';
if(writing){
body='<div class="feature-card"><h2>Writing saved — not professionally scored</h2><p>Use the criteria below to assess each draft. A qualified examiner must review reasoning and law before mastery can be claimed.</p></div>'+t.map((x,i)=>'<div class="review-item"><h3>'+esc(x.title)+'</h3><p>Your response: '+(state.drafts[x.id]||'').trim().split(/\s+/).filter(Boolean).length+' words.</p>'+x.rubric.map(([label,n])=>'<p><strong>'+esc(label)+'</strong> · '+n+' points</p>').join('')+'<p>Review: Are sources and elements identified? Does each contested fact link to a rule? Have you analyzed opposing arguments, uncertainty, and realistic client choices?</p><textarea class="writing-field" rows="7" readonly>'+esc(state.drafts[x.id]||'')+'</textarea></div>').join('');
}else{
const correct=q.filter(x=>state.answers[x.id]===x.answer).length,score=Math.round(100*correct/q.length);
const bySubject=[...new Set(q.map(x=>x.subject))].map(subject=>{const qs=q.filter(x=>x.subject===subject),ok=qs.filter(x=>state.answers[x.id]===x.answer).length;return {subject,ok,total:qs.length}});
body='<div class="feature-card"><h2>'+score+'% · '+correct+'/'+q.length+' correct</h2><p>Formative score only — this small original bank cannot establish bar readiness.</p><h3>Subject-level review</h3>'+bySubject.map(s=>'<p>'+esc(s.subject)+': '+s.ok+'/'+s.total+(s.ok<s.total?' · revisit this subject':'')+'</p>').join('')+'</div>'+
q.map((x,i)=>'<div class="review-item"><span class="gold-label">'+(state.answers[x.id]===x.answer?'CORRECT':'REVIEW')+' · '+esc(x.subject)+'</span><h3>'+esc(x.question)+'</h3><p>Your answer: '+(state.answers[x.id]===undefined?'Not answered':esc(x.options[state.answers[x.id]]))+'</p><p>Correct answer: '+esc(x.options[x.answer])+'</p><p>'+esc(x.explanation)+'</p></div>').join('');
}
layout('<div class="pagehead"><span class="gold-label">PRACTICE REVIEW</span><h1>Session completed</h1><p>'+((state.history.at(-1)||{}).expired?'Time expired; responses were submitted automatically.':'Responses submitted.')+'</p></div>'+body+'<button class="gold-button" id="barNew">New practice session</button> <button class="button secondary" id="barExit">Back to exams</button>');
document.querySelector('#barNew').onclick=()=>{state.mode=null;state.submitted=false;persist();home()};document.querySelector('#barExit').onclick=back;
}
window.renderBarSimulator=home;
})();
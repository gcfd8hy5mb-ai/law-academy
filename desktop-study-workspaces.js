/* Per-lesson legal study files. Storage is independent from academy grades and Firebase.
 * Legacy single-brief key is preserved verbatim, not silently reassigned to a lesson. */
(()=>{'use strict';
const KEY='law-academy-desktop-workspaces-v2';
const LEGACY='law-academy-desktop-brief-v1';
const ids=['law-case-title','law-field-facts','law-field-issue','law-field-rule','law-field-holding','law-field-reasoning','law-notes'];
const labels=['Case title / citation','Material facts','Legal issue','Rule','Holding','Reasoning / counterarguments','Personal study notes'];
let activeKey='general',activeLabel='General study',pending=false,locked=false;
const $=id=>document.getElementById(id);
const context=()=>document.getElementById('law-lesson-context');
const view=()=>Object.fromEntries(ids.map((id,i)=>[id,$(id)?.value||'']));
const fill=obj=>{locked=true;for(const id of ids){const e=$(id);if(e)e.value=typeof obj?.[id]==='string'?obj[id]:''}locked=false};
const load=()=>{try{const obj=JSON.parse(localStorage.getItem(KEY)||'{}');return obj&&obj.version===2&&obj.entries&&!Array.isArray(obj.entries)&&typeof obj.entries==='object'?obj:{version:2,entries:{}}}catch{return {version:2,entries:{}}}};
function save(){
 if(locked)return false;
 const state=load();state.entries[activeKey]={...view(),label:activeLabel,updatedAt:new Date().toISOString()};
 try{localStorage.setItem(KEY,JSON.stringify(state));pending=false;return true}catch{return false}
}
function note(message){const e=$('law-notes-status');const b=$('law-brief-status');if(e)e.textContent=message;if(b)b.textContent=message}
function refresh(){
 const state=load(),entry=state.entries[activeKey];
 fill(entry||{});note(entry?'Loaded saved notes for '+activeLabel+'.':'New study workspace for '+activeLabel+'.');
 const picker=$('law-study-picker');if(picker){
  picker.textContent='';
  const add=(key,label)=>{const opt=document.createElement('option');opt.value=key;opt.textContent=label;picker.appendChild(opt)};
  add(activeKey,activeLabel);
  Object.entries(state.entries).filter(([k])=>k!==activeKey).sort((a,b)=>(b[1]?.updatedAt||'').localeCompare(a[1]?.updatedAt||'')).forEach(([k,v])=>add(k,v?.label||k));
  picker.value=activeKey;
 }
}
function switchTo(key,label){
 if(key===activeKey){if(context())context().textContent='Current workspace: '+activeLabel;return}
 if(pending&&!save()){note('Unable to save the current draft. Copy your work before switching lessons.');return}
 activeKey=key;activeLabel=label;refresh();if(context())context().textContent='Current workspace: '+label;
}
function setup(){
 const panel=$('law-desktop-workspace');if(!panel||panel.querySelector('#law-study-picker'))return;
 const bar=document.createElement('div');bar.className='law-study-switcher';
 const text=document.createElement('label');text.setAttribute('for','law-study-picker');text.textContent='Saved study workspaces';
 const select=document.createElement('select');select.id='law-study-picker';select.setAttribute('aria-label','Select saved study workspace');
 bar.append(text,select);
 const top=panel.querySelector('.law-work-tabs');top?.insertAdjacentElement('beforebegin',bar);
 const legacy=document.createElement('div');legacy.className='law-legacy-work';
 const button=document.createElement('button');button.type='button';button.textContent='Open earlier unsorted draft';button.id='law-legacy-open';
 const explanation=document.createElement('p');explanation.textContent='Older notes remain stored separately. Opening them will not erase your lesson workspaces.';
 legacy.append(button,explanation);panel.querySelector('[data-law-section="documents"] .law-work-panel')?.append(legacy);
 button.onclick=()=>{
  const raw=localStorage.getItem(LEGACY);if(!raw){note('No earlier unsorted draft found.');return}
  let old;try{old=JSON.parse(raw)}catch{note('Older draft could not be read. Original remains untouched.');return}
  if(!old||typeof old!=='object'){note('Older draft format is not supported.');return}
  if(pending&&!save()){note('Save current work before opening earlier draft.');return}
  activeKey='legacy-copy';activeLabel='Earlier unsorted draft';
  const existing=load().entries[activeKey];if(existing){refresh()}else{
   const val={ 'law-case-title':old.caseTitle,'law-field-facts':old.facts,'law-field-issue':old.issue,'law-field-rule':old.rule,'law-field-holding':old.holding,'law-field-reasoning':old.reasoning,'law-notes':old.notes };
   fill(val);pending=true;note('Older draft loaded as an unsaved copy. Save to keep it in this workspace library.');
  }
  if(context())context().textContent='Earlier unsorted draft — original retained';
 };
 select.onchange=()=>{const key=select.value;const data=load().entries[key];switchTo(key,data?.label||'General study')};
 for(const id of ids){$(id)?.addEventListener('input',()=>{if(locked)return;pending=true;note('Unsaved changes — choose Save to store them in this browser.')})}
 const saveBrief=$('law-save-brief'),saveNotes=$('law-save-notes');
 if(saveBrief)saveBrief.onclick=()=>note(save()?'Saved to '+activeLabel+' on this browser.':'Save failed; export or copy before leaving.');
 if(saveNotes)saveNotes.onclick=()=>note(save()?'Saved to '+activeLabel+' on this browser.':'Save failed; export or copy before leaving.');
 const exporter=$('law-export-work');
 if(exporter)exporter.onclick=()=>{
  if(pending&&!save()){note('Save failed. Copy your work manually first.');return}
  const snapshot=load(),txt=['LAW ACADEMY — LOCAL STUDY WORKSPACE BACKUP','NOT CLOUD SYNCED; store this file securely.',...Object.entries(snapshot.entries).map(([k,v])=>'\n### '+(v.label||k)+'\n'+ids.map((id,i)=>labels[i]+'\n'+(v[id]||'')).join('\n\n'))].join('\n');
  const blob=new Blob([txt],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='law-academy-all-study-workspaces.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 };
 addEventListener('lawacademy:lesson',event=>{
  const id=String(event.detail?.id||'').trim(),title=String(event.detail?.title||'').trim(),course=String(event.detail?.course||'').trim();
  if(!title)return;
  // Only a stable real lesson ID establishes a new storage namespace.
  if(!id){if(context())context().textContent='Current reading: '+title+' — select a saved study workspace';return}
  switchTo('lesson:'+id,(course?course+' / ':'')+title);
 });
 // If a student was already reading when this script initialized, derive the lesson only when it is verified in the live course catalog.
 if(typeof active!=='undefined'&&active?.id&&typeof COURSES!=='undefined'){
  const course=COURSES.find(c=>c.lessons?.some(l=>l.id===active.id));
  if(course)switchTo('lesson:'+active.id,course.title+' / '+active.title);
 }
 refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();

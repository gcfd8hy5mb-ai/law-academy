/* Approved law-school desktop interior pages. No curriculum or student data writes. */
(()=>{'use strict';const app=document.getElementById('app');if(!app)return;
const desktop=()=>matchMedia('(min-width:960px)').matches;
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pathTo=(fn)=>{if(typeof fn==='function')fn()};
function identity(shell){
 const head=shell.querySelector('.pagehead');const title=head?.querySelector('h1')?.textContent?.trim()||'';
 if(!title)return null;
 if(/^Courses$/i.test(title))return 'catalog';
 if(/^Practice Exams$/i.test(title))return 'exams';
 if(/^My Progress$/i.test(title))return 'progress';
 if(/^Case Studies & Writing$/i.test(title))return 'cases';
 if(/^Legal Library$/i.test(title))return 'library';
 if(/^More$/i.test(title))return 'more';
 if(/^Settings$/i.test(title))return 'settings';
 if(/(coursework|practice|course|capstone|exam|case|writing|study guide|legal|progress|law|oral|simulation)/i.test(title))return 'academic';
 return 'academic';
}
function createQuickLinks(kind){
 const row=document.createElement('nav');row.className='law-interior-shortcuts';row.setAttribute('aria-label','Academic workspaces');
 const links=[['Courses','courses'],['Case Studies','cases'],['Examinations','exams'],['Progress','progress']];
 for(const [name,id] of links){const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.lawDestination=id;if(id===kind)b.classList.add('is-current');b.onclick=()=>go(id);row.append(b)}
 return row;
}
function go(id){if(id==='courses')pathTo(typeof renderCatalog==='function'?renderCatalog:null);if(id==='cases')pathTo(typeof writingHome==='function'?writingHome:null);if(id==='exams')pathTo(typeof renderExams==='function'?renderExams:null);if(id==='progress')pathTo(typeof renderProgress==='function'?renderProgress:null)}
function statistics(kind){
 let entries=[];
 if(kind==='catalog'&&typeof COURSES!=='undefined'&&Array.isArray(COURSES)){
  const courses=COURSES.filter(c=>c.lessons?.length),lessons=courses.flatMap(c=>c.lessons||[]);
  const done=typeof completed!=='undefined'?lessons.filter(l=>completed[l.id]).length:0;
  entries=[['Available courses',courses.length],['Authored lessons',lessons.length],['Your completed checks',done]];
 }else if(kind==='exams'&&typeof COURSES!=='undefined'&&typeof examResults!=='undefined'){
  const available=COURSES.filter(c=>c.lessons?.length);entries=[['Course exams',available.length],['Exams attempted',available.filter(c=>examResults[c.id]).length],['Best scores at 80%+',available.filter(c=>Number(examResults[c.id]?.best)>=80).length]];
 }else if(kind==='cases'&&typeof WRITING_TASKS!=='undefined'&&typeof writingDrafts!=='undefined'){
  entries=[['Writing assignments',WRITING_TASKS.length],['Drafts started',WRITING_TASKS.filter(t=>String(writingDrafts[t.id]||'').trim()).length],['Research focus','Primary sources']];
 }
 if(!entries.length)return null;
 const board=document.createElement('section');board.className='law-interior-stats';board.setAttribute('aria-label','Current academic data');
 for(const [name,value] of entries){const tile=document.createElement('div');tile.className='law-interior-stat';tile.innerHTML='<span>'+safe(name)+'</span><strong>'+safe(value)+'</strong>';board.append(tile)}
 return board;
}
function decorate(){
 if(!desktop())return;
 const shell=app.querySelector('.shell');if(!shell)return;
 const pageHead=shell.querySelector('.pagehead'),isCourseDetail=!pageHead&&!!shell.querySelector('[data-lesson]'),isReader=!!shell.querySelector('.reading');
 if(!pageHead&&!isCourseDetail&&!isReader)return;
 if(shell.dataset.lawInteriorEnhanced)return;
 const kind=pageHead?identity(shell):isCourseDetail?'course-detail':'academic';
 shell.dataset.lawInteriorEnhanced=kind||'academic';
 shell.classList.add('law-interior-page');
 if(pageHead){pageHead.classList.add('law-interior-heading');
   const labels={catalog:'ACADEMIC PROGRAM',exams:'EXAMINATION HALL',cases:'LEGAL CASE STUDIES',progress:'STUDENT RECORD',library:'LAW LIBRARY',more:'ACADEMY SERVICES',settings:'STUDENT SETTINGS',academic:'LAW ACADEMY'};
   const upper=document.createElement('div');upper.className='law-interior-kicker';upper.textContent=labels[kind]||'LAW ACADEMY';pageHead.prepend(upper);
   pageHead.insertAdjacentElement('afterend',createQuickLinks(kind));
   const stats=statistics(kind);if(stats)pageHead.insertAdjacentElement('afterend',stats);
 }
 if(isCourseDetail){
  const back=shell.querySelector('#back');if(back){
    const bar=document.createElement('div');bar.className='law-detail-bar';bar.innerHTML='<span>THE LAW ACADEMY · COURSE READER</span><span>Readings &amp; lessons</span>';back.insertAdjacentElement('afterend',bar)
  }
  const lessons=[...shell.querySelectorAll('[data-lesson]')];
  if(lessons.length){const note=document.createElement('p');note.className='law-detail-count';note.textContent=lessons.length+' authored lessons in this course · select one to open the textbook reader';lessons[0].before(note)}
 }
}
function sidebar(){
 const nav=app.querySelector('.bottom-nav');if(!nav)return;
 for(const [id,name,mark] of [['cases','Case Studies','✎'],['progress','My Progress','◴']]){
  if(nav.querySelector('[data-law-interior-nav="'+id+'"]'))continue;
  const b=document.createElement('button');b.type='button';b.className='navitem law-interior-nav';b.dataset.lawInteriorNav=id;
  b.innerHTML='<span aria-hidden="true">'+mark+'</span><small>'+name+'</small>';b.onclick=()=>go(id);
  const more=nav.querySelector('[data-nav="more"]');more?nav.insertBefore(b,more):nav.append(b);
 }
 const kind=app.querySelector('.shell')?.dataset.lawInteriorEnhanced||'';
 nav.querySelectorAll('[data-law-interior-nav]').forEach(b=>{b.classList.toggle('on',b.dataset.lawInteriorNav===kind)});
}
let scheduled=false;
function run(){decorate();sidebar()}
new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;run()})}).observe(app,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
addEventListener('resize',run);
})();

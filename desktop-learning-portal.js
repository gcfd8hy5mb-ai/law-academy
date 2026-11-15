/* Preview-aligned desktop home/course/lesson enhancements. Underlying academy navigation and storage remain authoritative. */
(()=>{'use strict';
const desktop=()=>window.matchMedia('(min-width:960px)').matches;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const app=document.getElementById('app');if(!app)return;
function decorateHome(shell){
 if(shell.querySelector('.law-dash-intro'))return;
 const hero=shell.querySelector('.court-hero');if(!hero)return;
 const motto=hero.querySelector('.hero-copy');if(motto)motto.textContent='A comprehensive legal education — courses, cases, research, and practice.';
 const tag=document.createElement('p');tag.className='law-dash-intro';tag.textContent='THE LAW ACADEMY';hero.insertBefore(tag,hero.firstChild);
 const title=document.createElement('h2');title.className='law-dash-title';title.textContent='Continue Your Legal Education';hero.append(title);
 const progress=shell.querySelector('.progress-panel');if(progress){progress.classList.add('law-dash-progress');const percent=progress.querySelector('.ring > span')?.textContent||'—';const summary=document.createElement('div');summary.className='law-dash-metrics';const nums=typeof getProgress==='function'?getProgress():null;summary.innerHTML='<div><small>Progress</small><strong>'+esc(percent)+'</strong></div><div><small>Lessons completed</small><strong>'+esc(nums?.done??'—')+' / '+esc(nums?.total??'—')+'</strong></div>';progress.append(summary)}
 const grid=shell.querySelector('.quick-grid');if(!grid)return;
 const section=document.createElement('section');section.className='law-course-gallery';
 section.innerHTML='<div class="law-gallery-heading"><h3>Your Courses</h3><button type="button" id="law-gallery-all">View All Courses →</button></div><div class="law-gallery-cards"></div>';
 grid.parentNode.insertBefore(section,grid);
 const list=section.querySelector('.law-gallery-cards');
 if(typeof COURSES!=='undefined'&&Array.isArray(COURSES)){
  const available=COURSES.filter(c=>Array.isArray(c.lessons)&&c.lessons.length);
  available.slice(0,6).forEach((c,i)=>{
   const done=c.lessons.filter(l=>typeof completed!=='undefined'&&completed[l.id]).length;const pct=Math.round(100*done/c.lessons.length);
   const b=document.createElement('button');b.type='button';b.className='law-gallery-card';
   b.innerHTML='<span class="law-gallery-art law-art-'+(i%6)+'" aria-hidden="true">'+['⚖','§','▣','☷','◈','✦'][i%6]+'</span><span class="law-gallery-name">'+esc(c.title)+'</span><span class="law-gallery-track"><span style="width:'+pct+'%"></span></span><small>'+done+' / '+c.lessons.length+' lessons</small>';
   b.onclick=()=>{if(typeof renderCourse==='function')renderCourse(c);else document.getElementById('allCourses')?.click()};list.append(b);
  });
 } else {list.textContent='Open My Courses to browse your available lessons.'}
 section.querySelector('#law-gallery-all').onclick=()=>document.getElementById('allCourses')?.click();
 const feature=shell.querySelector('.feature-card');if(feature)feature.classList.add('law-dash-feature');
}
function decorateLesson(shell){
 if(shell.querySelector('.law-reader-toolbar'))return;
 const reading=shell.querySelector('.reading');if(!reading)return;
 shell.classList.add('law-reader-shell');
 const lessonHeading=shell.querySelector('h2')?.textContent?.trim()||'';
 if(lessonHeading){const id=typeof active!=='undefined'&&active?.id?String(active.id):'';const course=typeof COURSES!=='undefined'&&Array.isArray(COURSES)?COURSES.find(c=>c.lessons?.some(l=>l.id===id)):null;window.dispatchEvent(new CustomEvent('lawacademy:lesson',{detail:{id,title:lessonHeading,course:course?.title||''}}))}
 const title=shell.querySelector('h2');if(!title)return;
 const toolbar=document.createElement('nav');toolbar.className='law-reader-toolbar';toolbar.setAttribute('aria-label','Lesson navigation');
 toolbar.innerHTML='<button type="button" class="law-reader-tab is-active" data-reader-target="lesson">Lesson</button><button type="button" class="law-reader-tab" data-reader-target="case">Case Materials</button><button type="button" class="law-reader-tab" data-reader-target="analysis">Analysis</button><button type="button" class="law-reader-tab" data-reader-target="check">Knowledge Check</button>';
 title.insertAdjacentElement('afterend',toolbar);
 const facts=reading.querySelector('h3');
 const overview=document.createElement('aside');overview.className='law-case-glance';overview.innerHTML='<strong>Reading Guide</strong><p>Identify the relevant facts, legal issue, governing rule, and reasoning. Save your analysis in the Legal Workspace.</p><button type="button" class="law-reader-workspace-open">Open Case Brief →</button>';reading.insertBefore(overview,facts);
 overview.querySelector('button').onclick=()=>document.getElementById('law-desk-launch')?.click();
 toolbar.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{
  toolbar.querySelectorAll('button').forEach(x=>x.classList.toggle('is-active',x===btn));
  const k=btn.dataset.readerTarget;
  if(k==='check'){shell.querySelector('.question')?.scrollIntoView({behavior:'smooth',block:'center'});return}
  if(k==='case'){(reading.querySelector('h3:nth-of-type(2)')||reading.querySelector('h3'))?.scrollIntoView({behavior:'smooth',block:'start'});return}
  if(k==='analysis'){(reading.querySelector('h3:last-of-type')||reading)?.scrollIntoView({behavior:'smooth',block:'start'});return}
  title.scrollIntoView({behavior:'smooth',block:'start'});
 });
}
function decorate(){if(!desktop())return;const shell=app.querySelector('.shell');if(!shell)return;if(!app.querySelector('.bottom-nav')&&typeof nav==='function'&&typeof bindNav==='function'){app.insertAdjacentHTML('beforeend',nav(shell.querySelector('.reading')?'courses':'home'));bindNav()}const home=shell.querySelector('.court-hero');if(home)decorateHome(shell);else if(shell.querySelector('.reading'))decorateLesson(shell)}
let busy=false;const obs=new MutationObserver(()=>{if(busy)return;busy=true;queueMicrotask(()=>{try{decorate()}finally{busy=false}})});obs.observe(app,{childList:true,subtree:false});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();window.addEventListener('resize',decorate);
})();

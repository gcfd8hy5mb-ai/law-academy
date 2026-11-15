/* Chapter-outline navigation for classic desktop lessons. Works against existing authored headings only. */
(()=>{'use strict';const app=document.getElementById('app');if(!app)return;
function decorate(){
 if(!matchMedia('(min-width:960px)').matches)return;
 const shell=app.querySelector('.law-reader-shell'),reading=shell?.querySelector('.reading');
 if(!reading||shell.querySelector('.law-chapter-outline'))return;
 const headings=[...reading.querySelectorAll('h3')];if(!headings.length)return;
 const nav=document.createElement('nav');nav.className='law-chapter-outline';nav.setAttribute('aria-label','Chapter section navigation');
 const title=document.createElement('strong');title.textContent='In this lesson';nav.append(title);
 const items=document.createElement('div');items.className='law-chapter-links';
 headings.forEach((h,i)=>{
  h.id='law-lesson-section-'+i;
  const button=document.createElement('button');button.type='button';button.textContent=h.textContent;button.onclick=()=>h.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});items.append(button);
 });
 nav.append(items);
 const readingStart=shell.querySelector('.law-reader-brief-note')||shell.querySelector('.law-reader-toolbar');
 if(readingStart)readingStart.insertAdjacentElement('afterend',nav);else reading.before(nav);
 const foot=document.createElement('div');foot.className='law-chapter-pager';
 const activeId=typeof active!=='undefined'&&active?.id?active.id:null;
 const course=typeof COURSES!=='undefined'&&activeId?COURSES.find(c=>c.lessons?.some(l=>l.id===activeId)):null;
 const index=course?.lessons.findIndex(l=>l.id===activeId)??-1;
 if(course&&index>=0){
  for(const [label,target] of [['← Previous lesson',course.lessons[index-1]],['Next lesson →',course.lessons[index+1]]]){
   if(!target)continue;const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{if(typeof renderLesson==='function')renderLesson(course,target)};foot.append(b);
  }
 }
 const more=document.createElement('button');more.type='button';more.textContent='Back to chapter outline ↑';more.onclick=()=>nav.scrollIntoView({behavior:'smooth',block:'start'});foot.append(more);
 reading.insertAdjacentElement('afterend',foot);
}
let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;queueMicrotask(()=>{busy=false;decorate()})}).observe(app,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();
window.addEventListener('resize',decorate);
})();

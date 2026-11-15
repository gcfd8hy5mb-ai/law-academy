/* Make the approved case-reading layout part of the desktop homepage, with real student/course data. */
(()=>{'use strict';
 const app=document.getElementById('app');if(!app)return;
 const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function update(){
  if(!matchMedia('(min-width:960px)').matches)return;
  const main=app.querySelector('.app-shell');if(!main||!main.querySelector('.law-course-gallery')||main.querySelector('.law-lesson-preview'))return;
  const ready=typeof COURSES!=='undefined'&&Array.isArray(COURSES);
  if(!ready)return;
  const course=COURSES.find(c=>Array.isArray(c.lessons)&&c.lessons.some(l=>!completed?.[l.id]))||COURSES.find(c=>c.lessons?.length);
  const lesson=course?.lessons?.find(l=>!completed?.[l.id])||course?.lessons?.[0];if(!lesson)return;
  const sections=Array.isArray(lesson.sections)?lesson.sections.slice(0,3):[];
  const preview=document.createElement('section');preview.className='law-lesson-preview';preview.setAttribute('aria-label','Current lesson reading preview');
  preview.innerHTML='<div class="law-preview-path">My Courses　›　'+html(course.title)+'　›　Current Lesson</div>'+
   '<p class="law-preview-kicker">CONTINUE READING · '+html(course.level||'LAW ACADEMY')+'</p>'+
   '<h3 class="law-preview-title">'+html(lesson.title)+'</h3>'+
   '<p class="law-preview-subtitle">Legal reasoning, case analysis, and source-based study</p>'+
   '<div class="law-preview-tabs"><span>Lesson</span><span>Case Materials</span><span>Analysis</span><span>Related Readings</span></div>'+
   '<div class="law-preview-body"><aside class="law-preview-facts"><strong>At a Glance</strong>Learning objectives: understand the governing rule, material facts, application, and competing arguments.<p>Open the full lesson for complete reading and assessments.</p></aside>'+
   sections.map(([title,paragraph],i)=>'<h4>'+html((i+1)+'. '+title)+'</h4><p>'+html(String(paragraph).slice(0,i===0?650:330))+(String(paragraph).length>(i===0?650:330)?'…':'')+'</p>').join('')+
   '<div class="law-preview-actions"><button type="button" id="law-open-preview-lesson">Open full lesson</button><small>Progress is recorded only by the academy learning system.</small></div></div>';
  const gallery=main.querySelector('.law-course-gallery');gallery.insertAdjacentElement('afterend',preview);
  preview.querySelector('#law-open-preview-lesson').onclick=()=>{
   if(typeof renderLesson==='function')renderLesson(course,lesson);
   else document.getElementById('resume')?.click()
  };
 }
 let queued=false;const obs=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;update()})});obs.observe(app,{childList:true,subtree:false});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();
 window.addEventListener('resize',update);
})();

/* Make desktop case workspace accessible while keeping its original data storage isolated. */
(()=>{'use strict';const app=document.getElementById('app');if(!app)return;
const desktop=()=>matchMedia('(min-width:960px)').matches;
function decorate(){
 if(!desktop())return;
 const shell=app.querySelector('.shell');if(!shell)return;
 const sidebar=app.querySelector('.bottom-nav');
 if(sidebar && !sidebar.querySelector('[data-law-desktop-research]')){
  // An additive link to the existing research desk; never replaces the academy's navigation.
  const b=document.createElement('button');b.type='button';b.className='navitem law-desktop-research-link';
  b.dataset.lawDesktopResearch='1';b.innerHTML='<span aria-hidden="true">⌕</span><small>Legal Research</small>';
  b.onclick=()=>{const desk=document.getElementById('law-desktop-workspace');const tab=desk?.querySelector('[data-law-tab="research"]');if(tab){tab.click();if(matchMedia('(max-width:1399px)').matches)document.getElementById('law-desk-launch')?.click();else desk.scrollTo({top:0,behavior:'smooth'});tab.focus()}};
  const more=sidebar.querySelector('[data-nav="more"]');if(more)sidebar.insertBefore(b,more);else sidebar.append(b);
 }
 const lesson=shell.querySelector('.law-reader-shell')||shell.classList.contains('law-reader-shell')&&shell;
 if(lesson&&!lesson.querySelector('.law-reader-brief-note')){
  const bar=lesson.querySelector('.law-reader-toolbar');
  if(bar){const note=document.createElement('p');note.className='law-reader-brief-note';note.textContent='Read the lesson first. Use the Legal Workspace to organize case facts, authorities, and analysis; your grades and lesson progress remain in the Academy.';bar.insertAdjacentElement('afterend',note)}
 }
}
let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;decorate()})}).observe(app,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else decorate();
addEventListener('resize',decorate);
})();

/* Desktop wordmark, separate lines to prevent subtitle clipping. No mobile or curriculum changes. */
(()=>{'use strict';const root=document.getElementById('app');if(!root)return;
function update(){
 if(!matchMedia('(min-width:1180px)').matches)return;
 const sidebar=root.querySelector('.bottom-nav');if(!sidebar||sidebar.querySelector('.law-sidebar-brand'))return;
 const brand=document.createElement('div');brand.className='law-sidebar-brand';brand.setAttribute('aria-label','Law Academy — The Legal Education and Research Institute');
 brand.innerHTML='<span class="law-sidebar-emblem" aria-hidden="true">⚖</span><span class="law-sidebar-name">LAW<br>ACADEMY</span><span class="law-sidebar-rule" aria-hidden="true"></span><span class="law-sidebar-subtitle">THE LEGAL EDUCATION<br>&amp; RESEARCH INSTITUTE</span>';
 sidebar.prepend(brand);
}
let pending=false;const observer=new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;update()})});observer.observe(root,{childList:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();window.addEventListener('resize',update);
})();

/* Desktop workspace reliability: local autosave, restored drafts, and session feedback. */
(()=>{'use strict';
function init(){
 const layer=document.getElementById('academy-desktop-workspace');
 if(!layer||layer.dataset.reliabilityReady)return;
 layer.dataset.reliabilityReady='1';
 const fieldList=[...layer.querySelectorAll('.desk-panel:first-child input[id^="desk-"],.desk-panel:first-child textarea[id^="desk-"]')].filter(e=>e.id!=='desk-command');
 if(!fieldList.length)return;
 const kind=layer.querySelector('#desk-brief')?'law':'business';
 const key='academy-desktop-draft-'+kind+'-v1';
 const status=layer.querySelector('#desk-status');
 let pending=false;
 function save(){const data={};for(const el of fieldList)data[el.id.slice(5)]=el.value;try{localStorage.setItem(key,JSON.stringify(data));pending=false;if(status)status.textContent='Saved automatically on this device.';return true}catch{if(status)status.textContent='Autosave unavailable. Export your notes to avoid losing changes.';return false}}
 fieldList.forEach(el=>el.addEventListener('input',()=>{pending=true;if(status)status.textContent='Unsaved edits — select Save or leave the field to autosave.'}));
 fieldList.forEach(el=>el.addEventListener('change',save));
 layer.querySelector('#desk-close')?.addEventListener('click',()=>{if(pending)save()});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&pending)save()});
 const chip=document.createElement('p');chip.className='desk-storage-notice';chip.textContent='Drafts are private to this browser and device. Export a copy before switching devices.';layer.querySelector('.desk-panel:first-child')?.append(chip);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
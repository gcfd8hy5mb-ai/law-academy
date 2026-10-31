/* Portable draft backup: explicit JSON export/import for desktop workspace. */
(()=>{'use strict';
function init(){
 const panel=document.getElementById('academy-desktop-workspace');
 if(!panel||panel.querySelector('#desk-backup'))return;
 const save=panel.querySelector('#desk-save'), actions=save?.parentElement;
 if(!actions)return;
 const fields=[...panel.querySelectorAll('.desk-panel:first-child input[id^="desk-"],.desk-panel:first-child textarea[id^="desk-"]')].filter(el=>el.id!=='desk-command');
 if(!fields.length)return;
 const kind=panel.querySelector('#desk-brief')?'law':'business';
 const status=panel.querySelector('#desk-status');
 const exportBtn=document.createElement('button');exportBtn.id='desk-backup';exportBtn.type='button';exportBtn.textContent='Export portable backup';
 const importLabel=document.createElement('label');importLabel.htmlFor='desk-import-file';importLabel.textContent='Import portable backup (.json)';
 const file=document.createElement('input');file.id='desk-import-file';file.type='file';file.accept='.json,application/json';file.setAttribute('aria-label','Choose academy draft backup');
 actions.append(exportBtn,importLabel,file);
 const keys=fields.map(x=>x.id.slice(5));
 const key='academy-desktop-draft-'+kind+'-v1';
 function snapshot(){return Object.fromEntries(fields.map(el=>[el.id.slice(5),el.value]));}
 exportBtn.addEventListener('click',()=>{
  const data={format:'academy-workspace-backup',version:1,academy:kind,draft:snapshot()};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=kind+'-academy-draft.json';document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  if(status)status.textContent='Portable backup export requested.';
 });
 file.addEventListener('change',async()=>{
  const selected=file.files?.[0];if(!selected)return;
  try{
   if(selected.size>250000)throw Error('Backup is too large (limit 250 KB).');
   const data=JSON.parse(await selected.text());
   if(data?.format!=='academy-workspace-backup'||data.version!==1||data.academy!==kind||!data.draft||typeof data.draft!=='object'||Array.isArray(data.draft))throw Error('This is not a compatible '+kind+' academy backup.');
   if(keys.some(k=>typeof data.draft[k]!=='string'||data.draft[k].length>100000))throw Error('Backup contains invalid fields.');
   if(!window.confirm('Replace the current '+kind+' workspace draft with this backup?')){if(status)status.textContent='Import cancelled.';return;}
   fields.forEach(el=>{el.value=data.draft[el.id.slice(5)];el.dispatchEvent(new Event('input',{bubbles:true}));});
   localStorage.setItem(key,JSON.stringify(snapshot()));
   if(status)status.textContent='Portable backup imported and saved on this device.';
  }catch(err){if(status)status.textContent='Import failed: '+(err?.message||'Invalid backup.');}finally{file.value='';}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
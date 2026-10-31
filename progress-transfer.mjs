// Portable student progress transfer. No Firebase access or automatic overwrite.
const academy="law", keys=["law-academy-progress-v1","law-academy-exam-results-v1","law-academy-capstone-v1","law-academy-oral-defense-v1","law-academy-final-essays-v1","law-academy-final-review-v1","law-academy-research-capstone-v1","law-academy-rubric-v1","law-academy-writing-v1","law-academy-sim-v1","law-academy-sim-branches-v1","law-academy-reasoning-v1","law-academy-capstone-audit-v1"];
function exportProgress(){
 const records={};for(const key of keys){const raw=localStorage.getItem(key);if(raw!==null)records[key]=raw;}
 const payload={format:'academy-progress-transfer',version:1,academy,exportedAt:new Date().toISOString(),records};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const a=document.createElement('a');const url=URL.createObjectURL(blob);
 a.href=url;a.download=academy+'-progress-transfer.json';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),60000);
 return Object.keys(records).length;
}
function importProgress(file){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onerror=()=>reject(Error('Could not read selected file.'));
  reader.onload=()=>{
   try{
    if(file.size>5000000)throw Error('The selected file is too large.');
    const data=JSON.parse(reader.result);
    if(data?.format!=='academy-progress-transfer'||data.version!==1||data.academy!==academy||!data.records||typeof data.records!=='object'||Array.isArray(data.records))
      throw Error('This is not a valid '+academy+' progress transfer file.');
    const incoming=Object.entries(data.records);
    if(!incoming.length)throw Error('The file contains no progress.');
    for(const [key,raw] of incoming){
     if(!keys.includes(key)||typeof raw!=='string'||raw.length>800000)throw Error('Unexpected record: '+key);
     JSON.parse(raw); // require the application's JSON storage format
     if(localStorage.getItem(key)!==null)throw Error('This browser already has '+key+'. Import refused to avoid overwriting existing progress.');
    }
    if(!confirm('Import '+incoming.length+' saved record(s) into this browser? Current records will not be overwritten.'))return resolve(false);
    const written=[];
    try{
     for(const [key,raw] of incoming){localStorage.setItem(key,raw);written.push(key);}
    }catch(e){for(const key of written)localStorage.removeItem(key);throw e;}
    resolve(true);
   }catch(e){reject(e);}
  };
  reader.readAsText(file);
 });
}
function addTransfer(){
 const btn=document.createElement('button');btn.type='button';btn.textContent='Transfer coursework';
 Object.assign(btn.style,{position:'fixed',left:'12px',bottom:'max(12px, env(safe-area-inset-bottom))',zIndex:'10001',font:'600 12px system-ui',background:'#292d2e',color:'#f7db9f',border:'1px solid #99804c',borderRadius:'12px',padding:'10px 12px'});
 btn.onclick=()=>{
  const action=prompt('Progress transfer: enter 1 to EXPORT a backup, or 2 to IMPORT a backup into an empty browser.');
  if(action==='1'){const count=exportProgress();alert('Exported '+count+' records. Keep the JSON file private.');}
  if(action==='2'){
   const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
   input.onchange=async()=>{if(!input.files?.[0])return;try{const imported=await importProgress(input.files[0]);if(imported){alert('Progress imported successfully. Reloading.');location.reload();}}catch(e){alert('Import stopped: '+e.message);}};
   input.click();
  }
 };
 document.body.appendChild(btn);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addTransfer,{once:true});else addTransfer();

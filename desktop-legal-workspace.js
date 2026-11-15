/* Law Academy approved desktop workspace. Additive UI only: no grade, progress, auth, or curriculum writes. */
(()=>{'use strict';
const mq=window.matchMedia('(min-width:960px)');
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key='law-academy-desktop-brief-v1';
let selected='brief';
const fields=[['facts','Material facts'],['issue','Legal issue'],['rule','Rule'],['holding','Holding'],['reasoning','Reasoning / counterarguments']];
function init(){
 if(document.getElementById('law-desktop-workspace'))return;
 const launch=document.createElement('button');launch.id='law-desk-launch';launch.className='law-desk-launch';launch.type='button';launch.textContent='⚖ Legal Workspace';launch.setAttribute('aria-controls','law-desktop-workspace');launch.setAttribute('aria-expanded','false');
 const panel=document.createElement('aside');panel.id='law-desktop-workspace';panel.className='law-desktop-workspace';panel.setAttribute('aria-label','Legal Workspace');
 panel.innerHTML='<div class="law-work-head"><h2>⚖ Legal Workspace</h2><button id="law-work-close" type="button" aria-label="Close legal workspace">×</button></div><div class="law-work-tabs" role="tablist" aria-label="Workspace sections">'+[['brief','Case Brief'],['notes','Notes'],['research','Research'],['documents','Documents']].map(([k,n])=>'<button type="button" role="tab" data-law-tab="'+k+'" aria-selected="'+(k===selected)+'">'+n+'</button>').join('')+'</div>'+
 '<section class="law-work-section" data-law-section="brief"><label for="law-case-title">Case title / citation</label><input id="law-case-title" placeholder="e.g. Marbury v. Madison (1803)">'+fields.map(([k,n])=>'<label for="law-field-'+k+'">'+n+'</label><textarea id="law-field-'+k+'" placeholder="Write your own '+esc(n.toLowerCase())+'..."></textarea>').join('')+'<div class="law-work-actions"><button type="button" id="law-save-brief">Save case brief</button><button type="button" id="law-copy-brief">Copy brief</button></div><p class="law-work-status" role="status" id="law-brief-status"></p></section>'+
 '<section class="law-work-section" data-law-section="notes" hidden><label for="law-notes">Personal study notes</label><textarea id="law-notes" style="min-height:280px" placeholder="Write your lesson notes here..."></textarea><div class="law-work-actions"><button type="button" id="law-save-notes">Save notes</button><button type="button" id="law-copy-notes">Copy notes</button></div><p class="law-work-status" id="law-notes-status" role="status"></p></section>'+
 '<section class="law-work-section" data-law-section="research" hidden><div class="law-work-panel"><h3>Legal Research</h3><p>Start with primary sources, confirm the controlling jurisdiction, and verify later treatment of every case.</p><ul class="law-work-list"><li><a target="_blank" rel="noopener noreferrer" href="https://www.supremecourt.gov/opinions/opinions.aspx">U.S. Supreme Court opinions</a></li><li><a target="_blank" rel="noopener noreferrer" href="https://constitution.congress.gov/">Constitution Annotated</a></li><li><a target="_blank" rel="noopener noreferrer" href="https://www.govinfo.gov/app/collection/uscode">U.S. Code</a></li><li><a target="_blank" rel="noopener noreferrer" href="https://www.law.cornell.edu/">Legal Information Institute</a></li></ul></div></section>'+
 '<section class="law-work-section" data-law-section="documents" hidden><div class="law-work-panel"><h3>My Documents</h3><p>Your saved case brief and notes stay in this browser unless separately exported. They are not automatically synced to Firebase.</p><div class="law-work-actions"><button id="law-export-work" type="button">Export workspace (.txt)</button></div></div></section>'+
 '<div class="law-work-panel"><h3>Research reminders</h3><p>Check case citations, holdings, court jurisdiction and subsequent treatment against reliable primary sources.</p></div>';
 document.body.append(launch,panel);const $=id=>panel.querySelector('#'+id);
 const storage=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}};
 const data=storage();$('law-case-title').value=data.caseTitle||'';fields.forEach(([k])=>{$('law-field-'+k).value=data[k]||''});$('law-notes').value=data.notes||'';
 function save(){const obj={caseTitle:$('law-case-title').value,notes:$('law-notes').value};fields.forEach(([k])=>obj[k]=$('law-field-'+k).value);try{localStorage.setItem(key,JSON.stringify(obj));return true}catch{return false}}
 function show(tab){selected=tab;panel.querySelectorAll('[data-law-tab]').forEach(el=>{el.setAttribute('aria-selected',String(el.dataset.lawTab===tab))});panel.querySelectorAll('[data-law-section]').forEach(el=>{el.hidden=el.dataset.lawSection!==tab})}
 panel.querySelectorAll('[data-law-tab]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.lawTab)));
 $('law-save-brief').onclick=()=>{$('law-brief-status').textContent=save()?'Brief saved in this browser.':'Save unavailable; copy your work.'};
 $('law-save-notes').onclick=()=>{$('law-notes-status').textContent=save()?'Notes saved in this browser.':'Save unavailable; copy your work.'};
 function briefText(){return 'LAW ACADEMY — CASE BRIEF\n'+$('law-case-title').value+'\n\n'+fields.map(([k,n])=>n+'\n'+$('law-field-'+k).value).join('\n\n')+'\n\nEducational notes; verify authorities independently.'}
 $('law-copy-brief').onclick=()=>{Promise.resolve(navigator.clipboard?.writeText?.(briefText())||Promise.reject(Error('Clipboard unavailable'))).then(()=>{$('law-brief-status').textContent='Copied.'}).catch(()=>{$('law-brief-status').textContent='Copy unavailable; select text manually.'})};
 $('law-copy-notes').onclick=()=>{Promise.resolve(navigator.clipboard?.writeText?.($('law-notes').value)||Promise.reject(Error('Clipboard unavailable'))).then(()=>{$('law-notes-status').textContent='Copied.'}).catch(()=>{$('law-notes-status').textContent='Copy unavailable.'})};
 $('law-export-work').onclick=()=>{save();const blob=new Blob([briefText()+'\n\nPERSONAL NOTES\n'+$('law-notes').value],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='law-academy-workspace.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 function open(){document.body.classList.add('law-desk-open');launch.setAttribute('aria-expanded','true');panel.querySelector('[data-law-tab="'+selected+'"]').focus()}
 function close(){document.body.classList.remove('law-desk-open');launch.setAttribute('aria-expanded','false');launch.focus()}
 launch.onclick=open;$('law-work-close').onclick=close;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('law-desk-open'))close()});
 function match(){document.body.classList.toggle('law-desk-enabled',mq.matches);if(!mq.matches)document.body.classList.remove('law-desk-open')}
 mq.addEventListener?.('change',match);match();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

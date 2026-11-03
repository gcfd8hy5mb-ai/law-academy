// Level 4 teaching preview; browser-local drafts only. No academic sign-off or automated mastery.
const L4_KEY='law-academy-level4-v1';
function renderLevel4(){
 const courses=window.LAW_LEVEL4||[];
 const esc=value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
 const safeRead=()=>{try{const raw=JSON.parse(localStorage.getItem(L4_KEY)||'{}');return raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{}}catch(_){return {}}};
 let progress=safeRead();
 // Merge a single entry; never replace the older progress objects or any earlier academy key.
 const save=(id,changes)=>{
  try{
   const latest=safeRead();
   const existing=latest[id]&&typeof latest[id]==='object'&&!Array.isArray(latest[id])?latest[id]:{};
   const merged={...latest,[id]:{...existing,...changes}};
   localStorage.setItem(L4_KEY,JSON.stringify(merged));progress=merged;return true;
  }catch(_){return false}
 };
 const layout=(contents)=>shell(contents,'courses');
 const home=()=>{
  layout('<div class="pagehead"><span class="gold-label">LEVEL 4 · THIRD-YEAR LAW</span><h1>3L Practice & Advocacy</h1><p>Development preview: '+courses.reduce((sum,c)=>sum+c.lessons.length,0)+' authored lessons across '+courses.length+' course tracks. Casework and knowledge checks are practice only; independent legal review remains pending.</p></div><div class="level-list">'+courses.map((c,i)=>'<button class="level-row" data-l4course="'+i+'"><span class="level-icon">'+(i+1)+'</span><span class="level-text"><strong>'+esc(c.title)+'</strong><small>'+c.lessons.length+' draft lesson(s) · applied lawyering</small></span><span class="level-arrow">›</span></button>').join('')+'</div><div class="review-item"><h3>Saving and backup</h3><p>Level 4 drafts are stored on this device only, not yet cloud-synchronized. Earlier levels and their saved progress are untouched. Copy your work before switching devices or clearing browser data.</p><button class="button secondary" id="l4backup">Copy Level 4 draft backup</button><p id="l4backupStatus" role="status"></p><textarea class="writing-field" id="l4backupText" rows="5" readonly hidden aria-label="Level 4 draft backup"></textarea></div><button class="button secondary" id="l4academy">Back to Academy</button>');
  document.querySelectorAll('[data-l4course]').forEach(b=>b.onclick=()=>showCourse(Number(b.dataset.l4course)));
  document.querySelector('#l4academy').onclick=renderCatalog;
  document.querySelector('#l4backup').onclick=async()=>{
   const data=JSON.stringify({format:'law-academy-level4-backup-v1',entries:safeRead()},null,2);
   const status=document.querySelector('#l4backupStatus');
   try{await navigator.clipboard.writeText(data);status.textContent='Backup copied. Store it securely.'}
   catch(_){const area=document.querySelector('#l4backupText');area.hidden=false;area.value=data;status.textContent='Clipboard unavailable; manually copy this backup.'}
  };
 };
 const showCourse=index=>{
  const course=courses[index];if(!course)return home();
  layout('<div class="pagehead"><span class="gold-label">LEVEL 4 · COURSE '+(index+1)+'</span><h1>'+esc(course.title)+'</h1><p>Draft coursework. Written practice is not a professional grade.</p></div><div class="level-list">'+course.lessons.map((l,i)=>'<button class="level-row" data-l4lesson="'+i+'"><span class="level-icon">'+(i+1)+'</span><span class="level-text"><strong>'+esc(l.title)+'</strong><small>Case study · writing · knowledge check</small></span><span class="level-arrow">›</span></button>').join('')+'</div><button class="button secondary" id="l4courses">Back to Level 4 courses</button>');
  document.querySelectorAll('[data-l4lesson]').forEach(b=>b.onclick=()=>showLesson(index,Number(b.dataset.l4lesson)));
  document.querySelector('#l4courses').onclick=home;
 };
 const showLesson=(i,j)=>{
  const lesson=courses[i]?.lessons[j];if(!lesson)return showCourse(i);
  const stored=safeRead()[lesson.id]||{};
  layout('<div class="pagehead"><span class="gold-label">LEVEL 4 · PRACTICE LESSON</span><h1>'+esc(lesson.title)+'</h1><p>'+esc(lesson.authority)+'</p></div><section class="feature-card"><h2>Client or court scenario</h2><p>'+esc(lesson.scenario)+'</p></section><div class="review-item"><h3>Detailed instruction</h3><p style="white-space:pre-wrap">'+esc(lesson.reading)+'</p></div><div class="review-item"><h3>Competing arguments</h3><p>'+esc(lesson.counterarguments)+'</p></div><div class="review-item"><h3>Written practice</h3><p>'+esc(lesson.assignment)+'</p><label for="l4draft">Your legal analysis</label><textarea id="l4draft" class="writing-field" rows="9" placeholder="Analyze the facts, applicable law, competing arguments and likely outcome..."></textarea><p id="l4draftStatus" role="status">Saved locally when storage is available.</p></div><div class="review-item"><h3>Knowledge check</h3><p>'+esc(lesson.question)+'</p><div role="group" aria-label="Knowledge check options">'+lesson.options.map((option,k)=>'<label style="display:block;padding:9px 0"><input type="radio" name="l4choice" value="'+k+'"> '+esc(option)+'</label>').join('')+'</div><button class="gold-button" id="l4check">Check reasoning</button><p id="l4result" role="status"></p></div><button class="button secondary" id="l4back">Back to course</button>');
  const draft=document.querySelector('#l4draft'),status=document.querySelector('#l4draftStatus');
  draft.value=typeof stored.draft==='string'?stored.draft:'';
  let baseline=draft.value;
  const persist=()=>{
   const now=safeRead()[lesson.id]||{};
   if((now.draft||'')!==baseline){status.textContent='Draft changed in another tab. Copy your current text before reloading; nothing was overwritten.';return false}
   if(save(lesson.id,{draft:draft.value})){baseline=draft.value;status.textContent='Draft saved on this device.';return true}
   status.textContent='Storage unavailable. Copy your work before leaving.';return false
  };
  draft.addEventListener('input',persist);
  document.querySelector('#l4back').onclick=()=>{persist();showCourse(i)};
  document.querySelector('#l4check').onclick=()=>{
   const checked=document.querySelector('input[name="l4choice"]:checked');
   if(!checked){document.querySelector('#l4result').textContent='Choose an answer first.';return}
   const correct=Number(checked.value)===lesson.answer;
   document.querySelector('#l4result').textContent=(correct?'Correct. ':'Review the explanation. ')+lesson.why+' This is practice feedback, not a certified examination grade.';
   save(lesson.id,{lastAnswer:Number(checked.value),practiceCorrect:correct});
  };
 };
 home();
}

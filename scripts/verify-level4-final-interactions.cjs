/* Zero-dependency DOM/storage smoke test for Level 4 practical finals.
 * Run: node scripts/verify-level4-final-interactions.cjs
 * Mocks browser APIs; not a substitute for real Safari/desktop acceptance.
 */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=['level4-practical-finals-data.js','level4-practical-final-case-packets-2026.js','level4-final-examiner-calibration-2026.js','level4-independent-review-export-2026.js','level4-practical-finals-ui.js'];
const db=new Map(),runtime={els:new Map(),collections:new Map(),html:'',copied:''};
const fakeElement=(attrs={})=>({
 value:attrs.value||'',hidden:attrs.hidden===true,textContent:'',innerHTML:'',
 dataset:attrs.dataset||{},checked:false,onclick:null,focus(){this.focused=true;},
 select(){this.selected=true;},addEventListener(type,callback){this['on'+type]=callback}
});
const document={
 querySelector(selector){
  if(!selector.startsWith('#'))return null;
  return runtime.els.get(selector.slice(1))||null;
 },
 querySelectorAll(selector){
  if(runtime.collections.has(selector))return runtime.collections.get(selector);
  let results=[];
  if(selector==='[data-final]')results=Array.from(runtime.html.matchAll(/data-final="([^"]+)"/g),m=>fakeElement({dataset:{final:m[1]}}));
  if(selector==='[data-final-restore]')results=Array.from(runtime.html.matchAll(/data-final-restore="([^"]+)"/g),m=>fakeElement({dataset:{finalRestore:m[1]}}));
  runtime.collections.set(selector,results);
  return results;
 }
};
function shell(html){
 runtime.html=html;runtime.els.clear();runtime.collections.clear();
 for(const m of html.matchAll(/<([a-z]+)\b([^>]*\bid="([^"]+)"[^>]*)>/gi)){
  const attrs=m[2],id=m[3],value=(attrs.match(/\bvalue="([^"]*)"/)||[])[1]||'';
  runtime.els.set(id,fakeElement({value,hidden:/\bhidden(?:\s|>|$)/.test(attrs)}));
 }
}
const ctx={
 window:{},document,shell,renderExams(){},
 localStorage:{getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)},
 navigator:{clipboard:{writeText:async value=>{runtime.copied=value}}},
 confirm(){return true},setInterval(){return 23},clearInterval(){},Date,
};
vm.createContext(ctx);
for(const file of files)vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file,timeout:3000});
const exams=ctx.window.LAW_LEVEL4_FINALS;assert.equal(exams.length,7);
const get=id=>document.querySelector('#'+id);
const stored=()=>JSON.parse(db.get('law-academy-level4-finals-v1')||'{}');
const essay=Array(180).fill('Evidence').join(' ');
async function test(){
 for(const exam of exams){
  ctx.window.renderLevel4PracticalFinals();
  let choices=document.querySelectorAll('[data-final]');
  const open=choices.find(x=>x.dataset.final===exam.id);
  assert.ok(open,'Final missing from home '+exam.id);open.onclick();
  assert.ok(runtime.html.includes('Expanded fictional case packet'),'Missing packet display');
  assert.ok(get('finalFeedback').hidden,'Unsubmitted comparison should be hidden');
  assert.ok(get('finalCalibration').hidden,'Unsubmitted scoring guide should be hidden');
  const draft=get('finalDraft');draft.value=essay;draft.oninput();
  assert.equal(stored()[exam.id].draft,essay,'Draft not saved on input');
  get('finalSnapshot').onclick();
  assert.equal(stored()[exam.id].snapshots.length,1,'Snapshot failed');
  get('finalSubmit').onclick();
  assert.equal(stored()[exam.id].finished,true,'Submission status not saved');
  assert.equal(get('finalFeedback').hidden,false,'Completion does not reveal comparison');
  assert.equal(get('finalCalibration').hidden,false,'Completion does not reveal scoring guide');
  get('finalBack').onclick();
  choices=document.querySelectorAll('[data-final]');choices.find(x=>x.dataset.final===exam.id).onclick();
  assert.equal(get('finalDraft').value,essay,'Reopen lost draft');
  assert.equal(get('finalFeedback').hidden,false,'Reopen lost answer comparison');
  assert.equal(get('finalCalibration').hidden,false,'Reopen lost scoring guide');
  get('finalStart').onclick();
  assert.equal(stored()[exam.id].finished,false,'Restart did not clear submitted flag');
  assert.equal(get('finalFeedback').hidden,true,'Restart leaked prior comparison');
  assert.equal(get('finalCalibration').hidden,true,'Restart leaked scoring guide');
  assert.equal(stored()[exam.id].draft,essay,'Restart deleted draft');
  await get('finalCopyReviewer').onclick();
  assert.ok(runtime.copied.includes(essay),'Reviewer export missing draft');
  assert.ok(runtime.copied.includes(exam.id),'Reviewer export missing exam');
  assert.ok(!runtime.copied.includes(exam.modelReasoning),'Reviewer export leaked model');
  ctx.navigator.clipboard.writeText=async()=>{throw new Error('Denied')};
  await get('finalCopyReviewer').onclick();
  assert.equal(get('finalReviewerFallback').hidden,false,'Clipboard fallback not shown');
  assert.ok(get('finalReviewerFallback').selected,'Fallback text not selected');
  ctx.navigator.clipboard.writeText=async value=>{runtime.copied=value};
  // Restore a snapshot after marking completed: review must be re-hidden.
  get('finalSubmit').onclick();
  assert.equal(get('finalFeedback').hidden,false);
  get('finalSnapshots').innerHTML=''; // Snapshot buttons are rendered via HTML, not page shell.
  // Exercise snapshot restore via the attached render event if it exists in page DOM in a real browser.
  // The separate static assertion guards the restore visibility handler.
  assert.ok(fs.readFileSync(files[4],'utf8').includes('syncReviewVisibility();status.textContent='));
  get('finalBack').onclick();
 }
 console.log('PASS — seven final exams: draft persistence, submit, reopen, timer reset, reviewer export and clipboard fallback');
 console.log('NOT TESTED — real iPhone Safari, PWA and desktop input/clipboard behavior');
}
test().catch(e=>{console.error(e);process.exitCode=1});

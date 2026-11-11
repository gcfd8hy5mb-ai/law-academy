import {test,expect} from '@playwright/test';

test('Level 3 exposes seven courses and integrated capstone with persistent sections',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel3());
 await expect(page.locator('[data-l3course]')).toHaveCount(7);
 await page.locator('#l3capstone').click();
 await expect(page.locator('[data-capdraft]')).toHaveCount(7);
 await page.locator('#l3cap0').fill('Evidence analysis concerning authentication and hearsay.');
 await expect(page.locator('#l3capStatus')).toContainText('saved on this device');
 await page.locator('#l3capBack').click();
 await page.locator('#l3capstone').click();
 await expect(page.locator('#l3cap0')).toHaveValue('Evidence analysis concerning authentication and hearsay.');
});

test('Level 3 course finals are reachable and model reasoning starts hidden',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel3());
 for(let i=0;i<7;i++){
   await page.locator('[data-l3course="'+i+'"]').click();
   await expect(page.locator('[data-l3lesson]')).toHaveCount(10);
   await page.locator('[data-l3lesson="9"]').click();
   await expect(page.locator('#l3draft')).toBeVisible();
   await expect(page.getByText('Second-Year Final Examination',{exact:false})).toBeVisible();
   await page.locator('#l3back').click();
   await page.locator('#l3back').click();
 }
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="4"]').click();
 await expect(page.locator('#l3worked')).toBeHidden();
 await page.locator('#l3reveal').click();
 await expect(page.locator('#l3revealStatus')).toContainText('at least 100 words');
 await expect(page.locator('#l3worked')).toBeHidden();
});

test('Level 3 counts actual words and unlocks model reasoning after 100 words',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel3());
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="4"]').click();
 const words=Array.from({length:100},(_,i)=>'analysis'+i).join(' ');
 await page.locator('#l3draft').fill(words);
 await page.locator('#l3feedback').click();
 await expect(page.locator('#l3feedbackResult')).toContainText('100 words.');
 await page.locator('#l3reveal').click();
 await expect(page.locator('#l3worked')).toBeVisible();
 await expect(page.locator('#l3revealStatus')).toContainText('not an independent grade');
});

test('Level 3 cannot reveal worked reasoning with 99 actual words',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel3());
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="4"]').click();
 const answer=Array.from({length:99},(_,i)=>'word'+i).join(' ')+'   ';
 await page.locator('#l3draft').fill(answer);
 await page.locator('#l3reveal').click();
 await expect(page.locator('#l3worked')).toBeHidden();
 await expect(page.locator('#l3revealStatus')).toContainText('at least 100 words');
});

test('Integrated capstone warns rather than copying empty submissions',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel3());
 await page.locator('#l3capstone').click();
 await page.locator('#l3capCopy').click();
 await expect(page.locator('#l3capStatus')).toContainText('Write at least one capstone section before copying.');
});

test('Capstone displays all seven subject-specific essay prompts',async({page})=>{await page.goto('/');await page.evaluate(()=>renderLevel3());await page.locator('#l3capstone').click();await expect(page.getByText('Assess authentication, hearsay and expert reliability.')).toBeVisible();await expect(page.getByText('Assess searches, interrogation and suppression.')).toBeVisible();await expect(page.locator('[data-capdraft]')).toHaveCount(7);});

test('Course finals are explicitly labeled as requiring qualified written review',async({page})=>{await page.goto('/');await page.evaluate(()=>renderLevel3());for(let i=0;i<7;i++){await page.locator('[data-l3course="'+i+'"]').click();await expect(page.locator('[data-l3lesson="9"]')).toContainText('Course final · written work requires qualified review');await page.locator('#l3back').click();}});

test('Academy catalog opens authored Level 3 instead of a future placeholder',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderCatalog());
 const year2=page.locator('details.future-item').filter({hasText:'Second-Year Law School'});
 await year2.locator('summary').click();
 await expect(year2).toContainText('70 lessons and capstone available');
 await year2.locator('[data-planned="2"]').click();
 await expect(page.locator('[data-l3course]')).toHaveCount(7);
 await expect(page.locator('#l3capstone')).toBeVisible();
});

test('Capstone readiness tracks sections and actual words without awarding a grade',async({page})=>{await page.goto('/');await page.evaluate(()=>renderLevel3());await page.locator('#l3capstone').click();await expect(page.locator('#l3capReadiness')).toContainText('0 of 7 sections drafted · 0 words');await page.locator('#l3cap0').fill('First legal issue and competing argument');await expect(page.locator('#l3capReadiness')).toContainText('1 of 7 sections drafted · 6 words');await expect(page.locator('#l3capReadiness')).toContainText('not a grade');});

test('Capstone tracker flags writing beyond seven thousand words',async({page})=>{await page.goto('/');await page.evaluate(()=>renderLevel3());await page.locator('#l3capstone').click();await page.locator('#l3cap0').fill(Array(7001).fill('analysis').join(' '));await expect(page.locator('#l3capReadiness')).toContainText('Above the 7,000-word target');});

test('Final reviewer packet is available only on course finals and requires a draft',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel3());
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await expect(page.locator('#l3reviewPacket')).toHaveCount(0);
 await page.locator('#l3back').click();
 await page.locator('[data-l3lesson="9"]').click();
 await expect(page.locator('#l3reviewPacket')).toBeVisible();
 await page.locator('#l3reviewPacket').click();
 await expect(page.locator('#l3reviewPacketStatus')).toContainText('Write your final examination');
});

test('Final reviewer packet contains the student answer, case facts and 100-point rubric',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{
   window.__copiedPacket='';
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copiedPacket=text;}}});
   renderLevel3();
 });
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="9"]').click();
 await page.locator('#l3draft').fill('My independently written legal analysis of hearsay and admissibility.');
 await page.locator('#l3reviewPacket').click();
 await expect(page.locator('#l3reviewPacketStatus')).toContainText('Reviewer packet copied');
 const packet=await page.evaluate(()=>window.__copiedPacket);
 expect(packet).toContain('CASE FACTS:');
 expect(packet).toContain('AUTHORITIES TO VERIFY:');
 expect(packet).toContain('My independently written legal analysis');
 expect(packet).toContain('REVIEWER RUBRIC (100)');
 expect(packet).toContain('Qualified reviewer must check sources');
});

test('Reviewer packet remains copyable when clipboard permission is unavailable',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Clipboard blocked');}}});
   renderLevel3();
 });
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="9"]').click();
 await page.locator('#l3draft').fill('Analysis with factual application and opposing arguments.');
 await page.locator('#l3reviewPacket').click();
 await expect(page.locator('#l3reviewPacketStatus')).toContainText('complete reviewer packet');
 await expect(page.locator('#l3reviewPacketFallback')).toBeVisible();
 await expect(page.locator('#l3reviewPacketFallback')).toHaveValue(/CASE FACTS:/);
 await expect(page.locator('#l3reviewPacketFallback')).toHaveValue(/REVIEWER RUBRIC \(100\)/);
 await expect(page.locator('#l3reviewPacketFallback')).toHaveValue(/Analysis with factual application/);
});

test('Level 3 exports all saved lesson and capstone writing for device backup',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await page.locator('#l3draft').fill('My evidence lesson notes');
 await page.locator('#l3back').click();
 await page.locator('#l3back').click();
 await page.locator('#l3capstone').click();
 await page.locator('#l3cap0').fill('My capstone evidence section');
 await page.locator('#l3capBack').click();
 await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('blocked')}}})});
 await page.locator('#l3export').click();
 await expect(page.locator('#l3exportFallback')).toBeVisible();
 await expect(page.locator('#l3exportFallback')).toHaveValue(/My evidence lesson notes/);
 await expect(page.locator('#l3exportFallback')).toHaveValue(/My capstone evidence section/);
});

test('Level 3 restores a portable backup without overwriting existing writing',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 const payload=JSON.stringify({format:'law-academy-level3-drafts',version:1,drafts:{'L3-1-1':'Restored lesson analysis','L3-CAP-0':'Restored capstone answer'}});
 await page.locator('#l3restoreInput').fill(payload);
 await page.locator('#l3restore').click();
 await expect(page.locator('#l3restoreStatus')).toContainText('2 missing drafts restored');
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await expect(page.locator('#l3draft')).toHaveValue('Restored lesson analysis');
 await page.locator('#l3draft').fill('Existing answer takes precedence');
 await page.locator('#l3back').click();
 await page.locator('#l3back').click();
 await page.locator('#l3restoreInput').fill(payload);
 await page.locator('#l3restore').click();
 await expect(page.locator('#l3restoreStatus')).toContainText('0 missing drafts restored');
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await expect(page.locator('#l3draft')).toHaveValue('Existing answer takes precedence');
});
test('Level 3 refuses unknown identifiers in transferred backups',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.locator('#l3restoreInput').fill(JSON.stringify({format:'law-academy-level3-drafts',version:1,drafts:{'UNKNOWN-ID':'unsafe'}}));
 await page.locator('#l3restore').click();
 await expect(page.locator('#l3restoreStatus')).toContainText('Nothing was changed');
});

test('Level 3 restore does not change in-memory drafts when browser storage fails',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.locator('#l3restoreInput').fill(JSON.stringify({format:'law-academy-level3-drafts',version:1,drafts:{'L3-1-1':'Unsaved incoming writing'}}));
 await page.evaluate(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='law-academy-level3-v1')throw new Error('Quota exceeded');return set.call(this,k,v)}});
 await page.locator('#l3restore').click();
 await expect(page.locator('#l3restoreStatus')).toContainText('Nothing was changed');
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await expect(page.locator('#l3draft')).toHaveValue('');
});

test('Backup restoration preserves writing saved by another tab after this view loaded',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.evaluate(()=>localStorage.setItem('law-academy-level3-v1',JSON.stringify({'L3-1-1':{draft:'Fresh writing from another tab'}})));
 await page.locator('#l3restoreInput').fill(JSON.stringify({format:'law-academy-level3-drafts',version:1,drafts:{'L3-1-1':'Older backup text','L3-CAP-0':'Incoming capstone analysis'}}));
 await page.locator('#l3restore').click();
 await expect(page.locator('#l3restoreStatus')).toContainText('1 missing drafts restored');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level3-v1')));
 expect(saved['L3-1-1'].draft).toBe('Fresh writing from another tab');
 expect(saved['L3-CAP-0'].draft).toBe('Incoming capstone analysis');
});

test('Saving one lesson preserves a different lesson updated in another tab',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.evaluate(()=>localStorage.setItem('law-academy-level3-v1',JSON.stringify({'L3-2-1':{draft:'Another tab already saved this'}})));
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await page.locator('#l3draft').fill('My current lesson answer');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level3-v1')));
 expect(saved['L3-2-1'].draft).toBe('Another tab already saved this');
 expect(saved['L3-1-1'].draft).toBe('My current lesson answer');
});

test('Stale lesson editing does not replace newer saved writing',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await page.evaluate(()=>localStorage.setItem('law-academy-level3-v1',JSON.stringify({'L3-1-1':{draft:'Newer writing from another tab'}})));
 await page.locator('#l3draft').fill('Stale edit from this tab');
 await expect(page.locator('#l3status')).toContainText('changed in another tab');
 await page.locator('#l3back').click();
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level3-v1')));
 expect(stored['L3-1-1'].draft).toBe('Newer writing from another tab');
});
test('Stale capstone editing does not replace newer saved section',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.locator('#l3capstone').click();
 await page.evaluate(()=>localStorage.setItem('law-academy-level3-v1',JSON.stringify({'L3-CAP-0':{draft:'Newer capstone from another tab'}})));
 await page.locator('#l3cap0').fill('Old section edit');
 await expect(page.locator('#l3capStatus')).toContainText('changed in another tab');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level3-v1')));
 expect(stored['L3-CAP-0'].draft).toBe('Newer capstone from another tab');
});

test('Level 3 quiz completion does not overwrite a newer draft in the same lesson',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await page.evaluate(()=>localStorage.setItem('law-academy-level3-v1',JSON.stringify({'L3-1-1':{draft:'Newer draft in another tab'}})));
 await page.locator('input[name="l3choice"]').first().check();
 await page.locator('#l3check').click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level3-v1')));
 expect(saved['L3-1-1'].draft).toBe('Newer draft in another tab');
 expect(typeof saved['L3-1-1'].correct).toBe('boolean');
});
test('Level 3 saves only changed fields rather than replacing another tab progress',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.evaluate(()=>localStorage.setItem('law-academy-level3-v1',JSON.stringify({'L3-2-1':{draft:'Recently edited other course',correct:true}})));
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await page.locator('#l3draft').fill('New answer in this course');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level3-v1')));
 expect(saved['L3-2-1']).toEqual({draft:'Recently edited other course',correct:true});
 expect(saved['L3-1-1'].draft).toBe('New answer in this course');
});

test('Level 3 lesson retries writing after a temporary storage failure without false conflict',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.locator('[data-l3course="0"]').click();
 await page.locator('[data-l3lesson="0"]').click();
 await page.evaluate(()=>{
   const original=Storage.prototype.setItem;
   window.__restoreStorage=()=>{Storage.prototype.setItem=original};
   Storage.prototype.setItem=function(k,v){if(k==='law-academy-level3-v1')throw new Error('Simulated quota error');return original.call(this,k,v)};
 });
 await page.locator('#l3draft').fill('First attempt');
 await expect(page.locator('#l3status')).toContainText('Saving unavailable');
 await page.evaluate(()=>window.__restoreStorage());
 await page.locator('#l3draft').fill('Second attempt after recovery');
 await expect(page.locator('#l3status')).toContainText('Draft saved on this device');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level3-v1')));
 expect(saved['L3-1-1'].draft).toBe('Second attempt after recovery');
});
test('Capstone retries saving after temporary storage failure without false tab conflict',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.removeItem('law-academy-level3-v1');renderLevel3()});
 await page.locator('#l3capstone').click();
 await page.evaluate(()=>{
   const original=Storage.prototype.setItem;
   window.__restoreStorage=()=>{Storage.prototype.setItem=original};
   Storage.prototype.setItem=function(k,v){if(k==='law-academy-level3-v1')throw new Error('Simulated quota error');return original.call(this,k,v)};
 });
 await page.locator('#l3cap0').fill('First attempt');
 await expect(page.locator('#l3capStatus')).toContainText('Storage unavailable');
 await page.evaluate(()=>window.__restoreStorage());
 await page.locator('#l3cap0').fill('Second attempt after recovery');
 await expect(page.locator('#l3capStatus')).toContainText('Capstone draft saved on this device');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('law-academy-level3-v1')));
 expect(saved['L3-CAP-0'].draft).toBe('Second attempt after recovery');
});

test('Seven worked reasoning exercises require an original written attempt before reveal',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel3());
 for(let i=0;i<7;i++){
  await page.locator('[data-l3course="'+i+'"]').click();
  await page.locator('[data-l3lesson="1"]').click();
  await expect(page.locator('#l3worked')).toBeHidden();
  await page.locator('#l3reveal').click();
  await expect(page.locator('#l3revealStatus')).toContainText('at least 100 words');
  await page.locator('#l3draft').fill(Array.from({length:100},(_,j)=>'reasoning'+j).join(' '));
  await page.locator('#l3reveal').click();
  await expect(page.locator('#l3worked')).toBeVisible();
  await expect(page.locator('#l3worked')).toContainText('WORKED');
  await page.locator('#l3back').click();
  await page.locator('#l3back').click();
 }
});

test('Foundational case examples in all seven courses stay hidden until student writing',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel3());
 for(let i=0;i<7;i++){
  await page.locator('[data-l3course="'+i+'"]').click();
  await page.locator('[data-l3lesson="2"]').click();
  await expect(page.locator('#l3worked')).toBeHidden();
  await page.locator('#l3reveal').click();
  await expect(page.locator('#l3revealStatus')).toContainText('at least 100 words');
  await page.locator('#l3draft').fill(Array.from({length:100},(_,n)=>'argument'+n).join(' '));
  await page.locator('#l3reveal').click();
  await expect(page.locator('#l3worked')).toBeVisible();
  await expect(page.locator('#l3worked')).toContainText('WORKED');
  await page.locator('#l3back').click();
  await page.locator('#l3back').click();
 }
});

test('All seven course finals show scoring criteria and include examiner issue maps in the review packet',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{
  window.__reviewPacket='';
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__reviewPacket=value;}}});
  renderLevel3();
 });
 for(let i=0;i<7;i++){
  await page.locator('[data-l3course="'+i+'"]').click();
  await page.locator('[data-l3lesson="9"]').click();
  await expect(page.getByText('Final examination · assessment rubric (100 points)')).toBeVisible();
  await expect(page.getByText('Issue spotting and governing legal standards')).toBeVisible();
  await page.locator('#l3draft').fill('Assessment draft on issue identification, factual application, authority and competing arguments.');
  await page.locator('#l3reviewPacket').click();
  const packet=await page.evaluate(()=>window.__reviewPacket);
  expect(packet).toContain('REVIEWER RUBRIC (100)');
  expect(packet).toContain('EXAMINER ISSUE-SPOTTING QUESTIONS:');
  expect(packet).toContain('COMMON ERRORS TO WATCH:');
  expect(packet).toContain('Qualified reviewer must check sources');
  await page.locator('#l3back').click();
  await page.locator('#l3back').click();
 }
});

test('Level 3 courses display numbered lesson one before lessons two and three without changing IDs',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>renderLevel3());
 for(let i=0;i<7;i++){
   const expected=await page.evaluate(i=>window.LAW_LEVEL3[i].lessons.find(l=>l.id==='L3-'+(i+1)+'-1').title,i);
   await page.locator('[data-l3course="'+i+'"]').click();
   await expect(page.locator('[data-l3lesson="0"]')).toContainText(expected);
   await page.locator('[data-l3lesson="0"]').click();
   await expect(page.locator('#l3draft')).toBeVisible();
   await page.locator('#l3draft').fill('Numbered first lesson '+(i+1));
   const entry=await page.evaluate(id=>JSON.parse(localStorage.getItem('law-academy-level3-v1')||'{}')[id],'L3-'+(i+1)+'-1');
   expect(entry?.draft).toBe('Numbered first lesson '+(i+1));
   await page.locator('#l3back').click();
   await page.locator('#l3back').click();
 }
});

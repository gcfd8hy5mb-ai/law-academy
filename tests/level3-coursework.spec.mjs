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
 await page.addInitScript(()=>{
   window.__copiedPacket='';
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copiedPacket=text;}}});
 });
 await page.evaluate(()=>renderLevel3());
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

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

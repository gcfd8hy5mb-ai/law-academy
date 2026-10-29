import { test, expect } from '@playwright/test';
test('home, catalog, and lesson knowledge check work', async ({page}) => {
 await page.goto('/');
 await expect(page.getByText('Pre-Law Foundations').first()).toBeVisible();
 await page.getByRole('button',{name:/Continue Learning/}).click();
 await expect(page.getByText('Mastery check').or(page.getByText('Knowledge check'))).toBeVisible();
 await page.locator('[data-choice]').first().click();
 await expect(page.locator('#submit')).toBeEnabled();
 await page.locator('#submit').click();
 await expect(page.locator('#feedback')).not.toBeEmpty();
});
test('navigation and progress persist across reload',async ({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Continue Learning/}).click();
 const question=await page.locator('.question strong').first().textContent();
 await page.reload();
 await page.getByRole('button',{name:/Continue Learning/}).click();
 await expect(page.locator('.question strong').first()).toHaveText(question);
});
test('case studies and study labs open',async({page})=>{
 await page.goto('/');
 await page.locator('#caseStudiesHome').click();
 await expect(page.getByText('Case Studies & Writing')).toBeVisible();
 await page.locator('[data-reason]').first().click();
 await expect(page.locator('#reasonText')).toBeVisible();
 await page.locator('#reasonText').fill('A saved legal reasoning test response.');
 await page.locator('#reasonSave').click();
 await page.reload();
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-reason]').first().click();
 await expect(page.locator('#reasonText')).toHaveValue('A saved legal reasoning test response.');
});

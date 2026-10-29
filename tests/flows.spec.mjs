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

test('course practice examination presents questions and selectable answers',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:/Practice Exams/}).first().click();
 await expect(page.getByRole('heading',{name:'Practice Exams',exact:true})).toBeVisible();
 await page.locator('[data-exam]').first().click();
 await expect(page.locator('[data-exam-choice]')).toHaveCount(4);
 await page.locator('[data-exam-choice]').first().click();
 await expect(page.locator('#nextQuestion')).toBeEnabled();
 await page.locator('#nextQuestion').click();
 await expect(page.getByRole('heading',{name:/Question 2 of/})).toBeVisible();
});
test('case simulation investigation and notes persist',async({page})=>{
 await page.goto('/');
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-sim]').first().click();
 await expect(page.locator('#simText')).toBeVisible();
 await page.locator('#simBranchOptions button').first().click();
 await page.locator('#simText').fill('Evidence analysis from browser regression test.');
 await page.locator('#simSave').click();
 await page.reload();
 await page.locator('#caseStudiesHome').click();
 await page.locator('[data-sim]').first().click();
 await expect(page.locator('#simText')).toHaveValue('Evidence analysis from browser regression test.');
 await expect(page.locator('#simBranchOutcome')).not.toBeEmpty();
});
test('research portfolio stage and saved writing survive reload',async({page})=>{
 await page.goto('/');
 await page.locator('#caseStudiesHome').click();
 await page.locator('#researchCapstoneLaunch').click();
 await page.locator('#capstoneWriting').fill('My test question presented and preliminary legal research.');
 await page.locator('#capstoneSave').click();
 await page.reload();
 await page.locator('#caseStudiesHome').click();
 await page.locator('#researchCapstoneLaunch').click();
 await expect(page.locator('#capstoneWriting')).toHaveValue('My test question presented and preliminary legal research.');
 await page.locator('#capstoneNext').click();
 await expect(page.locator('#capstoneWriting')).toBeVisible();
});

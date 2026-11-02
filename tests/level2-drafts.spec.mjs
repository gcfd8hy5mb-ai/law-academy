import { test, expect } from '@playwright/test';

test('Level 2 capstone draft survives navigation and offers a copy control', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => renderLevel2());
  await expect(page.locator('[data-l2course]')).toHaveCount(7);
  await page.locator('[data-l2course="0"]').click();
  await expect(page.locator('[data-l2lesson]')).toHaveCount(18);
  await page.getByRole('button', { name: /Capstone: Commercial agreement and breach/ }).click();
  await expect(page.getByText('Written examination notice:', { exact: false })).toBeVisible();
  const draft = page.locator('#l2draft');
  const content = 'Contracts capstone analysis — identify UCC applicability, liability, remedies, and counterarguments.';
  await draft.fill(content);
  await expect(page.locator('#l2saveStatus')).toContainText('Draft saved on this device.');
  await page.locator('#l2back').click();
  await page.getByRole('button', { name: /Capstone: Commercial agreement and breach/ }).click();
  await expect(page.locator('#l2draft')).toHaveValue(content);
  await expect(page.locator('#l2saveStatus')).toContainText('Previously saved draft loaded');
  await expect(page.locator('#l2copyDraft')).toBeVisible();
});

test('Level 2 empty draft copy gives clear feedback', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => renderLevel2());
  await page.locator('[data-l2course="1"]').click();
  await page.locator('[data-l2lesson="0"]').click();
  await page.locator('#l2copyDraft').click();
  await expect(page.locator('#l2copyStatus')).toContainText('There is no written draft to copy yet.');
});


test('Level 2 warns when written draft cannot be saved', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => renderLevel2());
  await page.locator('[data-l2course="0"]').click();
  await page.locator('[data-l2lesson="0"]').click();
  await page.evaluate(() => {
    const previous = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'law-academy-level2-v1') throw new Error('Simulated storage quota error');
      return previous.call(this, key, value);
    };
  });
  await page.locator('#l2draft').fill('An answer that cannot be saved locally.');
  await expect(page.locator('#l2saveStatus')).toContainText('Draft could not be saved on this device.');
  await expect(page.locator('#l2copyDraft')).toBeVisible();
});

test('All seven Level 2 catalogs open their authored lessons', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => renderLevel2());
  const expected = [18,18,18,18,19,19,18];
  for (let i = 0; i < expected.length; i++) {
    await page.locator('[data-l2course="' + i + '"]').click();
    await expect(page.locator('[data-l2lesson]')).toHaveCount(expected[i]);
    await page.locator('[data-l2lesson="0"]').click();
    await expect(page.locator('#l2draft')).toBeVisible();
    await page.locator('#l2back').click();
    await page.locator('#l2back').click();
  }
});

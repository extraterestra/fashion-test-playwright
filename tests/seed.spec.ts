import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    await page.goto('http://localhost:4000/fashionhub/login.html');
  });
});

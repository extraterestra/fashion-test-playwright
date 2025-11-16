import { test, expect } from '@playwright/test';

test.describe('Console Errors', () => {
  test('should have no console errors on home page', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Listen for console messages
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to home page
    await page.goto('https://pocketaces2.github.io/fashionhub/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Assert no console errors
    expect(consoleErrors, `Expected no console errors, but found: ${consoleErrors.join(', ')}`).toHaveLength(0);
  });

  test('should detect console errors on about page', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Listen for console messages
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to about page (contains intentional error)
    await page.goto('https://pocketaces2.github.io/fashionhub/about.html');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Assert that console errors are detected
    expect(consoleErrors.length, 'Expected to find console errors on about page').toBeGreaterThan(0);
    console.log('Detected console errors:', consoleErrors);
  });
});

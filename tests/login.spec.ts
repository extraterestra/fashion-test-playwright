import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // Use a relative URL (no leading slash) so Playwright resolves it against
    // the configured `use.baseURL` and preserves any path segment like `fashionhub`.
    console.log('test fixture baseURL:', baseURL);
    await page.goto('login.html');
      // Print the actual page URL to help debug which baseURL was used.
      console.log('page after goto:', await page.url());
      await expect(page).toHaveURL(/login.html/);
    await expect(page.getByRole('heading', { name: 'Login to FashionHub' })).toBeVisible();
  });

  test('Happy path — Successful login', async ({ page }) => {
    const currentUrl = page.url();
    console.log('Current page URL used is:', currentUrl);
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const loginBtn = page.getByRole('button', { name: 'Login' });

    // Ensure fields are visible and ready before filling to avoid intermittent failures
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
    await username.scrollIntoViewIfNeeded();
    await password.scrollIntoViewIfNeeded();

    await username.fill('demouser');
    await password.fill('fashion123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
      loginBtn.click(),
    ]);

    // Expect we are no longer on the login page
    await expect(page).not.toHaveURL(/login.html/);

    // The login heading should no longer be present on the authenticated page
    await expect(page.getByRole('heading', { name: 'Login to FashionHub' })).toHaveCount(0);
  });

  test('Negative — Incorrect password', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const loginBtn = page.getByRole('button', { name: 'Login' });

    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
    await username.scrollIntoViewIfNeeded();
    await password.scrollIntoViewIfNeeded();

    await username.fill('demouser');
    await password.fill('wrongpassword');
    await loginBtn.click();

    // Wait briefly for any client/server response
    await page.waitForLoadState('networkidle');

    // Should remain on the login page
    await expect(page).toHaveURL(/login.html/);
    await expect(page.getByRole('heading', { name: 'Login to FashionHub' })).toBeVisible();

    // If an accessible alert is present, assert it's visible. Otherwise, look for common error text.
    const alerts = page.getByRole('alert');
    if (await alerts.count() > 0) {
      await expect(alerts.first()).toBeVisible();
    } else {
      const invalid = page.locator('text=Invalid').first();
      if (await invalid.count() > 0) await expect(invalid).toBeVisible();
    }
  });
});
import { test, expect } from './fixtures';
// import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('Happy path — Successful login', async ({ loginPage, homePage }) => {
    await loginPage.submitCredentials('demouser', 'fashion123');
    await expect(loginPage.heading).toHaveCount(0);
    expect(await homePage.isLoggedIn()).toBe(true);
  });

  test('Negative — Incorrect password', async ({ loginPage }) => {
    await loginPage.fillCredentials('demouser', 'wrongpassword');
    await loginPage.loginBtn.click();
    await loginPage.page.waitForLoadState('networkidle');
    await expect(loginPage.heading).toBeVisible();
    if (await loginPage.hasAlert()) {
      await expect(loginPage.alert.first()).toBeVisible();
    }
  });
});
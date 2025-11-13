import { test, expect } from './fixtures';

test.describe('Login page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Happy path — Successful login', async ({ loginPage, homePage, testUser }) => {
    // Use testUser fixture for environment-specific credentials
    await loginPage.submitCredentials(testUser.username, testUser.password);
    await expect(loginPage.heading).toHaveCount(0);
    expect(await homePage.isLoggedIn()).toBe(true);
  });

  test('Negative — Incorrect password', async ({ loginPage, testUser }) => {
    await loginPage.fillCredentials(testUser.username, 'wrongpassword');
    await loginPage.loginBtn.click();
    await loginPage.page.waitForLoadState('networkidle');
    await expect(loginPage.heading).toBeVisible();
    if (await loginPage.hasAlert()) {
      await expect(loginPage.alert.first()).toBeVisible();
    }
  });
});
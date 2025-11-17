import { test, expect } from '../helpers/fixtures';

test.describe('Login page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Happy path — Successful login', async ({ performValidLogin, homePage }) => {
    await test.step('Fill valid credentials', async () => {
      await performValidLogin();
    });

    await test.step('Verify user is logged in', async () => {
      await homePage.verifyUserLoggedIn();
    });
  });

  test('Negative — Incorrect password', async ({ performInvalidLogin, loginPage, homePage }) => {
    await test.step('Login with incorrect password', async () => {
      await performInvalidLogin();
    });

    await test.step('Verify alert and user not logged in', async () => {
      await loginPage.verifyLoginFailed();
      expect(await homePage.isLoggedIn()).toBe(false);
    });
  });

  test('Negative — Empty username', async ({ loginPage, testUser }) => {
    await test.step('Submit form with empty username', async () => {
      // Fill password but leave username empty
      await loginPage.password.fill(testUser.password);
      await loginPage.loginBtn.click();
    });

    await test.step('Verify validation message appears', async () => {
      // Check the HTML5 validation message
      const validationMessage = await loginPage.username.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toBe('Please fill out this field.');
    });
  });

  test('Negative — Empty password', async ({ loginPage, testUser }) => {
    await test.step('Submit form with empty password', async () => {
      // Fill username but leave password empty
      await loginPage.username.fill(testUser.username);
      await loginPage.loginBtn.click();
    });

    await test.step('Verify validation message appears', async () => {
      // Check the HTML5 validation message
      const validationMessage = await loginPage.password.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toBe('Please fill out this field.');
    });
  });
});
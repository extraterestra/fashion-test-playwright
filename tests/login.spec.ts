import { test, expect } from './fixtures';

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
});
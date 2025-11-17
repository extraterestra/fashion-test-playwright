import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';

// Resolve credentials based on TEST_ENV and environment variables
const getCredentials = () => {
  const env = (process.env.TEST_ENV || 'test').toLowerCase();
  if (env === 'prod') {
    return {
      username: process.env.PROD_USERNAME || 'demouser',
      password: process.env.PROD_PASSWORD || 'fashion123',
    };
  }
  if (env === 'stage') {
    return {
      username: process.env.STAGE_USERNAME || 'stageuser',
      password: process.env.STAGE_PASSWORD || 'stagepass123',
    };
  }
  return {
    username: process.env.TEST_USERNAME || 'demouser',
    password: process.env.TEST_PASSWORD || 'fashion123',
  };
};

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  testUser: { username: string; password: string };
  performValidLogin: () => Promise<void>;
  performInvalidLogin: () => Promise<void>;
};

export const test = base.extend<MyFixtures>({
  // Provide test credentials as a fixture
  testUser: async ({}, use) => {
    const credentials = getCredentials();
    await use(credentials);
  },

  // LoginPage fixture - creates LoginPage instance (does NOT auto-navigate)
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // HomePage fixture - creates HomePage instance
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // performValidLogin fixture - encapsulates login with valid credentials
  performValidLogin: async ({ loginPage, testUser }, use) => {
    await use(async () => {
      await loginPage.submitCredentials(testUser.username, testUser.password);
    });
  },

  // performInvalidLogin fixture - encapsulates login with invalid credentials
  performInvalidLogin: async ({ loginPage, testUser }, use) => {
    await use(async () => {
      await loginPage.fillCredentials(testUser.username, 'wrongpassword');
      await loginPage.loginBtn.click();
      await loginPage.page.waitForLoadState('networkidle');
    });
  },
});

export { expect };

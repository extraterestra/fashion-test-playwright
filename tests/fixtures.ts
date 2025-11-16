import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../page_objects/loginPage';
import { HomePage } from '../page_objects/homePage';

// Dynamic import of credentials based on TEST_ENV
const getCredentials = () => {
  const env = process.env.TEST_ENV || 'test';
  
  try {
    if (env === 'prod') {
      return require('../playwright-prod.config').testCredentials;
    } else if (env === 'stage') {
      return require('../playwright-stage.config').testCredentials;
    } else {
      return require('../playwright-test.config').testCredentials;
    }
  } catch (error) {
    // Fallback to default credentials
    console.warn('⚠️  Could not load credentials from config, using defaults');
    return {
      username: 'demouser',
      password: 'fashion123',
    };
  }
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
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Environment configuration
 * Supports environment variable: TEST_ENV=test, TEST_ENV=stage, or TEST_ENV=prod
 * Usage: TEST_ENV=prod npx playwright test
 * Default: test
 */
// Try several ways to detect the environment – this makes the config resilient
// when running via `npx`, `npm run`, or other wrappers.
console.log('env debug: TEST_ENV=', process.env.TEST_ENV, 'npm_config_test_env=', process.env.npm_config_test_env, 'PLAYWRIGHT_TEST_ENV=', process.env.PLAYWRIGHT_TEST_ENV);
// Some users may still pass a CLI flag like --test-env=prod; check argv as a fallback.
const argvEnvMatch = process.argv.find((a) => a.startsWith('--test-env='));
const argvEnv = argvEnvMatch ? argvEnvMatch.split('=')[1] : undefined;
if (argvEnv) console.log('Found argv --test-env:', argvEnv);
const envVar = process.env.TEST_ENV || process.env.npm_config_test_env || process.env.PLAYWRIGHT_TEST_ENV;
// Validate the environment; default to 'test' if not recognized
const validEnvs = ['test', 'stage', 'prod'] as const;
const testEnv = (validEnvs.includes(envVar as any) ? envVar : 'test') || (validEnvs.includes(argvEnv as any) ? argvEnv : 'test');
console.log('Selected testEnv:', testEnv);

const environmentUrls = {
  test: 'http://localhost:4000/fashionhub',
  stage: 'https://staging-env/fashionhub/',
  prod: 'https://pocketaces2.github.io/fashionhub/',
};

let baseURL = environmentUrls[testEnv as keyof typeof environmentUrls];
// Ensure baseURL ends with a trailing slash so relative navigations like `login.html`
// are appended to the path (otherwise leading/trailing slash behavior can strip
// path segments when resolving URLs).
if (!baseURL.endsWith('/')) baseURL += '/';
console.log('Using baseURL:', baseURL);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
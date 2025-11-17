import { defineConfig, devices } from '@playwright/test';

// Unified Playwright config with environment switching
const env = (process.env.TEST_ENV || 'test').toLowerCase();
const isDocker = process.env.DOCKER === 'true' || process.env.CI === 'true';

const baseURL = (() => {
  if (env === 'prod') return 'https://pocketaces2.github.io/fashionhub/';
  if (env === 'stage') return 'https://staging-env/fashionhub/';
  // test env
  return process.env.BASE_URL || (isDocker ? 'http://fashionhub-app:4000/fashionhub/' : 'http://localhost:4000/fashionhub/');
})();

const commonReporter: any = [
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['junit', { outputFile: 'test-results/junit-results.xml' }],
];

const projects = (() => {
  if (env === 'prod') {
    return [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ];
  }
  if (env === 'stage') {
    return [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    ];
  }
  return [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ];
})();

const envHeaders = (() => {
  if (env === 'prod') {
    return {
      'X-Test-User': process.env.PROD_USERNAME || 'demouser',
      'X-Test-Pass': process.env.PROD_PASSWORD || 'fashion123',
    };
  }
  if (env === 'stage') {
    return {
      'X-Test-User': process.env.STAGE_USERNAME || 'stageuser',
      'X-Test-Pass': process.env.STAGE_PASSWORD || 'stagepass123',
    };
  }
  return {
    'X-Test-User': process.env.TEST_USERNAME || 'demouser',
    'X-Test-Pass': process.env.TEST_PASSWORD || 'fashion123',
  };
})();

const traceSetting = env === 'test' ? 'on-first-retry' : 'retain-on-failure';
const screenshotSetting = env === 'prod' ? 'on' : 'only-on-failure';
const videoSetting = env === 'prod' ? 'retain-on-failure' : 'off';

const fullyParallel = env !== 'prod';
const retries = env === 'prod' ? 1 : (process.env.CI ? 1 : (env === 'stage' ? 1 : 0));
const workers = env === 'prod' ? 1 : (process.env.CI ? 1 : (env === 'stage' ? 2 : undefined));
const forbidOnly = env === 'prod' ? true : !!process.env.CI;

const config = defineConfig({
  testDir: './tests',
  fullyParallel,
  forbidOnly,
  retries,
  workers,
  reporter: commonReporter,

  use: {
    baseURL,
    trace: traceSetting as any,
    screenshot: screenshotSetting as any,
    video: videoSetting as any,
    extraHTTPHeaders: envHeaders,
  },

  projects,

  // Start web server only for local test env
  ...(env === 'test' && !isDocker ? {
    webServer: {
      command: "sh -c 'curl -s -o /dev/null -w \"%{http_code}\" http://localhost:4000/fashionhub/ | grep -qE \"^(2|3)\" || npx http-server ./ -p 4000'",
      url: 'http://localhost:4000/fashionhub/',
      reuseExistingServer: true,
      timeout: 120 * 1000,
    },
  } : {}),
});

console.log(`Env: ${env} | baseURL: ${baseURL} | isDocker: ${isDocker}`);

export default config;

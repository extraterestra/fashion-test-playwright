import { defineConfig, devices } from '@playwright/test';

/**
 * Test Environment Configuration
 * For local development and testing
 */
const config = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:4000/fashionhub/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    
    // Test environment credentials (can be overridden by env vars)
    extraHTTPHeaders: {
      'X-Test-User': process.env.TEST_USERNAME || 'demouser',
      'X-Test-Pass': process.env.TEST_PASSWORD || 'fashion123',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});

console.log('📝 Test config loaded - baseURL:', config.use?.baseURL);

export default config;

// Export credentials for use in fixtures
export const testCredentials = {
  username: process.env.TEST_USERNAME || 'demouser',
  password: process.env.TEST_PASSWORD || 'fashion123',
};
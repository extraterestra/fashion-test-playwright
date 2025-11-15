import { defineConfig, devices } from '@playwright/test';

/**
 * Production Environment Configuration
 * For testing against live production environment
 */
const config = defineConfig({
  testDir: './tests',
  fullyParallel: false,  // Run serially in production to avoid load
  forbidOnly: true,
  retries: 2,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],
  
  use: {
    baseURL: 'https://pocketaces2.github.io/fashionhub/',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    
    // Production environment credentials (MUST be set via env vars for security)
    extraHTTPHeaders: {
      'X-Test-User': process.env.PROD_USERNAME || 'demouser1',
      'X-Test-Pass': process.env.PROD_PASSWORD || 'fashion123',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

console.log('📝 Prod config loaded - baseURL:', config.use?.baseURL);

export default config;

// Export credentials for use in fixtures
export const testCredentials = {
  username: process.env.PROD_USERNAME || 'demouser1',
  password: process.env.PROD_PASSWORD || 'fashion123',
};
import { defineConfig, devices } from '@playwright/test';

/**
 * Staging Environment Configuration
 * For pre-production testing
 */
const config = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],
  
  use: {
    baseURL: 'https://staging-env/fashionhub/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    
    // Staging environment credentials (can be overridden by env vars)
    extraHTTPHeaders: {
      'X-Test-User': process.env.STAGE_USERNAME || 'stageuser',
      'X-Test-Pass': process.env.STAGE_PASSWORD || 'stagepass123',
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
  ],
});

console.log('Stage config loaded - baseURL:', config.use?.baseURL);

export default config;

// Export credentials for use in fixtures
export const testCredentials = {
  username: process.env.STAGE_USERNAME || 'stageuser',
  password: process.env.STAGE_PASSWORD || 'stagepass123',
};
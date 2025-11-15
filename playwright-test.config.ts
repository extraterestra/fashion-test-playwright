import { defineConfig, devices } from '@playwright/test';

/**
 * Test Environment Configuration
 * For local development and testing
 */

// Determine if running in Docker
const isDocker = process.env.CI === 'true' || process.env.DOCKER === 'true';
const baseURL = process.env.BASE_URL || 'http://localhost:4000/fashionhub/';

const config = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],
  
  use: {
    baseURL: baseURL,
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
  ],

  // Only start webServer when running locally (not in Docker)
  ...(isDocker ? {} : {
    webServer: {
      command: 'npm run start',
      url: 'http://localhost:4000/fashionhub/',
      reuseExistingServer: true, // Always reuse existing server to avoid EADDRINUSE errors
      timeout: 120 * 1000, // 120 seconds
    },
  }),
});

console.log('📝 Test config loaded - baseURL:', config.use?.baseURL);
console.log('🐳 Running in Docker:', isDocker);

export default config;

// Export credentials for use in fixtures
export const testCredentials = {
  username: process.env.TEST_USERNAME || 'demouser',
  password: process.env.TEST_PASSWORD || 'fashion123',
};
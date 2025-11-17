/**
 * Dynamic Playwright Configuration Router
 * 
 * This file detects the TEST_ENV environment variable and loads
 * the appropriate environment-specific configuration file.
 * 
 * Usage:
 *   TEST_ENV=test npx playwright test
 *   TEST_ENV=stage npx playwright test
 *   TEST_ENV=prod npx playwright test
 * 
 * Or use npm scripts:
 *   npm run test:test
 *   npm run test:stage
 *   npm run test:prod
 * 
 * Or use explicit config files:
 *   npx playwright test --config=playwright-test.config.ts
 *   npx playwright test --config=playwright-stage.config.ts
 *   npx playwright test --config=playwright-prod.config.ts
 */

const env = process.env.TEST_ENV || 'test';
const validEnvs = ['test', 'stage', 'prod'];

if (!validEnvs.includes(env)) {
  console.warn(`Invalid TEST_ENV="${env}". Valid values: ${validEnvs.join(', ')}. Defaulting to "test".`);
}

const configFile = env === 'stage' ? './playwright-stage.config'
  : env === 'prod' ? './playwright-prod.config'
  : './playwright-test.config';

console.log(`Loading Playwright config for environment: ${env}`);
console.log(`Config file: ${configFile}.ts`);

// Dynamically import and export the selected config
module.exports = require(configFile).default;
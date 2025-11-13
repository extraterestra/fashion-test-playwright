# FashionHub Playwright Test Suite

A comprehensive end-to-end test suite for the FashionHub application built with **Playwright Test** and the **Page Object Model (POM)** pattern.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
  - [Run on Test Environment](#run-on-test-environment)
  - [Run on Staging Environment](#run-on-staging-environment)
  - [Run on Production Environment](#run-on-production-environment)
  - [Run with Custom Parameters](#run-with-custom-parameters)
- [Environment Variables](#environment-variables)
- [Test Fixtures](#test-fixtures)
- [Page Objects](#page-objects)
- [Test Examples](#test-examples)
- [Debugging Tests](#debugging-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## Overview

This test suite provides automated end-to-end testing for the FashionHub application with support for multiple environments:
- **Test** (localhost): `http://localhost:4000/fashionhub`
- **Staging**: `https://staging-env/fashionhub/`
- **Production**: `https://pocketaces2.github.io/fashionhub/`

### Key Features
✅ **Multi-environment support** — easily switch between test, staging, and production  
✅ **Page Object Model** — organized, maintainable test code  
✅ **Parameterized methods** — reusable test utilities  
✅ **Cross-platform compatibility** — works on Windows, macOS, and Linux  
✅ **Comprehensive reporting** — HTML test reports and trace files  

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16 or higher ([download](https://nodejs.org/))
- **npm** 8 or higher (comes with Node.js)
- **Git** (for cloning and version control)

Verify installation:
```bash
node --version
npm --version
git --version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/extraterestra/fashion-test-playwright.git
cd fashion-test-playwright
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `@playwright/test` — Playwright Test runner
- `cross-env` — cross-platform environment variable setting
- Other dev dependencies listed in `package.json`

### 3. Install Playwright Browsers (Optional)

Browsers are downloaded automatically on first run, but you can pre-install them:

```bash
npx playwright install
```

To install only specific browsers:
```bash
npx playwright install chromium firefox webkit
```

---

## Project Structure

```
fashion-test-playwright/
├── page_objects/                 # Page Object classes
│   ├── basePage.ts              # Base page with shared utilities
│   ├── loginPage.ts             # Login page object
│   └── homePage.ts              # Home/dashboard page object
├── tests/
│   ├── fixtures.ts              # Custom Playwright test fixtures
│   ├── login.spec.ts            # Login tests
│   ├── seed.spec.ts             # Seed/setup tests
│   └── example.spec.ts          # Example tests
├── playwright.config.ts         # Dynamic config router
├── playwright-test.config.ts    # Test environment configuration
├── playwright-stage.config.ts   # Staging environment configuration
├── playwright-prod.config.ts    # Production environment configuration
├── package.json                 # Dependencies and scripts
├── playwright-report/           # Test reports (generated)
├── test-results/                # Test results (generated)
└── README.md                    # This file
```

---

## Configuration

The project uses **separate configuration files per environment** for better isolation and control:

### Configuration Files

#### `playwright-test.config.ts` (Local/Test Environment)
- **baseURL**: `http://localhost:4000/fashionhub/`
- **Credentials**: `demouser` / `fashion123` (can override with `TEST_USERNAME`, `TEST_PASSWORD`)
- **Browsers**: Chromium, Firefox, WebKit
- **Workers**: Parallel execution enabled
- **Retries**: 0 locally, 2 on CI

#### `playwright-stage.config.ts` (Staging Environment)
- **baseURL**: `https://staging-env/fashionhub/`
- **Credentials**: `stageuser` / `stagepass123` (can override with `STAGE_USERNAME`, `STAGE_PASSWORD`)
- **Browsers**: Chromium, Firefox
- **Workers**: 2 parallel workers
- **Retries**: 1 by default, 2 on CI

#### `playwright-prod.config.ts` (Production Environment)
- **baseURL**: `https://pocketaces2.github.io/fashionhub/`
- **Credentials**: `demouser` / `fashion123` (can override with `PROD_USERNAME`, `PROD_PASSWORD`)
- **Browsers**: Chrome only
- **Workers**: 1 (serial execution to reduce load)
- **Retries**: 2 always
- **Additional**: Video recording and full screenshots enabled

#### `playwright.config.ts` (Dynamic Router)
- Automatically loads the appropriate config based on `TEST_ENV` variable
- Provides backward compatibility with environment variable approach

### Benefits of Per-Environment Configs

✅ **Isolated configuration** - Each environment has its own settings
✅ **Different browser sets** - Production runs only on Chrome, test runs on all browsers
✅ **Custom retry logic** - Production has more retries, test has none
✅ **Environment-specific credentials** - Separate credentials per environment
✅ **Optimized workers** - Production runs serially, test/stage run in parallel
✅ **Explicit control** - Use `--config` flag to specify exact environment

---

## Running Tests

### Quick Start

**Recommended approach:** Use npm scripts with explicit config files

```bash
# Test environment (localhost)
npm run test:test

# Staging environment
npm run test:stage

# Production environment
npm run test:prod
```

### Run on Test Environment

The test environment targets localhost.

#### Using npm script (Recommended):
```bash
npm run test:test
```

#### Using explicit config file:
```bash
npx playwright test --config=playwright-test.config.ts
```

#### Using environment variable (Legacy):
```bash
TEST_ENV=test npx playwright test
```

#### Run specific test file:
```bash
npm run test:test -- tests/login.spec.ts
```

#### Run in headed mode:
```bash
npm run test:test:headed
```

---

### Run on Staging Environment

#### Using npm script (Recommended):
```bash
npm run test:stage
```

#### Using explicit config file:
```bash
npx playwright test --config=playwright-stage.config.ts
```

#### Using environment variable (Legacy):
```bash
TEST_ENV=stage npx playwright test
```

#### Run with additional Playwright options:
```bash
npm run test:stage -- --project=chromium --headed
```

#### Run in headed mode:
```bash
npm run test:stage:headed
```

---

### Run on Production Environment

#### Using npm script (Recommended):
```bash
npm run test:prod
```

#### Using explicit config file:
```bash
npx playwright test --config=playwright-prod.config.ts
```

#### Using environment variable (Legacy):
```bash
TEST_ENV=prod npx playwright test
```

#### Run in headed mode:
```bash
npm run test:prod:headed
```

#### Override production credentials:
```bash
PROD_USERNAME=myuser PROD_PASSWORD=mypass npm run test:prod
```

---

### Run with Custom Parameters

#### Specify config and test file:
```bash
npx playwright test --config=playwright-prod.config.ts tests/login.spec.ts
```

#### Run in headed mode (see browser window):
```bash
npm run test:prod -- --headed
# or use the pre-configured script:
npm run test:prod:headed
```

#### Run in debug mode (step through code):
```bash
npm run test:debug
# or with specific config:
npx playwright test --config=playwright-test.config.ts --debug
```

#### Run with specific browser project:
```bash
npm run test:stage -- --project=chromium
```

#### Run single test by name:
```bash
npm run test:test -- -g "Happy path"
```

#### Run with verbose output:
```bash
npm run test:prod -- --verbose
```

#### Run with custom timeout:
```bash
npm run test:test -- --timeout=60000
```

#### Combined example (Production, Chrome, Headed, Verbose):
```bash
npx playwright test --config=playwright-prod.config.ts --project=chrome --headed --verbose
```

#### Run with UI mode (interactive):
```bash
npx playwright test --config=playwright-test.config.ts --ui
```

---

## Environment Variables

### Setting Environment Variables

#### macOS / Linux (Bash/Zsh):
```bash
# Inline for single command
TEST_ENV=prod npx playwright test

# Export for current shell session
export TEST_ENV=prod
npx playwright test
```

#### Windows (Command Prompt):
```bash
# Inline
set TEST_ENV=prod && npx playwright test

# Or using cross-env (recommended)
npx cross-env TEST_ENV=prod npx playwright test
```

#### Windows (PowerShell):
```bash
$env:TEST_ENV = 'prod'
npx playwright test
```

### Available Environment Variables

| Variable | Values | Default | Purpose |
|----------|--------|---------|---------|  
| `TEST_ENV` | `test`, `stage`, `prod` | `test` | Select target environment (for dynamic config router) |
| `TEST_USERNAME` | string | `demouser` | Override test environment username |
| `TEST_PASSWORD` | string | `fashion123` | Override test environment password |
| `STAGE_USERNAME` | string | `stageuser` | Override staging environment username |
| `STAGE_PASSWORD` | string | `stagepass123` | Override staging environment password |
| `PROD_USERNAME` | string | `demouser` | Override production environment username |
| `PROD_PASSWORD` | string | `fashion123` | Override production environment password |---

## Test Fixtures

This project uses **Playwright Test Fixtures** to provide pre-configured page objects to your tests automatically. Fixtures reduce boilerplate code and make tests cleaner and more maintainable.

### What are Fixtures?

Fixtures are a Playwright feature that allows you to:
- **Automatically set up test dependencies** (like page objects) before each test
- **Share common setup logic** across multiple tests
- **Inject dependencies** directly into test functions
- **Ensure proper cleanup** after tests complete

### Custom Fixtures (`tests/fixtures.ts`)

The project includes custom fixtures that automatically create and initialize page objects:

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../page_objects/loginPage';
import { HomePage } from '../page_objects/homePage';

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect };
```

### Available Fixtures

| Fixture | Type | Description | Auto-initialized |
|---------|------|-------------|------------------|
| `loginPage` | `LoginPage` | Login page object (call `.goto()` to navigate) | ✅ Yes |
| `homePage` | `HomePage` | Home/dashboard page object | ✅ Yes |
| `testUser` | `{ username, password }` | Environment-specific test credentials | ✅ Yes |
| `page` | `Page` | Playwright page instance (built-in) | ✅ Yes |
| `context` | `BrowserContext` | Browser context (built-in) | ✅ Yes |
| `browser` | `Browser` | Browser instance (built-in) | ✅ Yes |

### Using Fixtures in Tests

Instead of manually creating page objects in every test:

**❌ Without Fixtures (verbose):**
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page_objects/loginPage';
import { HomePage } from '../page_objects/homePage';

test('Login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  
  await loginPage.goto();
  await loginPage.submitCredentials('user', 'pass');
  // test logic...
});
```

**✅ With Fixtures (clean):**
```typescript
import { test, expect } from './fixtures';

test('Login test', async ({ loginPage, homePage }) => {
  // loginPage is already initialized and navigated to login.html
  await loginPage.submitCredentials('user', 'pass');
  // test logic...
});
```

### Benefits of Fixtures

1. **Less Boilerplate** — No need to instantiate page objects in every test
2. **Automatic Setup** — `loginPage` automatically navigates to the login page
3. **Consistent Initialization** — All tests use the same setup logic
4. **Better Readability** — Test code focuses on behavior, not setup
5. **Type Safety** — TypeScript provides autocomplete for fixtures
6. **Parallel Isolation** — Each test gets its own fresh page objects

### Creating Additional Fixtures

To add more fixtures (e.g., for a ProductPage):

1. **Update `tests/fixtures.ts`:**

```typescript
import { ProductPage } from '../page_objects/productPage';

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;  // Add new fixture type
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  productPage: async ({ page }, use) => {  // Add new fixture
    const productPage = new ProductPage(page);
    await use(productPage);
  },
});
```

2. **Use in tests:**

```typescript
test('Product test', async ({ productPage }) => {
  await productPage.searchProduct('Shoes');
  // test logic...
});
```

### Fixture Lifecycle

Fixtures follow this lifecycle:

1. **Setup** — Fixture is created before the test runs
2. **Use** — Test receives the fixture and uses it
3. **Teardown** — Fixture is cleaned up after the test completes

```typescript
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    // 1. SETUP: Create and initialize
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // 2. USE: Pass to test
    await use(loginPage);
    
    // 3. TEARDOWN: Cleanup (if needed)
    // Optional cleanup code here
  },
});
```

### Advanced Fixture Patterns

#### Worker-Scoped Fixtures

For expensive setup that can be shared across tests:

```typescript
export const test = base.extend<{}, { adminToken: string }>({
  adminToken: [async ({}, use) => {
    const token = await authenticateAdmin();
    await use(token);
  }, { scope: 'worker' }],
});
```

#### Dependent Fixtures

Fixtures can depend on other fixtures:

```typescript
export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ loginPage, page }, use) => {
    await loginPage.submitCredentials('admin', 'admin123');
    await use(page);
  },
});
```

---

## Page Objects

The test suite uses the **Page Object Model (POM)** pattern for maintainable and reusable test code.

### BasePage (`page_objects/basePage.ts`)

Base class with common utilities inherited by all page objects:

- `goto(path)` — navigate to a relative path
- `waitForVisible(locator)` — wait for element visibility
- `fillInput(locator, value)` — fill with auto scroll-into-view
- `click(locator, waitForNav?)` — click element, optionally wait for navigation
- `getCount(locator)` — get element count
- `isVisible(locator)` — check if element is visible
- `getText(locator)` — get element text content
- `waitForURL(pattern)` — wait for URL to match pattern
- `waitForLoadState(state)` — wait for page load state

### LoginPage (`page_objects/loginPage.ts`)

Login form page object with methods:

- `goto()` — navigate to login page
- `fillCredentials(username, password)` — fill login form
- `submit()` — click login button and wait for navigation
- `submitCredentials(username, password)` — fill and submit in one call
- `hasAlert()` — check if error alert is present
- `getAlertText()` — get alert message text

**Properties:**
- `username` — username input field
- `password` — password input field
- `loginBtn` — login button
- `heading` — page heading
- `alert` — error alert element

### HomePage (`page_objects/homePage.ts`)

Home/dashboard page object with methods:

- `isLoggedIn()` — check if user is logged in (login heading absent)
- `isLoginHeadingHidden()` — verify login heading is not visible
- `getLoginHeadingCount()` — get count of login headings

**Properties:**
- `loginHeading` — login page heading (should be absent after login)

---

## Test Examples

### Example 1: Happy Path Login Test (Using Fixtures)

```typescript
import { test, expect } from './fixtures';

test.describe('Login page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Happy path — Successful login', async ({ loginPage, homePage, testUser }) => {
    // testUser fixture provides environment-specific credentials
    await loginPage.submitCredentials(testUser.username, testUser.password);

    await expect(loginPage.heading).toHaveCount(0);
    expect(await homePage.isLoggedIn()).toBe(true);
  });
});
```

### Example 2: Negative Path - Invalid Password (Using Fixtures)

```typescript
import { test, expect } from './fixtures';

test.describe('Login page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('Negative — Incorrect password', async ({ loginPage, testUser }) => {
    // Use testUser for username, but wrong password
    await loginPage.fillCredentials(testUser.username, 'wrongpassword');
    await loginPage.loginBtn.click();
    await loginPage.page.waitForLoadState('networkidle');

    await expect(loginPage.heading).toBeVisible();
    
    if (await loginPage.hasAlert()) {
      await expect(loginPage.alert.first()).toBeVisible();
    }
  });
});
```

### Example 3: Without Fixtures (Manual Setup)

If you prefer not to use fixtures, you can manually create page objects:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page_objects/loginPage';
import { HomePage } from '../page_objects/homePage';

test('Manual setup example', async ({ page }) => {
  const login = new LoginPage(page);
  const home = new HomePage(page);

  await login.goto();
  await login.submitCredentials('demouser', 'fashion123');

  await expect(page).not.toHaveURL(/login.html/);
  await expect(login.heading).toHaveCount(0);
  
  const loggedIn = await home.isLoggedIn();
  expect(loggedIn).toBe(true);
});
```

### Example 4: Environment-Specific Logic with Fixtures

```typescript
import { test, expect } from './fixtures';

test('Test with environment check', async ({ loginPage, page, baseURL }) => {
  console.log('Running test against:', baseURL);
  
  // loginPage fixture already navigated to login.html
  await loginPage.submitCredentials('demouser', 'fashion123');
  
  // Test logic here
});
```

### Example 5: Multiple Tests Using Same Fixtures

```typescript
import { test, expect } from './fixtures';

test.describe('Login validation', () => {
  test('Valid credentials', async ({ loginPage, homePage }) => {
    await loginPage.submitCredentials('demouser', 'fashion123');
    expect(await homePage.isLoggedIn()).toBe(true);
  });

  test('Invalid credentials', async ({ loginPage }) => {
    await loginPage.submitCredentials('wronguser', 'wrongpass');
    await expect(loginPage.heading).toBeVisible();
    expect(await loginPage.hasAlert()).toBe(true);
  });

  test('Empty credentials', async ({ loginPage }) => {
    await loginPage.submitCredentials('', '');
    await expect(loginPage.heading).toBeVisible();
  });
});
```

---

## Debugging Tests

### Debug Mode (Step Through Code)

```bash
npm run test:test -- --debug
```

This opens the Playwright Inspector where you can:
- Step through code line by line
- See live DOM snapshot
- Evaluate expressions in the console
- Pause/resume execution

### Headed Mode (See Browser)

```bash
npm run test:test -- --headed
```

Watch the browser execute tests in real-time.

### Headed + Debug Mode:
```bash
npm run test:test -- --headed --debug
```

### View Test Report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

### View Trace Files

Trace files capture detailed execution logs. View them:

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Print Console Logs

Add debugging output in your tests:

```typescript
test('Test with logs', async ({ page }) => {
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());
});
```

Run with verbose flag to see logs:
```bash
npm run test:test -- --verbose
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        env: [test, stage, prod]
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npx playwright install --with-deps
      
      - run: npm run test:${{ matrix.env }}
        env:
          TEST_ENV: ${{ matrix.env }}
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report-${{ matrix.env }}
          path: playwright-report/
          retention-days: 30
```

### Running Tests in CI

```bash
# Install dependencies
npm ci

# Run all tests on test environment
npm run test:test

# Or run on specific environment
TEST_ENV=prod npm run test:prod
```

---

## Troubleshooting

### Issue: "baseURL is not set"

**Solution:** Ensure `playwright.config.ts` is in the project root and `TEST_ENV` is properly set.

```bash
# Verify config is loaded
TEST_ENV=prod npx playwright test --verbose
```

### Issue: "Cannot find module 'page_objects'"

**Solution:** Ensure `page_objects/` folder is at the project root and imports use relative paths:

```typescript
// Correct:
import { LoginPage } from '../page_objects/loginPage';

// Incorrect:
import { LoginPage } from './page_objects/loginPage';
```

### Issue: "Element not found" or "Timeout exceeded"

**Solution:** 
1. Verify the application is running (for test environment)
2. Use `--headed` mode to see what's happening
3. Add explicit waits: `await page.waitForLoadState('networkidle')`

```bash
npm run test:test -- --headed --project=chromium
```

### Issue: Tests pass locally but fail in CI

**Solution:** 
1. Ensure all dependencies are installed: `npm ci`
2. Install Playwright browsers: `npx playwright install --with-deps`
3. Set `TEST_ENV` explicitly in CI pipeline
4. Check CI logs for specific error messages

### Issue: "cross-env command not found"

**Solution:** Re-install dev dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Different behavior on Windows vs macOS

**Solution:** `cross-env` handles environment variables consistently. Use it:

```bash
npm install --save-dev cross-env
npm run test:prod  # Uses cross-env internally
```

### Check Current Configuration

Print current environment and baseURL being used:

```bash
TEST_ENV=prod npx playwright test tests/login.spec.ts --verbose
```

Look for output lines:
```
env debug: TEST_ENV= prod
Selected testEnv: prod
Using baseURL: https://pocketaces2.github.io/fashionhub/
```

---

## Common Commands Reference

| Command | Purpose |
|---------|---------|  
| `npm install` | Install all dependencies |
| `npm run test:test` | Run tests on test environment |
| `npm run test:stage` | Run tests on staging environment |
| `npm run test:prod` | Run tests on production environment |
| `npm run test:test:headed` | Run tests on test environment (headed mode) |
| `npm run test:stage:headed` | Run tests on staging environment (headed mode) |
| `npm run test:prod:headed` | Run tests on production environment (headed mode) |
| `npm run test:debug` | Run tests in debug mode |
| `npm test` | Run all tests (default config) |
| `npx playwright test --config=playwright-test.config.ts` | Run with explicit test config |
| `npx playwright test --config=playwright-prod.config.ts` | Run with explicit prod config |
| `npx playwright test --ui` | Run tests in UI mode (interactive) |
| `npx playwright show-report` | View HTML test report |
| `npx playwright install` | Install browsers |
| `TEST_ENV=prod npx playwright test` | Run using dynamic router config |---

## Best Practices

1. **Use explicit config files** — Prefer `--config=playwright-test.config.ts` over environment variables for clarity
2. **Use Fixtures** — Leverage test fixtures (`loginPage`, `homePage`, `testUser`) for cleaner test code
3. **Environment-specific credentials** — Use `testUser` fixture to get correct credentials per environment
4. **Always use Page Objects** — Don't interact with elements directly in tests
5. **Use relative paths** — `goto('login.html')` instead of absolute URLs to leverage baseURL
6. **Wait for elements** — Use `waitForVisible()` instead of hardcoded sleeps
7. **Separate configs per environment** — Keep environment-specific settings isolated
8. **Meaningful assertions** — Assert user-visible changes, not implementation details
9. **Override credentials via env vars** — For production: `PROD_USERNAME=user PROD_PASSWORD=pass npm run test:prod`
10. **Run in CI** — Automate test runs on each commit/PR with appropriate config
11. **Review traces** — Use trace files to debug failures
12. **Use beforeEach for navigation** — Call `loginPage.goto()` in `beforeEach` hook for consistent test setup

---

## Support & Contributing

For issues, questions, or contributions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review [Playwright Documentation](https://playwright.dev)
3. Open an issue in the repository
4. Submit a pull request with improvements

---

## License

Sergiy Kucheryavyy

---

**Last Updated:** November 2025  
**Playwright Version:** 1.56.1+

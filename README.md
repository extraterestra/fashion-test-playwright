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
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Dependencies and scripts
├── playwright-report/           # Test reports (generated)
├── test-results/                # Test results (generated)
└── README.md                    # This file
```

---

## Configuration

### Playwright Config (`playwright.config.ts`)

The configuration file handles:
- **baseURL selection** based on the `TEST_ENV` environment variable
- **Browser configurations** (Chromium, Firefox, WebKit)
- **Timeout settings** and retry logic
- **Test environment detection** with multiple fallback methods

**Supported Environments:**
```typescript
test: 'http://localhost:4000/fashionhub'
stage: 'https://staging-env/fashionhub/'
prod: 'https://pocketaces2.github.io/fashionhub/'
```

**Environment Detection Order:**
1. `TEST_ENV` environment variable
2. `npm_config_test_env` (npm script variable)
3. `PLAYWRIGHT_TEST_ENV` environment variable
4. Command-line argument `--test-env=<env>`
5. Default: `test`

---

## Running Tests

### Run on Test Environment

The test environment targets localhost and is the default.

#### Using npm script:
```bash
npm run test:test
```

#### Using environment variable:
```bash
TEST_ENV=test npx playwright test
```

#### Run specific test file:
```bash
npm run test:test -- tests/login.spec.ts
```

---

### Run on Staging Environment

#### Using npm script:
```bash
npm run test:stage
```

#### Using environment variable:
```bash
TEST_ENV=stage npx playwright test
```

#### Run with additional Playwright options:
```bash
npm run test:stage -- --project=chromium --headed
```

---

### Run on Production Environment

#### Using npm script:
```bash
npm run test:prod
```

#### Using environment variable:
```bash
TEST_ENV=prod npx playwright test
```

#### Run with specific browser and headed mode (visible browser):
```bash
npm run test:prod -- --project=firefox --headed
```

---

### Run with Custom Parameters

#### Specify environment and test file:
```bash
TEST_ENV=prod npx playwright test tests/login.spec.ts
```

#### Run in headed mode (see browser window):
```bash
npm run test:prod -- --headed
```

#### Run in debug mode (step through code):
```bash
npm run test:test -- --debug
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

#### Combined example (Production, Firefox, Headed, Verbose):
```bash
TEST_ENV=prod npx playwright test --project=firefox --headed --verbose
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
| `TEST_ENV` | `test`, `stage`, `prod` | `test` | Select target environment |
| `PLAYWRIGHT_TEST_ENV` | `test`, `stage`, `prod` | N/A | Alternative env var for TEST_ENV |

---

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
| `loginPage` | `LoginPage` | Login page object, navigates to login.html | ✅ Yes |
| `homePage` | `HomePage` | Home/dashboard page object | ✅ Yes |
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

test('Happy path — Successful login', async ({ loginPage, homePage }) => {
  // loginPage is already initialized and navigated to login.html
  await loginPage.submitCredentials('demouser', 'fashion123');

  await expect(loginPage.heading).toHaveCount(0);
  expect(await homePage.isLoggedIn()).toBe(true);
});
```

### Example 2: Negative Path - Invalid Password (Using Fixtures)

```typescript
import { test, expect } from './fixtures';

test('Negative — Incorrect password', async ({ loginPage }) => {
  // loginPage is already on login.html
  await loginPage.fillCredentials('demouser', 'wrongpassword');
  await loginPage.loginBtn.click();
  await loginPage.page.waitForLoadState('networkidle');

  await expect(loginPage.heading).toBeVisible();
  
  if (await loginPage.hasAlert()) {
    await expect(loginPage.alert.first()).toBeVisible();
  }
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
| `npm test` | Run all tests (test environment) |
| `npx playwright test --headed` | Run tests with visible browser |
| `npx playwright test --debug` | Run tests in debug mode |
| `npx playwright show-report` | View HTML test report |
| `npx playwright install` | Install browsers |
| `TEST_ENV=prod npx playwright test` | Run on production with inline env var |

---

## Best Practices

1. **Use Fixtures** — Leverage test fixtures for automatic page object setup and cleaner test code
2. **Always use Page Objects** — Don't interact with elements directly in tests
3. **Use relative paths** — `goto('login.html')` instead of absolute URLs
4. **Wait for elements** — Use `waitForVisible()` instead of hardcoded sleeps
5. **Test environments** — Keep test, staging, and production URLs in config
6. **Meaningful assertions** — Assert user-visible changes, not implementation details
7. **Reuse credentials** — Store test credentials in environment or config (never hardcode secrets)
8. **Run in CI** — Automate test runs on each commit/PR
9. **Review traces** — Use trace files to debug failures
10. **Fixture scope** — Use test-scoped fixtures for isolated state, worker-scoped for shared expensive setup

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

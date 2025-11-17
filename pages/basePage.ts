import { Page, Locator } from '@playwright/test';

/**
 * BasePage provides common functionality for all page objects.
 * All page objects should extend this class to inherit shared methods.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a relative URL using the configured baseURL.
   * @param path - relative path (e.g., 'login.html', 'home.html')
   */
  async goto(path: string): Promise<void> {
    console.log('Attempting navigation to path:', path);
    try {
      await this.page.goto(path);
      console.log('Successfully navigated to:', this.page.url());
    } catch (error) {
      console.error('Navigation failed:', error instanceof Error ? error.message : error);
      throw error;
    }
  }

  /**
   * Get current page URL.
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for a locator to be visible with optional timeout.
   * @param locator - Playwright locator
   * @param timeoutMs - timeout in milliseconds (optional)
   */
  async waitForVisible(locator: Locator, timeoutMs?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  /**
   * Wait for a locator to be hidden with optional timeout.
   * @param locator - Playwright locator
   * @param timeoutMs - timeout in milliseconds (optional)
   */
  async waitForHidden(locator: Locator, timeoutMs?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout: timeoutMs });
  }

  /**
   * Fill a text input with a value.
   * @param locator - Playwright locator
   * @param value - text to fill
   */
  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
  }

  /**
   * Click an element and optionally wait for navigation.
   * @param locator - Playwright locator
   * @param waitForNav - if true, waits for networkidle navigation (default: false)
   */
  async click(locator: Locator, waitForNav: boolean = false): Promise<void> {
    if (waitForNav) {
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
        locator.click(),
      ]);
    } else {
      await locator.click();
    }
  }

  /**
   * Get the count of elements matching a locator.
   * @param locator - Playwright locator
   */
  async getCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Check if a locator is visible.
   * @param locator - Playwright locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Get text content of a locator.
   * @param locator - Playwright locator
   */
  async getText(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }

  /**
   * Wait for page to reach a specific URL pattern.
   * @param urlPattern - regex pattern or string to match URL
   * @param timeoutMs - timeout in milliseconds (optional)
   */
  async waitForURL(urlPattern: string | RegExp, timeoutMs?: number): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout: timeoutMs });
  }

  /**
   * Wait for page load state (e.g., 'load', 'domcontentloaded', 'networkidle').
   * @param state - load state type
   */
  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle'): Promise<void> {
    await this.page.waitForLoadState(state);
  }
}

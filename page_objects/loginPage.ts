import { Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

/**
 * LoginPage represents the login form page.
 * Provides methods to interact with login elements and perform authentication.
 */
export class LoginPage extends BasePage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;
  readonly heading: Locator;
  readonly alert: Locator;

  constructor(page: any) {
    super(page);
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.heading = page.getByRole('heading', { name: 'Login to FashionHub' });
    this.alert = page.getByText('Invalid username or password.', { exact: true });
  }

  /**
   * Navigate to the login page.
   * Uses relative path so baseURL is respected and preserves path segments.
   */
  async goto(): Promise<void> {
    await super.goto('login.html');
    await expect(this.heading).toBeVisible();
  }

  /**
   * Fill username and password fields (does not submit).
   * @param username - username value to fill
   * @param password - password value to fill
   */
  async fillCredentials(username: string, password: string): Promise<void> {
    await this.waitForVisible(this.username);
    await this.waitForVisible(this.password);
    await this.fillInput(this.username, username);
    await this.fillInput(this.password, password);
  }

  /**
   * Click the login button and wait for navigation.
   * Waits for networkidle to ensure page load completes.
   */
  async submit(): Promise<void> {
    await this.click(this.loginBtn, true);
  }

  /**
   * Fill credentials and submit login form (convenience method).
   * @param username - username value to fill
   * @param password - password value to fill
   */
  async submitCredentials(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.submit();
  }

  /**
   * Check if an alert/error message is present on the page.
   * @returns boolean - true if alert element is visible
   */
  async hasAlert(): Promise<boolean> {
    return (await this.getCount(this.alert)) > 0;
  }

  /**
   * Get text content of the alert/error message.
   * @returns string | null - alert text or null if no alert present
   */
  async getAlertText(): Promise<string | null> {
    if ((await this.getCount(this.alert)) === 0) return null;
    return (await this.getText(this.alert.first())) ?? null;
  }
}
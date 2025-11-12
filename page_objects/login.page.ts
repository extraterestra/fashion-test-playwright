import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

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
    this.alert = page.getByRole('alert');
  }

  // Navigate to the login page (relative path so baseURL is respected).
  async goto(): Promise<void> {
    await super.goto('login.html');
    await expect(this.heading).toBeVisible();
  }

  // Fill inputs (does not submit)
  async fillCredentials(username: string, password: string): Promise<void> {
    await this.waitForVisible(this.username);
    await this.waitForVisible(this.password);
    await this.fillInput(this.username, username);
    await this.fillInput(this.password, password);
  }

  // Click login and wait for navigation (if any)
  async submit(): Promise<void> {
    await this.click(this.loginBtn, true);
  }

  // Convenience: fill and submit
  async submitCredentials(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.submit();
  }

  // Helpers for assertions
  async hasAlert(): Promise<boolean> {
    return (await this.getCount(this.alert)) > 0;
  }

  async getAlertText(): Promise<string | null> {
    if ((await this.getCount(this.alert)) === 0) return null;
    return (await this.getText(this.alert.first())) ?? null;
  }
}
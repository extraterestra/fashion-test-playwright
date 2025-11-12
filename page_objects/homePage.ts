import { Locator } from '@playwright/test';
import { BasePage } from './basePage';

/**
 * HomePage represents the home/dashboard page after successful login.
 * This page is accessible only when the user is authenticated.
 */
export class HomePage extends BasePage {
  readonly loginHeading: Locator;

  constructor(page: any) {
    super(page);
    this.loginHeading = page.getByRole('heading', { name: 'Login to FashionHub' });
  }

  /**
   * Check if the user is logged in.
   * Returns true when the login heading is no longer visible on the page.
   * @returns boolean - true if logged in (login heading absent), false otherwise
   */
  async isLoggedIn(): Promise<boolean> {
    const headingCount = await this.getCount(this.loginHeading);
    return headingCount === 0;
  }

  /**
   * Verify that the login heading is not visible.
   * Useful for explicit assertions in tests.
   * @returns boolean - true if login heading is hidden
   */
  async isLoginHeadingHidden(): Promise<boolean> {
    return !(await this.isVisible(this.loginHeading));
  }

  /**
   * Get the count of login headings on the page.
   * Helps identify if multiple headings exist (edge case detection).
   * @returns number - count of login headings
   */
  async getLoginHeadingCount(): Promise<number> {
    return await this.getCount(this.loginHeading);
  }
}
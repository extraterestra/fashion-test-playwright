import { Locator } from '@playwright/test';
import { BasePage } from './basePage';

/**
 * HomePage represents the home/dashboard page after successful login.
 * This page is accessible only when the user is authenticated.
 */
export class HomePage extends BasePage {
  readonly loginHeading: Locator;
  readonly welcomeMsg: Locator;

  constructor(page: any) {
    super(page);
    this.loginHeading = page.getByRole('heading', { name: 'Login to FashionHub' });
    this.welcomeMsg = page.getByText('Welcome, testUser!', { exact: true });
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

  /**
   * Check if an welcome message is present on the page.
   * @returns boolean - true if welcome message element is visible
   */
  async hasWelcomeMessage(): Promise<boolean> {
    return (await this.getCount(this.welcomeMsg)) > 0;
  }

  /**
   * Verify user is logged in by checking login heading is gone and welcome message appears.
   * @returns Promise<void>
   */
  async verifyUserLoggedIn(): Promise<void> {
    const isLoggedIn = await this.isLoggedIn();
    if (!isLoggedIn) {
      throw new Error('User is not logged in - login heading is still visible');
    }
    const hasWelcome = await this.hasWelcomeMessage();
    if (!hasWelcome) {
      throw new Error('Welcome message is not visible');
    }
  }
}
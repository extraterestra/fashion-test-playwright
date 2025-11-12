import { Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  readonly loginHeading: Locator;

  constructor(page: any) {
    super(page);
    // This is the login heading: after login it should disappear from the page.
    this.loginHeading = page.getByRole('heading', { name: 'Login to FashionHub' });
  }

  // Returns true when the login heading is gone (i.e., likely logged in).
  async isLoggedIn(): Promise<boolean> {
    return (await this.getCount(this.loginHeading)) === 0;
  }
}
import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly loginHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    // This is the login heading: after login it should disappear from the page.
    this.loginHeading = page.getByRole('heading', { name: 'Login to FashionHub' });
  }

  // Returns true when the login heading is gone (i.e., likely logged in).
  async isLoggedIn(): Promise<boolean> {
    return (await this.loginHeading.count()) === 0;
  }
}
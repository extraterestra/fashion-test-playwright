import { test, expect } from '@playwright/test';

test.describe('Link Status Codes', () => {
  test('should verify all links return valid status codes (200 or 30x)', async ({ page }) => {
    // Navigate to home page
    await page.goto('https://pocketaces2.github.io/fashionhub/');
    await page.waitForLoadState('networkidle');

    // Get all links on the page
    const links = await page.locator('a[href]').all();
    const linkHrefs: string[] = [];

    // Extract href attributes
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        linkHrefs.push(href);
      }
    }

    console.log(`Found ${linkHrefs.length} links to check`);

    const results: { url: string; status: number; success: boolean }[] = [];
    const baseUrl = 'https://pocketaces2.github.io/fashionhub/';

    // Check each link
    for (const href of linkHrefs) {
      // Convert relative URLs to absolute
      const absoluteUrl = href.startsWith('http') ? href : new URL(href, baseUrl).toString();

      try {
        const response = await page.goto(absoluteUrl, { waitUntil: 'networkidle', timeout: 10000 });
        const status = response?.status() || 0;
        
        // Valid status codes: 200-299 (success) or 300-399 (redirects)
        const isValid = (status >= 200 && status < 400);
        const is4xx = (status >= 400 && status < 500);

        results.push({ url: absoluteUrl, status, success: isValid });

        if (is4xx) {
          console.error(`❌ 40x Error - ${absoluteUrl}: ${status}`);
        } else if (isValid) {
          console.log(`✅ Valid - ${absoluteUrl}: ${status}`);
        } else {
          console.warn(`⚠️  Unexpected - ${absoluteUrl}: ${status}`);
        }
      } catch (error) {
        console.error(`❌ Failed to load ${absoluteUrl}:`, error instanceof Error ? error.message : error);
        results.push({ url: absoluteUrl, status: 0, success: false });
      }
    }

    // Assert all links returned valid status codes
    const failedLinks = results.filter(r => !r.success);
    const links4xx = results.filter(r => r.status >= 400 && r.status < 500);

    expect(links4xx, `Found ${links4xx.length} links with 40x errors: ${links4xx.map(l => `${l.url} (${l.status})`).join(', ')}`).toHaveLength(0);
    expect(failedLinks, `Found ${failedLinks.length} failed links: ${failedLinks.map(l => `${l.url} (${l.status})`).join(', ')}`).toHaveLength(0);
  });

  test('should verify specific links return expected status codes', async ({ page, request }) => {
    const linksToCheck = [
      { url: 'https://pocketaces2.github.io/fashionhub/', expectedRange: [200, 399] },
      { url: 'https://pocketaces2.github.io/fashionhub/about.html', expectedRange: [200, 399] },
      { url: 'https://pocketaces2.github.io/fashionhub/login.html', expectedRange: [200, 399] },
    ];

    for (const linkInfo of linksToCheck) {
      const response = await request.get(linkInfo.url);
      const status = response.status();

      console.log(`${linkInfo.url}: ${status}`);

      expect(status, `Expected ${linkInfo.url} to return status in range ${linkInfo.expectedRange[0]}-${linkInfo.expectedRange[1]}, but got ${status}`)
        .toBeGreaterThanOrEqual(linkInfo.expectedRange[0]);
      
      expect(status, `Expected ${linkInfo.url} to return status in range ${linkInfo.expectedRange[0]}-${linkInfo.expectedRange[1]}, but got ${status}`)
        .toBeLessThanOrEqual(linkInfo.expectedRange[1]);

      // Specifically check it's not a 40x error
      expect(status, `Expected ${linkInfo.url} to not return 40x status code, but got ${status}`)
        .not.toBeGreaterThanOrEqual(400);
    }
  });
});

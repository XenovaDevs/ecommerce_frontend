import { expect, test } from '@playwright/test';

const publicRoutes = ['/', '/products', '/categories', '/contact', '/cart'];

test.describe('Responsive smoke', () => {
  for (const route of publicRoutes) {
    test(`should not have horizontal overflow on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(250);

      const horizontalOverflow = await page.evaluate(() => {
        return Math.max(
          0,
          document.documentElement.scrollWidth - window.innerWidth
        );
      });

      expect(horizontalOverflow).toBeLessThanOrEqual(1);
    });
  }

  test('mobile menu should open and render links on mobile projects', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.toLowerCase().includes('mobile'));

    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    const menuButton = page.locator('header button[aria-expanded]').first();

    await expect(menuButton).toBeVisible();
    await menuButton.click();

    await expect(page.getByRole('link', { name: /productos/i }).first()).toBeVisible();
  });
});

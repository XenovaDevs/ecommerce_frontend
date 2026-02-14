import { test, expect } from '@playwright/test';

const statusRoutes = ['/checkout/success', '/checkout/failure', '/checkout/pending'];

test.describe('Páginas de estado de checkout', () => {
  for (const route of statusRoutes) {
    test(`debe cargar ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});

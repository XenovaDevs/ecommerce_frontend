import { test, expect } from '@playwright/test';
import { STORAGE_KEYS } from '@/constants';
import { loginAsCustomer } from './utils/api';

const accountRoutes = ['/profile', '/addresses', '/orders', '/wishlist'];

test.describe('Páginas de cuenta autenticadas', () => {
  test.beforeEach(async ({ page }) => {
    const { token } = await loginAsCustomer();
    await page.context().addCookies([
      {
        name: STORAGE_KEYS.AUTH_TOKEN,
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);
  });

  for (const route of accountRoutes) {
    test(`debe cargar ${route}`, async ({ page }) => {
      const res = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(res?.ok()).toBeTruthy();
      expect(page.url()).not.toMatch(/login/);
      await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    });
  }
});

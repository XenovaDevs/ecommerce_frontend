import { test, expect } from '@playwright/test';
import { STORAGE_KEYS } from '@/constants';
import { loginAsCustomer } from './utils/api';

const protectedRoutes = ['/profile', '/orders', '/addresses', '/wishlist', '/checkout'];

async function loginUI(page) {
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
}

test.describe('Guardas de ruta', () => {
  test.describe('Usuarios no autenticados', () => {
    for (const route of protectedRoutes) {
      test(`debe redirigir a login desde ${route}`, async ({ page }) => {
        await page.goto(route);
        const current = page.url();
        if (!/login/.test(current)) {
          await expect(page.locator('body')).toBeVisible();
        } else {
          await expect(page).toHaveURL(/login/);
        }
      });
    }
  });

  test.describe('Usuarios autenticados', () => {
    test.beforeEach(async ({ page }) => {
      await loginUI(page);
    });

    for (const route of protectedRoutes) {
      test(`debe permitir acceso a ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).not.toMatch(/login/);
        await expect(page.locator('body')).toBeVisible();
      });
    }
  });
});

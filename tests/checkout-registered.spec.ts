import { test, expect } from '@playwright/test';
import { STORAGE_KEYS } from '@/constants';
import { ensureCartWithItem, getFirstProduct, loginAsCustomer, newApiContext } from './utils/api';

let token: string = '';

test.describe('Checkout con usuario registrado', () => {
  test.beforeAll(async () => {
    const auth = await loginAsCustomer();
    token = auth.token;
    const api = await newApiContext(token);
    const product = await getFirstProduct(api);
    if (product?.id) {
      await ensureCartWithItem(api, String(product.id));
    }
  });

  test.beforeEach(async ({ page }) => {
    test.skip(!token, 'Login API no disponible');
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

  test('debe acceder al checkout autenticado', async ({ page }) => {
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('debe acceder al listado de pedidos', async ({ page }) => {
    await page.goto('/orders', { waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(/login/);
    await expect(page.locator('body')).toBeVisible();
  });
});

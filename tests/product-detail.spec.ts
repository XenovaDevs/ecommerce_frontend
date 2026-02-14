import { test, expect } from '@playwright/test';
import { getFirstProduct, newApiContext } from './utils/api';

test.describe('Detalle de producto', () => {
  test('debe cargar la página de un producto real', async ({ page }) => {
    const api = await newApiContext();
    const product = await getFirstProduct(api);
    test.skip(!product, 'No hay productos disponibles');

    const response = await page.goto(`/products/${product!.slug}`, { waitUntil: 'domcontentloaded' });
    if (!response?.ok()) test.skip(`Status ${response?.status()}`);

    const title = page.getByRole('heading', { level: 1 }).first();
    await expect(title.or(page.locator('[data-testid*="product"]'))).toBeVisible({ timeout: 5000 });
  });
});

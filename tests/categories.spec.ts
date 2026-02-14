import { test, expect } from '@playwright/test';
import { getFirstCategory, newApiContext } from './utils/api';

test.describe('Categorías', () => {
  test('lista de categorías', async ({ page }) => {
    const res = await page.goto('/categories', { waitUntil: 'domcontentloaded' });
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
  });

  test('detalle de categoría existente', async ({ page }) => {
    const api = await newApiContext();
    const category = await getFirstCategory(api);
    expect(category).toBeTruthy();

    const res = await page.goto(`/categories/${category!.slug}`, { waitUntil: 'domcontentloaded' });
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator('[data-testid*="category"], h1, h2')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

const publicRoutes = [
  '/',
  '/products',
  '/categories',
  '/contact',
  '/cart',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

test.describe('Rutas públicas', () => {
  for (const route of publicRoutes) {
    test(`debe cargar ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.ok(), `respuesta HTTP para ${route}`).toBeTruthy();
      await expect(page.locator('body')).toBeVisible();
    });
  }
});

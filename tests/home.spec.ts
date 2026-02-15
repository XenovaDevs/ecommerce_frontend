import { test, expect } from '@playwright/test';

test.describe('Pagina de Inicio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe cargar la pagina principal correctamente', async ({ page }) => {
    await expect(page).toHaveTitle(/Le Pas Sage/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /explorar/i })).toBeVisible();
  });

  test('debe mostrar barra de confianza', async ({ page }) => {
    const labels = [/envio|envio gratis/i, /compra segura/i, /pagos|tarjetas/i, /soporte/i];
    const matches = await Promise.all(
      labels.map(async (regex) => {
        const item = page.getByText(regex).first();
        return (await item.count()) > 0 && (await item.isVisible().catch(() => false));
      })
    );

    expect(matches.some(Boolean)).toBeTruthy();
  });

  test('debe navegar a productos desde CTA principal', async ({ page }) => {
    const productsLink = page
      .getByRole('link', { name: /explorar coleccion|explorar colección|ver productos/i })
      .first();
    await expect(productsLink).toBeVisible();
    await productsLink.click();
    await page.waitForURL('**/products');
    expect(page.url()).toContain('/products');
  });

  test('debe navegar a categorias', async ({ page }) => {
    const categoriesLink = page.locator('a[href="/categories"]:visible').first();
    await expect(categoriesLink).toBeVisible();
    await categoriesLink.click();
    await page.waitForURL('**/categories');
    expect(page.url()).toContain('/categories');
  });

  test('debe tener inputs interactivos visibles', async ({ page }) => {
    const inputsCount = await page.locator('input:visible').count();
    expect(inputsCount).toBeGreaterThan(0);
  });

  test('debe tener navegacion principal visible', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('debe mostrar bloque de destacados', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /fragancias que inspiran/i })).toBeVisible();
  });

  test('debe tener footer visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });
});

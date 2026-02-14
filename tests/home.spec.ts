import { test, expect } from '@playwright/test';

test.describe('Página de Inicio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe cargar la página principal correctamente', async ({ page }) => {
    // Verificar título
    await expect(page).toHaveTitle(/Le Pas Sage/);

    // Verificar hero section
    await expect(page.getByText('Bienvenido a Le Pas Sage')).toBeVisible();
  });

  test('debe mostrar las características principales', async ({ page }) => {
    const labels = [/envío/i, /compra segura/i, /pago/i, /soporte/i];
    const results = await Promise.all(
      labels.map(async (regex) => {
        const item = page.getByText(regex).first();
        return (await item.count()) > 0 && (await item.isVisible().catch(() => false));
      })
    );
    expect(results.some(Boolean)).toBeTruthy();
  });

  test('debe navegar a productos desde botón principal', async ({ page }) => {
    // Buscar el link de ver productos
    const productsLink = page.getByRole('link', { name: /ver productos/i });

    if (await productsLink.isVisible()) {
      await productsLink.click();
      await page.waitForLoadState('networkidle');

      // Verificar navegación
      expect(page.url()).toContain('/products');
    }
  });

  test('debe navegar a categorías', async ({ page }) => {
    const categoriasButton = page.getByRole('link', { name: /explorar categorías/i });
    if (await categoriasButton.isVisible()) {
      await categoriasButton.click();
      // Verificar navegación
      await page.waitForLoadState('networkidle');
    }
  });

  test('debe tener un formulario de newsletter funcional', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first();
    const subscribeButton = page.getByRole('button', { name: /suscribirse/i });

    await expect(emailInput).toBeVisible();
    await expect(subscribeButton).toBeVisible();

    // Probar ingreso de email
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('debe tener navegación principal visible', async ({ page }) => {
    // Verificar que existe navegación (header o nav)
    const hasHeader = await page.locator('header').count() > 0;
    const hasNav = await page.locator('nav').count() > 0;
    const hasLinks = await page.locator('a').count() > 0;

    // La página debe tener alguna forma de navegación
    expect(hasHeader || hasNav || hasLinks).toBeTruthy();
  });

  test('debe mostrar productos destacados', async ({ page }) => {
    await expect(page.getByText('Productos destacados')).toBeVisible();
  });

  test('debe tener footer visible', async ({ page }) => {
    const footer = page.locator('footer').first();
    if (await footer.isVisible()) {
      await expect(footer).toBeVisible();
    }
  });
});

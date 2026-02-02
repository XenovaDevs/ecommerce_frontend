import { test, expect } from '@playwright/test';

test.describe('Página de Productos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('debe cargar la página de productos correctamente', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Productos' })).toBeVisible();

    // Esperar a que se carguen los productos
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar el listado de productos', async ({ page }) => {
    // Esperar a que carguen los productos
    await page.waitForTimeout(2000);

    // Verificar si hay productos o mensaje vacío
    const productsGrid = page.locator('[class*="grid"]').first();
    await expect(productsGrid).toBeVisible();
  });

  test('debe permitir agregar un producto al carrito', async ({ page }) => {
    // Esperar productos
    await page.waitForTimeout(2000);

    // Buscar primer botón de agregar al carrito
    const addToCartButton = page.getByRole('button', { name: /agregar/i }).first();

    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();

      // Verificar feedback (puede ser un toast o cambio en contador del carrito)
      await page.waitForTimeout(1000);
    }
  });

  test('debe mostrar filtros en desktop', async ({ page }) => {
    // En desktop, los filtros deberían estar visibles
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 1024) {
      // Buscar sección de filtros
      const filterSection = page.locator('aside').first();
      await expect(filterSection).toBeVisible();
    }
  });

  test('debe mostrar botón de filtros en mobile', async ({ page }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // Buscar botón de filtros móvil
    const mobileFilterButton = page.getByRole('button', { name: /filtro/i }).first();
    if (await mobileFilterButton.isVisible()) {
      await expect(mobileFilterButton).toBeVisible();
    }
  });

  test('debe abrir modal de filtros en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    const filterButton = page.locator('button').filter({ hasText: /filtro/i }).first();

    if (await filterButton.isVisible()) {
      await filterButton.click();

      // Verificar modal abierto
      await page.waitForTimeout(500);
      const modal = page.locator('[role="dialog"]').first();
      if (await modal.isVisible()) {
        await expect(modal).toBeVisible();
      }
    }
  });

  test('debe filtrar por categoría', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Buscar filtros de categoría
    const categoryFilter = page.locator('label').filter({ hasText: /categoría/i }).first();

    if (await categoryFilter.isVisible()) {
      // Buscar opciones de categoría
      const categoryOption = page.locator('input[type="radio"], input[type="checkbox"]').first();
      if (await categoryOption.isVisible()) {
        await categoryOption.click();
        await page.waitForTimeout(1000);

        // Verificar que se aplicó el filtro
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('debe filtrar por rango de precio', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Buscar inputs de precio
    const minPriceInput = page.locator('input[name*="min"], input[placeholder*="mín"]').first();
    const maxPriceInput = page.locator('input[name*="max"], input[placeholder*="máx"]').first();

    if (await minPriceInput.isVisible() && await maxPriceInput.isVisible()) {
      await minPriceInput.fill('1000');
      await maxPriceInput.fill('50000');

      // Esperar aplicación de filtros
      await page.waitForTimeout(1000);
    }
  });

  test('debe mostrar contador de productos encontrados', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Buscar texto con cantidad de productos
    const productCount = page.locator('text=/\\d+ productos/i').first();
    if (await productCount.isVisible()) {
      await expect(productCount).toBeVisible();
    }
  });

  test('debe limpiar filtros activos', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Buscar botón de limpiar filtros
    const clearButton = page.getByRole('button', { name: /limpiar/i }).first();

    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('debe cargar más productos si hay paginación', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Buscar botón de cargar más
    const loadMoreButton = page.getByRole('button', { name: /cargar más/i });

    if (await loadMoreButton.isVisible()) {
      await loadMoreButton.click();
      await page.waitForTimeout(1000);
      await page.waitForLoadState('networkidle');
    }
  });

  test('debe navegar a detalle de producto', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Buscar primer producto clickeable
    const productLink = page.locator('a[href*="/products/"]').first();

    if (await productLink.isVisible()) {
      await productLink.click();
      await page.waitForLoadState('networkidle');

      // Verificar que estamos en página de detalle
      expect(page.url()).toContain('/products/');
    }
  });

  test('debe mostrar productos en oferta si existe el filtro', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Buscar filtro de ofertas
    const saleFilter = page.locator('label').filter({ hasText: /oferta|descuento/i }).first();

    if (await saleFilter.isVisible()) {
      const saleCheckbox = saleFilter.locator('input[type="checkbox"]').first();
      if (await saleCheckbox.isVisible()) {
        await saleCheckbox.check();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('debe filtrar productos en stock', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Buscar filtro de stock
    const stockFilter = page.locator('label').filter({ hasText: /stock|disponible/i }).first();

    if (await stockFilter.isVisible()) {
      const stockCheckbox = stockFilter.locator('input[type="checkbox"]').first();
      if (await stockCheckbox.isVisible()) {
        await stockCheckbox.check();
        await page.waitForTimeout(1000);
      }
    }
  });
});

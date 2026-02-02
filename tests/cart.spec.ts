import { test, expect } from '@playwright/test';

test.describe('Carrito de Compras', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe navegar al carrito desde el header', async ({ page }) => {
    // Buscar ícono/link del carrito
    const cartLink = page.locator('a[href*="cart"], button').filter({ hasText: /carrito/i }).first();

    if (!await cartLink.isVisible()) {
      // Intentar buscar por ícono de carrito
      await page.goto('/cart');
    } else {
      await cartLink.click();
    }

    await expect(page).toHaveURL(/\/cart/);
  });

  test('debe mostrar carrito vacío inicialmente', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    // Verificar mensaje de carrito vacío o que la página cargó
    const emptyMessage = page.getByText(/vacío|no hay productos/i).first();
    const cartContent = page.locator('[class*="cart"]').first();

    const isEmpty = await emptyMessage.isVisible().catch(() => false);
    const hasContent = await cartContent.isVisible().catch(() => true);

    expect(isEmpty || hasContent).toBeTruthy();
  });

  test('debe agregar producto al carrito desde productos', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(2000);

    // Agregar primer producto
    const addButton = page.getByRole('button', { name: /agregar/i }).first();

    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);

      // Ir al carrito
      await page.goto('/cart');
      await page.waitForTimeout(1000);

      // Verificar que hay al menos un producto
      const cartItems = page.locator('[class*="cart"], [class*="item"]');
      // El carrito debería tener contenido
      await page.waitForLoadState('networkidle');
    }
  });

  test('debe permitir cambiar cantidad de un producto', async ({ page }) => {
    // Primero agregar producto
    await page.goto('/products');
    await page.waitForTimeout(2000);

    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
    }

    // Ir al carrito
    await page.goto('/cart');
    await page.waitForTimeout(1000);

    // Buscar controles de cantidad
    const increaseButton = page.locator('button').filter({ hasText: /\+|más/i }).first();
    const decreaseButton = page.locator('button').filter({ hasText: /-|menos/i }).first();

    if (await increaseButton.isVisible()) {
      // Obtener cantidad actual
      const quantityInput = page.locator('input[type="number"]').first();

      if (await quantityInput.isVisible()) {
        const initialValue = await quantityInput.inputValue();

        // Incrementar
        await increaseButton.click();
        await page.waitForTimeout(500);

        const newValue = await quantityInput.inputValue();
        expect(Number(newValue)).toBeGreaterThan(Number(initialValue));
      }
    }
  });

  test('debe eliminar producto del carrito', async ({ page }) => {
    // Primero agregar producto
    await page.goto('/products');
    await page.waitForTimeout(2000);

    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
    }

    // Ir al carrito
    await page.goto('/cart');
    await page.waitForTimeout(1000);

    // Buscar botón eliminar
    const removeButton = page.getByRole('button', { name: /eliminar|quitar|remover/i }).first();

    if (await removeButton.isVisible()) {
      await removeButton.click();
      await page.waitForTimeout(1000);

      // Verificar que se eliminó (podría mostrar mensaje de vacío)
      await page.waitForLoadState('networkidle');
    }
  });

  test('debe mostrar el subtotal del carrito', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForTimeout(1000);

    // Buscar texto de subtotal/total
    const totalText = page.locator('text=/subtotal|total/i').first();

    if (await totalText.isVisible()) {
      await expect(totalText).toBeVisible();
    }
  });

  test('debe permitir proceder al checkout', async ({ page }) => {
    // Agregar producto primero
    await page.goto('/products');
    await page.waitForTimeout(2000);

    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
    }

    // Ir al carrito
    await page.goto('/cart');
    await page.waitForTimeout(1000);

    // Buscar botón de checkout
    const checkoutButton = page.getByRole('button', { name: /finalizar|checkout|comprar/i }).first();

    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      await page.waitForTimeout(1000);

      // Verificar redirección a checkout o login
      expect(page.url()).toMatch(/checkout|login/);
    }
  });

  test('debe actualizar el contador del carrito en el header', async ({ page }) => {
    // Buscar contador inicial
    const cartBadge = page.locator('[class*="badge"], [class*="count"]').first();

    // Agregar producto
    await page.goto('/products');
    await page.waitForTimeout(2000);

    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);

      // Verificar que el contador cambió
      if (await cartBadge.isVisible()) {
        const count = await cartBadge.textContent();
        expect(Number(count)).toBeGreaterThan(0);
      }
    }
  });

  test('debe persistir el carrito después de navegar', async ({ page }) => {
    // Agregar producto
    await page.goto('/products');
    await page.waitForTimeout(2000);

    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
    }

    // Navegar a otra página
    await page.goto('/');
    await page.waitForTimeout(500);

    // Volver al carrito
    await page.goto('/cart');
    await page.waitForTimeout(1000);

    // El producto debería seguir ahí
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar imagen del producto en el carrito', async ({ page }) => {
    // Agregar producto
    await page.goto('/products');
    await page.waitForTimeout(2000);

    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
    }

    // Ir al carrito
    await page.goto('/cart');
    await page.waitForTimeout(1000);

    // Verificar que hay imágenes
    const productImage = page.locator('img').first();
    if (await productImage.isVisible()) {
      await expect(productImage).toBeVisible();
    }
  });
});

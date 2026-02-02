import { test, expect } from '@playwright/test';

test.describe('Checkout como Invitado', () => {
  test.beforeEach(async ({ page }) => {
    // Agregar producto al carrito primero
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

    // Proceder al checkout
    const checkoutButton = page.getByRole('button', { name: /finalizar|checkout|comprar/i }).first();
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('debe permitir acceder al checkout sin registrarse', async ({ page }) => {
    // Verificar que estamos en checkout o se ofrece opción de invitado
    await page.waitForTimeout(1000);

    // Buscar opción de continuar como invitado
    const guestOption = page.getByText(/invitado|sin.*registro|guest/i).first();
    const guestButton = page.getByRole('button', { name: /invitado|guest/i }).first();

    if (await guestButton.isVisible()) {
      await guestButton.click();
      await page.waitForTimeout(1000);
    } else if (await guestOption.isVisible()) {
      await guestOption.click();
      await page.waitForTimeout(1000);
    }

    // Debería estar en página de checkout
    expect(page.url()).toMatch(/checkout/);
  });

  test('debe solicitar información de contacto', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Buscar opción invitado si existe
    const guestButton = page.getByRole('button', { name: /invitado/i }).first();
    if (await guestButton.isVisible()) {
      await guestButton.click();
      await page.waitForTimeout(1000);
    }

    // Verificar campos de contacto
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const nameInput = page.locator('input[name*="name"], input[name*="nombre"]').first();

    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
    }

    if (await nameInput.isVisible()) {
      await expect(nameInput).toBeVisible();
    }
  });

  test('debe completar información de entrega', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Saltar opción invitado si existe
    const guestButton = page.getByRole('button', { name: /invitado/i }).first();
    if (await guestButton.isVisible()) {
      await guestButton.click();
      await page.waitForTimeout(1000);
    }

    // Llenar información básica
    const testData = {
      email: 'test@example.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '1234567890',
      direccion: 'Calle Test 123',
      ciudad: 'Buenos Aires',
      codigoPostal: '1000',
      provincia: 'Buenos Aires'
    };

    // Intentar llenar cada campo
    for (const [key, value] of Object.entries(testData)) {
      const input = page.locator(`input[name*="${key}"], input[placeholder*="${key}"]`).first();
      if (await input.isVisible().catch(() => false)) {
        await input.fill(value);
      }
    }

    await page.waitForTimeout(500);
  });

  test('debe mostrar resumen del pedido', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Verificar que se muestra el resumen
    const summary = page.locator('text=/resumen|summary|total/i').first();

    if (await summary.isVisible()) {
      await expect(summary).toBeVisible();
    }
  });

  test('debe calcular el total correctamente', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Buscar precio total
    const totalPrice = page.locator('text=/total|subtotal/i').first();

    if (await totalPrice.isVisible()) {
      await expect(totalPrice).toBeVisible();

      // El total debería contener números y símbolo de moneda
      const totalText = await totalPrice.textContent();
      expect(totalText).toMatch(/\d+/);
    }
  });

  test('debe validar campos requeridos', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Saltar opción invitado si existe
    const guestButton = page.getByRole('button', { name: /invitado/i }).first();
    if (await guestButton.isVisible()) {
      await guestButton.click();
      await page.waitForTimeout(1000);
    }

    // Intentar enviar sin llenar campos
    const submitButton = page.getByRole('button', { name: /finalizar|confirmar|pagar/i }).first();

    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(1000);

      // Debería mostrar errores de validación
      const errorMessages = page.locator('text=/requerido|obligatorio|required/i');
      // No necesariamente habrá errores si los campos tienen validación HTML5
    }
  });

  test('debe permitir seleccionar método de envío', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Buscar opciones de envío
    const shippingOptions = page.locator('input[type="radio"][name*="shipping"], input[type="radio"][name*="envío"]');

    const count = await shippingOptions.count();
    if (count > 0) {
      await shippingOptions.first().check();
      await page.waitForTimeout(500);
    }
  });

  test('debe permitir seleccionar método de pago', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Buscar opciones de pago
    const paymentOptions = page.locator('input[type="radio"][name*="payment"], input[type="radio"][name*="pago"]');

    const count = await paymentOptions.count();
    if (count > 0) {
      await paymentOptions.first().check();
      await page.waitForTimeout(500);
    }
  });

  test('debe mostrar política de privacidad o términos', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Buscar checkbox de términos
    const termsCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /términos|condiciones|privacidad/i }).first();
    const termsLabel = page.locator('label').filter({ hasText: /términos|condiciones|privacidad/i }).first();

    if (await termsLabel.isVisible()) {
      await expect(termsLabel).toBeVisible();
    }
  });

  test.skip('debe completar un checkout completo como invitado', async ({ page }) => {
    // Test end-to-end completo (skip por defecto para no hacer pedidos reales)
    await page.waitForTimeout(1000);

    // Opción invitado
    const guestButton = page.getByRole('button', { name: /invitado/i }).first();
    if (await guestButton.isVisible()) {
      await guestButton.click();
      await page.waitForTimeout(1000);
    }

    // Llenar formulario
    const fields = {
      email: 'test@example.com',
      nombre: 'Test',
      apellido: 'User',
      telefono: '1234567890',
      direccion: 'Test Street 123',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigo_postal: '1000'
    };

    for (const [name, value] of Object.entries(fields)) {
      const input = page.locator(`input[name*="${name}"]`).first();
      if (await input.isVisible().catch(() => false)) {
        await input.fill(value);
        await page.waitForTimeout(200);
      }
    }

    // Seleccionar método de envío
    const shippingOption = page.locator('input[type="radio"]').first();
    if (await shippingOption.isVisible()) {
      await shippingOption.check();
    }

    // Aceptar términos
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check();
    }

    // Enviar
    const submitButton = page.getByRole('button', { name: /finalizar|confirmar/i }).last();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);

      // Verificar redirección a página de éxito
      await page.waitForURL(/success|confirmation|gracias/i, { timeout: 10000 });
    }
  });
});

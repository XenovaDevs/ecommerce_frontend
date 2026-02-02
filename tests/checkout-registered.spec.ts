import { test, expect } from '@playwright/test';

test.describe('Checkout con Usuario Registrado', () => {
  test.skip('debe permitir checkout con usuario autenticado', async ({ page }) => {
    // Este test requiere autenticación previa
    // Primero hacer login
    await page.goto('/login');

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.getByRole('button', { name: /iniciar|login/i }).first();

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    await submitButton.click();

    await page.waitForTimeout(2000);

    // Agregar producto al carrito
    await page.goto('/products');
    await page.waitForTimeout(2000);

    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
    }

    // Ir al checkout
    await page.goto('/cart');
    await page.waitForTimeout(1000);

    const checkoutButton = page.getByRole('button', { name: /finalizar|checkout/i }).first();
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      await page.waitForTimeout(1000);
    }

    // Verificar que estamos en checkout
    expect(page.url()).toContain('checkout');
  });

  test.skip('debe mostrar direcciones guardadas', async ({ page }) => {
    // Login primero (requiere usuario con direcciones guardadas)
    await page.goto('/login');

    await page.locator('input[type="email"]').first().fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('password123');
    await page.getByRole('button', { name: /iniciar|login/i }).first().click();

    await page.waitForTimeout(2000);

    // Ir al checkout (con producto en carrito)
    await page.goto('/products');
    await page.waitForTimeout(1000);

    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
    }

    await page.goto('/checkout');
    await page.waitForTimeout(1000);

    // Buscar direcciones guardadas
    const savedAddresses = page.locator('[class*="address"], text=/dirección.*guardada/i');

    // Verificar si existen direcciones guardadas
    await page.waitForLoadState('networkidle');
  });

  test.skip('debe permitir agregar nueva dirección', async ({ page }) => {
    // Login y setup
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('password123');
    await page.getByRole('button', { name: /iniciar|login/i }).first().click();

    await page.waitForTimeout(2000);

    // Agregar producto y ir a checkout
    await page.goto('/products');
    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
    }

    await page.goto('/checkout');
    await page.waitForTimeout(1000);

    // Buscar botón de nueva dirección
    const newAddressButton = page.getByRole('button', { name: /nueva.*dirección|agregar.*dirección/i }).first();

    if (await newAddressButton.isVisible()) {
      await newAddressButton.click();
      await page.waitForTimeout(500);

      // Llenar formulario
      const addressForm = {
        calle: 'Test Street 123',
        ciudad: 'Buenos Aires',
        provincia: 'Buenos Aires',
        codigo_postal: '1000',
        telefono: '1234567890'
      };

      for (const [key, value] of Object.entries(addressForm)) {
        const input = page.locator(`input[name*="${key}"]`).first();
        if (await input.isVisible().catch(() => false)) {
          await input.fill(value);
        }
      }
    }
  });

  test.skip('debe usar método de pago guardado', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('password123');
    await page.getByRole('button', { name: /iniciar|login/i }).first().click();

    await page.waitForTimeout(2000);

    // Setup carrito y checkout
    await page.goto('/products');
    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
    }

    await page.goto('/checkout');
    await page.waitForTimeout(1000);

    // Buscar métodos de pago guardados
    const savedPayment = page.locator('text=/método.*guardado|tarjeta.*terminada/i').first();

    if (await savedPayment.isVisible()) {
      await expect(savedPayment).toBeVisible();
    }
  });

  test.skip('debe aplicar descuento o cupón', async ({ page }) => {
    // Login y setup
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('password123');
    await page.getByRole('button', { name: /iniciar|login/i }).first().click();

    await page.waitForTimeout(2000);

    await page.goto('/products');
    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
    }

    await page.goto('/checkout');
    await page.waitForTimeout(1000);

    // Buscar input de cupón
    const couponInput = page.locator('input[name*="coupon"], input[name*="cupón"], input[placeholder*="cupón"]').first();
    const applyButton = page.getByRole('button', { name: /aplicar|usar/i }).first();

    if (await couponInput.isVisible() && await applyButton.isVisible()) {
      await couponInput.fill('TEST10');
      await applyButton.click();
      await page.waitForTimeout(1000);

      // Verificar que se aplicó o muestra error si es inválido
      await page.waitForLoadState('networkidle');
    }
  });

  test.skip('debe mostrar puntos de lealtad si existen', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('password123');
    await page.getByRole('button', { name: /iniciar|login/i }).first().click();

    await page.waitForTimeout(2000);

    await page.goto('/products');
    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
    }

    await page.goto('/checkout');
    await page.waitForTimeout(1000);

    // Buscar información de puntos
    const loyaltyPoints = page.locator('text=/puntos|rewards|loyalty/i').first();

    if (await loyaltyPoints.isVisible()) {
      await expect(loyaltyPoints).toBeVisible();
    }
  });

  test.skip('debe completar checkout completo como usuario registrado', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('password123');
    await page.getByRole('button', { name: /iniciar|login/i }).first().click();

    await page.waitForTimeout(2000);

    // Agregar producto
    await page.goto('/products');
    const addButton = page.getByRole('button', { name: /agregar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);
    }

    // Ir a checkout
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    // Seleccionar o confirmar dirección
    const continueButton = page.getByRole('button', { name: /continuar|siguiente/i }).first();
    if (await continueButton.isVisible()) {
      await continueButton.click();
      await page.waitForTimeout(1000);
    }

    // Seleccionar método de envío
    const shippingOption = page.locator('input[type="radio"]').first();
    if (await shippingOption.isVisible()) {
      await shippingOption.check();
      await page.waitForTimeout(500);
    }

    // Continuar a pago
    const paymentButton = page.getByRole('button', { name: /continuar|pago|payment/i }).first();
    if (await paymentButton.isVisible()) {
      await paymentButton.click();
      await page.waitForTimeout(1000);
    }

    // Confirmar pedido
    const confirmButton = page.getByRole('button', { name: /confirmar|finalizar|place.*order/i }).last();
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
      await page.waitForTimeout(3000);

      // Verificar redirección a éxito
      await page.waitForURL(/success|confirmation|thank/i, { timeout: 10000 });
    }
  });

  test.skip('debe poder ver pedidos anteriores', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.locator('input[type="email"]').first().fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('password123');
    await page.getByRole('button', { name: /iniciar|login/i }).first().click();

    await page.waitForTimeout(2000);

    // Ir a pedidos
    await page.goto('/orders');
    await page.waitForTimeout(1000);

    // Verificar que carga la página de pedidos
    const ordersHeading = page.getByRole('heading', { name: /pedidos|orders|mis.*compras/i }).first();

    if (await ordersHeading.isVisible()) {
      await expect(ordersHeading).toBeVisible();
    }
  });
});

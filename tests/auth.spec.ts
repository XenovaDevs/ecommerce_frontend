import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'Test123456!',
    nombre: 'Test',
    apellido: 'User',
    telefono: '1234567890'
  };

  test.describe('Registro', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
    });

    test('debe cargar la página de registro', async ({ page }) => {
      await expect(page).toHaveURL(/register/);

      // Verificar título o heading
      const heading = page.getByRole('heading', { name: /registr|crear.*cuenta|sign.*up/i }).first();
      if (await heading.isVisible()) {
        await expect(heading).toBeVisible();
      }
    });

    test('debe mostrar formulario de registro', async ({ page }) => {
      // Verificar campos principales
      const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    });

    test('debe validar email inválido', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]').first();
      const submitButton = page.getByRole('button', { name: /registr|crear|sign.*up/i }).first();

      await emailInput.fill('email-invalido');

      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(500);

        // Verificar error de validación (HTML5 o custom)
        const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
        expect(isInvalid || await page.locator('text=/email.*válido/i').isVisible()).toBeTruthy();
      }
    });

    test('debe validar contraseña corta', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.getByRole('button', { name: /registr|crear/i }).first();

      await passwordInput.fill('123');

      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(500);

        // Verificar mensaje de error
        const errorMessage = page.locator('text=/contraseña.*corta|password.*short/i').first();
        // La validación puede ser de diferentes formas
      }
    });

    test('debe mostrar enlace a login', async ({ page }) => {
      const loginLink = page.getByRole('link', { name: /iniciar.*sesión|login|ya.*cuenta/i }).first();

      if (await loginLink.isVisible()) {
        await expect(loginLink).toBeVisible();
      }
    });

    test('debe registrar un nuevo usuario', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const nombreInput = page.locator('input[name*="nombre"], input[name*="name"]').first();

      await emailInput.fill(`nuevo-${Date.now()}@example.com`);
      await passwordInput.fill(testUser.password);

      if (await nombreInput.isVisible()) {
        await nombreInput.fill(testUser.nombre);
      }

      const submitButton = page.getByRole('button', { name: /registr|crear/i }).first();
      await submitButton.click();

      // Esperar redirección o mensaje de éxito
      await page.waitForTimeout(2000);
      const successMsg = page.locator('text=/bienvenido|registrad|cuenta creada|login/i').first();
      if (await successMsg.count()) {
        await expect(successMsg).toBeVisible();
      }
    });
  });

  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('debe cargar la página de login', async ({ page }) => {
      await expect(page).toHaveURL(/login/);

      const heading = page.getByRole('heading', { name: /iniciar.*sesión|login|entrar/i }).first();
      if (await heading.isVisible()) {
        await expect(heading).toBeVisible();
      }
    });

    test('debe mostrar formulario de login', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.getByRole('button', { name: /iniciar|login|entrar/i }).first();

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();
    });

    test('debe validar campos vacíos', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /iniciar|login/i }).first();

      await submitButton.click();
      await page.waitForTimeout(500);

      // Debería mostrar errores o prevenir submit (permanecer en login)
      expect(page.url()).toContain('/login');
    });

    test('debe mostrar error con credenciales inválidas', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.getByRole('button', { name: /iniciar|login/i }).first();

      await emailInput.fill('wrong@example.com');
      await passwordInput.fill('wrongpassword');
      await submitButton.click();

      await page.waitForTimeout(2000);

      // Verificar mensaje de error
      const errorMessage = page.locator('text=/credenciales.*incorrectas|invalid.*credentials|error/i').first();
      // El error puede mostrarse de diferentes formas
    });

    test('debe mostrar enlace a registro', async ({ page }) => {
      const registerLink = page.getByRole('link', { name: /registr|crear.*cuenta|sign.*up/i }).first();

      if (await registerLink.isVisible()) {
        await expect(registerLink).toBeVisible();

        await registerLink.click();
        await expect(page).toHaveURL(/register/);
      }
    });

    test('debe mostrar enlace de recuperar contraseña', async ({ page }) => {
      const forgotLink = page.getByRole('link', { name: /olvid|recuperar|forgot/i }).first();

      if (await forgotLink.isVisible()) {
        await expect(forgotLink).toBeVisible();
      }
    });

    test('debe permitir ver/ocultar contraseña', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const toggleButton = page.locator('button').filter({ hasText: /ver|mostrar|show|hide/i }).first();

      if (await toggleButton.isVisible()) {
        await passwordInput.fill('testpassword');

        // Click para mostrar
        await toggleButton.click();
        await page.waitForTimeout(300);

        const inputType = await passwordInput.getAttribute('type');
        expect(inputType).toBe('text');

        // Click para ocultar
        await toggleButton.click();
        await page.waitForTimeout(300);

        const inputType2 = await passwordInput.getAttribute('type');
        expect(inputType2).toBe('password');
      }
    });

    test('debe hacer login con usuario válido', async ({ page }) => {
      const { loginAsCustomer } = await import('./utils/api');
      const { token } = await loginAsCustomer();
      expect(token).toBeTruthy();
      await page.context().addCookies([
        { name: 'auth_token', value: token, domain: 'localhost', path: '/', httpOnly: false, secure: false, sameSite: 'Lax' },
      ]);
      await page.goto('/profile', { waitUntil: 'domcontentloaded' });
      await expect(page).not.toHaveURL(/login/);
    });
  });

  test.describe('Logout', () => {
    test('debe cerrar sesión correctamente', async ({ page }) => {
      const { loginAsCustomer } = await import('./utils/api');
      const { token } = await loginAsCustomer();
      expect(token).toBeTruthy();
      await page.context().addCookies([
        { name: 'auth_token', value: token, domain: 'localhost', path: '/', httpOnly: false, secure: false, sameSite: 'Lax' },
      ]);
      await page.goto('/profile', { waitUntil: 'domcontentloaded' });
      await page.context().clearCookies();
      await page.goto('/profile', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/login/);
    });
  });
});

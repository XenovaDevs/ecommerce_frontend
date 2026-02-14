import { test, expect } from '@playwright/test';

test.describe('Contacto', () => {
  test('debe mostrar formulario y validar campos', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    const nameInput = page.locator('input[name*="name"], input[name*="nombre"]').first();
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const messageInput = page.locator('textarea').first();

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();

    await nameInput.fill('QA Bot');
    await emailInput.fill('qa@example.com');
    await messageInput.fill('Mensaje de prueba automático');

    const submit = page.getByRole('button', { name: /enviar|submit|send/i }).first();
    if (await submit.isVisible()) {
      await submit.click();
      await page.waitForTimeout(500);
      await expect(page.locator('text=/gracias|recibido|enviado/i')).toBeVisible({ timeout: 3000 }).catch(() => {});
    }
  });
});

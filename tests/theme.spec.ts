import { test, expect, type Page } from '@playwright/test';

const THEME_STORAGE_KEY = 'lps-theme-preference';

async function resetThemePreference(page: Page) {
  await page.addInitScript((storageKey) => {
    localStorage.removeItem(storageKey);
    document.cookie = `${storageKey}=; Path=/; Max-Age=0; SameSite=Lax`;
  }, THEME_STORAGE_KEY);
}

test.describe('Theme system', () => {
  test('uses system dark when device preference is dark', async ({ page }) => {
    await resetThemePreference(page);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('uses system light when device preference is light', async ({ page }) => {
    await resetThemePreference(page);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('persists stored manual preference across reloads', async ({ page }) => {
    await resetThemePreference(page);
    await page.addInitScript((storageKey) => {
      localStorage.setItem(storageKey, 'dark');
      document.cookie = `${storageKey}=dark; Path=/; Max-Age=31536000; SameSite=Lax`;
    }, THEME_STORAGE_KEY);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const persistedValue = await page.evaluate((storageKey) => localStorage.getItem(storageKey), THEME_STORAGE_KEY);
    expect(persistedValue).toBe('dark');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

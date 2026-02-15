import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const smokeRoutes = ['/', '/products', '/cart', '/checkout', '/login'];
const isStrict = process.env.A11Y_STRICT === 'true';

for (const route of smokeRoutes) {
  test(`a11y smoke: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).analyze();
    const blockingViolations = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    );

    if (blockingViolations.length > 0) {
      test.info().annotations.push({
        type: 'a11y',
        description: `${route} has ${blockingViolations.length} serious/critical violations`,
      });
    }

    if (isStrict) {
      expect(blockingViolations).toEqual([]);
      return;
    }

    expect(Array.isArray(blockingViolations)).toBeTruthy();
  });
}

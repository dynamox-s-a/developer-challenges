import { test, expect } from '@playwright/test';
import { HIGHCHARTS, hoverChartPoint } from './support/selectors';

test.describe('Tooltip on hover (challenge RN4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('23. hover on a point in the Aceleração RMS chart shows tooltip with date and value', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).first();
    await hoverChartPoint(chart);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).toBeVisible();
    // deve conter algum valor numérico + unidade "g" (o Highcharts injeta um
    // zero-width space após o texto, por isso não ancoramos com $ estrito)
    await expect(tooltip).toContainText(/\d+(\.\d+)?\s*g\b/);
  });

  test('24. hover on a point in the Temperatura chart shows tooltip', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).nth(1);
    await hoverChartPoint(chart);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).toBeVisible();
  });

  test('25. hover on a point in the Velocidade RMS chart shows tooltip', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).nth(2);
    await hoverChartPoint(chart);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).toBeVisible();
  });

  test('26. tooltip date follows the PT-BR language of the rest of the UI', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).first();
    await hoverChartPoint(chart);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).not.toContainText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });
});

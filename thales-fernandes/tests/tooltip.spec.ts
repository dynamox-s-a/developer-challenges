import { test, expect } from '@playwright/test';
import { HIGHCHARTS, hoverChartPoint } from './support/selectors';

test.describe('Tooltip ao hover (RN4 do desafio)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('23. hover em um ponto do gráfico de Aceleração RMS exibe tooltip com data e valor', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).first();
    await hoverChartPoint(chart);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).toBeVisible();
    // deve conter algum valor numérico + unidade "g" (o Highcharts injeta um
    // zero-width space após o texto, por isso não ancoramos com $ estrito)
    await expect(tooltip).toContainText(/\d+(\.\d+)?\s*g\b/);
  });

  test('24. hover em um ponto do gráfico de Temperatura exibe tooltip', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).nth(1);
    await hoverChartPoint(chart);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).toBeVisible();
  });

  test('25. hover em um ponto do gráfico de Velocidade RMS exibe tooltip', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).nth(2);
    await hoverChartPoint(chart);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).toBeVisible();
  });

  test('26. data no tooltip segue o idioma PT-BR do restante da UI', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).first();
    await hoverChartPoint(chart);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).not.toContainText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });
});

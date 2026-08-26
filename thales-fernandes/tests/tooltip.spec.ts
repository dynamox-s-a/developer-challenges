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
    // cobre dia da semana em inglês (ex.: "Friday") e mês em inglês que não
    // coincide com a abreviação em português. Jan, Mar, Jun, Jul e Nov foram
    // excluídos de propósito: a abreviação é idêntica nos dois idiomas
    // (ex.: novembro -> "Nov" também em PT-BR), então não provam nada
    // sozinhos. Só entram os meses que realmente diferem: Feb/Fev, Apr/Abr,
    // May/Mai, Aug/Ago, Sep/Set, Oct/Out, Dec/Dez.
    await expect(tooltip).not.toContainText(
      /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\bFeb\b|\bApr\b|\bMay\b|\bAug\b|\bSep\b|\bOct\b|\bDec\b/
    );
  });
});

import { test, expect } from '@playwright/test';
import { HIGHCHARTS, CHART_TITLES, hoverChartPoint } from './support/selectors';

/**
 * Jornada macro do desafio: "consegue completar essa jornada?"
 * Um único teste ponta-a-ponta que simula o usuário chegando na página e
 * conseguindo consumir a informação principal (header + 3 gráficos + tooltip).
 * Os specs de header/charts/tooltip cobrem o detalhe; este cobre o fluxo.
 */
test('21. user can view machine, spot and the 3 charts with data on page access', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Análise de dados')).toBeVisible();
  await expect(page.getByText(/^Máquina \S+/)).toBeVisible();
  await expect(page.getByText(/^Ponto \S+/)).toBeVisible();

  for (const title of Object.values(CHART_TITLES)) {
    // getByRole('heading') evita colisão com o mesmo texto na legenda do
    // Highcharts (ex.: "Temperatura" aparece 2x na página).
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }

  await expect(page.locator(HIGHCHARTS.container)).toHaveCount(3);

  const firstChart = page.locator(HIGHCHARTS.container).first();
  await hoverChartPoint(firstChart);
  await expect(page.locator(HIGHCHARTS.tooltip)).toBeVisible();
});

test('22. page does not crash (no fatal console error) during load', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto('/');
  await expect(page.getByText('Análise de dados')).toBeVisible();

  expect(pageErrors).toEqual([]);
});

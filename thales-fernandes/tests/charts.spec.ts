import { test, expect } from '@playwright/test';
import { CHART_TITLES, HIGHCHARTS } from './support/selectors';

test.describe('Charts, 3 time series (challenge RN2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const chartTestNumbers: Record<keyof typeof CHART_TITLES, number> = {
    accelerationRms: 7,
    temperature: 8,
    velocityRms: 9,
  };

  for (const [key, title] of Object.entries(CHART_TITLES)) {
    const n = chartTestNumbers[key as keyof typeof CHART_TITLES];
    test(`${n}. chart "${title}" is rendered with a Highcharts container`, async ({ page }) => {
      // getByRole('heading') evita colisão com o mesmo texto aparecendo na
      // legenda do Highcharts (ex.: "Temperatura" aparece 2x na página).
      const heading = page.getByRole('heading', { name: title, exact: true });
      await expect(heading).toBeVisible();
    });
  }

  test('10. the 3 charts are rendered on the page (not just 1 or 2)', async ({ page }) => {
    const containers = page.locator(HIGHCHARTS.container);
    await expect(containers).toHaveCount(3);
  });

  test('11. Aceleração RMS chart has the 3 axis series (Axial, Horizontal, Radial)', async ({ page }) => {
    // Highcharts renderiza 1 <svg> por gráfico; escopamos a legenda ao 1º container.
    const chart = page.locator(HIGHCHARTS.container).first();
    const legend = chart.locator('.highcharts-legend-item text');
    await expect(legend).toHaveText(['Axial', 'Horizontal', 'Radial']);
  });

  test('12. Velocidade RMS chart has the 3 axis series (Axial, Horizontal, Radial)', async ({ page }) => {
    // 3º gráfico na ordem de renderização: Aceleração RMS, Temperatura, Velocidade RMS.
    const chart = page.locator(HIGHCHARTS.container).nth(2);
    const legend = chart.locator('.highcharts-legend-item text');
    await expect(legend).toHaveText(['Axial', 'Horizontal', 'Radial']);
  });

  test('13. Aceleração RMS Y axis uses unit "g" (Aceleração RMS (g))', async ({ page }) => {
    await expect(page.getByText('Aceleração RMS (g)')).toBeVisible();
  });

  test('14. Velocidade RMS Y axis uses unit "mm/s"', async ({ page }) => {
    await expect(page.getByText('Velocidade RMS (mm/s)')).toBeVisible();
  });

  test('15. Temperatura Y axis uses unit "°C"', async ({ page }) => {
    await expect(page.getByText('Temperatura (°C)')).toBeVisible();
  });

  test('16. data reloads on every page access (RN3): new /data.json request on every load', async ({ page }) => {
    // primeiro load já ocorreu no beforeEach; validamos que um segundo load
    // dispara uma nova chamada de rede (não usa cache/estado do primeiro load).
    const [dataResp] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith('/data.json')),
      page.reload(),
    ]);
    expect(dataResp.status()).toBe(200);
  });
});

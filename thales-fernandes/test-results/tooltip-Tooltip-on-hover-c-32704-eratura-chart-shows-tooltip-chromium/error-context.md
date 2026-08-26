# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tooltip.spec.ts >> Tooltip on hover (challenge RN4) >> 24. hover on a point in the Temperatura chart shows tooltip
- Location: tests/tooltip.spec.ts:20:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.highcharts-tooltip')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.highcharts-tooltip')

```

```yaml
- heading "Análise de dados" [level=6]
- main:
  - img
  - text: Máquina 1023
  - separator
  - img
  - text: Ponto 20192
  - separator
  - img
  - text: "200"
  - separator
  - img
  - text: 16g
  - separator
  - img
  - text: null min
  - heading "Aceleração RMS" [level=6]
  - img: Aceleração RMS (g) Axial Horizontal Radial Nov 13 Nov 20 Nov 27 Dec 4 Dec 11 0 0.025 0.05 0.075 0.1 0.125 0.15 Highcharts.com
  - heading "Temperatura" [level=6]
  - img: Temperatura (°C) Temperatura Nov 13 Nov 20 Nov 27 Dec 4 Dec 11 15 20 25 30 35 40 Highcharts.com
  - heading "Velocidade RMS" [level=6]
  - img: Velocidade RMS (mm/s) Axial Horizontal Radial Nov 13 Nov 20 Nov 27 Dec 4 Dec 11 0 5 10 15 20 25 Highcharts.com
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { HIGHCHARTS, hoverChartPoint } from './support/selectors';
  3  | 
  4  | test.describe('Tooltip on hover (challenge RN4)', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/');
  7  |   });
  8  | 
  9  |   test('23. hover on a point in the Aceleração RMS chart shows tooltip with date and value', async ({ page }) => {
  10 |     const chart = page.locator(HIGHCHARTS.container).first();
  11 |     await hoverChartPoint(chart);
  12 | 
  13 |     const tooltip = page.locator(HIGHCHARTS.tooltip);
  14 |     await expect(tooltip).toBeVisible();
  15 |     // deve conter algum valor numérico + unidade "g" (o Highcharts injeta um
  16 |     // zero-width space após o texto, por isso não ancoramos com $ estrito)
  17 |     await expect(tooltip).toContainText(/\d+(\.\d+)?\s*g\b/);
  18 |   });
  19 | 
  20 |   test('24. hover on a point in the Temperatura chart shows tooltip', async ({ page }) => {
  21 |     const chart = page.locator(HIGHCHARTS.container).nth(1);
  22 |     await hoverChartPoint(chart);
  23 | 
  24 |     const tooltip = page.locator(HIGHCHARTS.tooltip);
> 25 |     await expect(tooltip).toBeVisible();
     |                           ^ Error: expect(locator).toBeVisible() failed
  26 |   });
  27 | 
  28 |   test('25. hover on a point in the Velocidade RMS chart shows tooltip', async ({ page }) => {
  29 |     const chart = page.locator(HIGHCHARTS.container).nth(2);
  30 |     await hoverChartPoint(chart);
  31 | 
  32 |     const tooltip = page.locator(HIGHCHARTS.tooltip);
  33 |     await expect(tooltip).toBeVisible();
  34 |   });
  35 | 
  36 |   test('26. tooltip date follows the PT-BR language of the rest of the UI', async ({ page }) => {
  37 |     const chart = page.locator(HIGHCHARTS.container).first();
  38 |     await hoverChartPoint(chart);
  39 | 
  40 |     const tooltip = page.locator(HIGHCHARTS.tooltip);
  41 |     await expect(tooltip).not.toContainText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  42 |   });
  43 | });
  44 | 
```
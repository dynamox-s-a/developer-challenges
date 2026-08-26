# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tooltip.spec.ts >> Tooltip on hover (challenge RN4) >> 26. tooltip date follows the PT-BR language of the rest of the UI
- Location: tests/tooltip.spec.ts:36:7

# Error details

```
Error: expect(locator).not.toContainText(expected) failed

Locator: locator('.highcharts-tooltip')
Expected pattern: not /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\bFeb\b|\bApr\b|\bMay\b|\bAug\b|\bSep\b|\bOct\b|\bDec\b/
Received string: "Sunday, Nov 12, 08:05:53 PM​● Radial: 0 g​"
Timeout: 5000ms

Call log:
  - Expect "not toContainText" with timeout 5000ms
  - waiting for locator('.highcharts-tooltip')
    14 × locator resolved to <g opacity="1" data-z-index="8" transform="translate(106,253)" filter="url(#highcharts-drop-shadow-3)" class="highcharts-label highcharts-tooltip highcharts-color-undefined">…</g>
       - unexpected value "Sunday, Nov 12, 08:05:53 PM​● Radial: 0 g​"

```

```yaml
- text: "Sunday, Nov 12, 08:05:53 PM● Radial: 0 g"
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
  25 |     await expect(tooltip).toBeVisible();
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
  41 |     // cobre dia da semana em inglês (ex.: "Friday") e mês em inglês que não
  42 |     // coincide com a abreviação em português. Jan, Mar, Jun, Jul e Nov foram
  43 |     // excluídos de propósito: a abreviação é idêntica nos dois idiomas
  44 |     // (ex.: novembro -> "Nov" também em PT-BR), então não provam nada
  45 |     // sozinhos. Só entram os meses que realmente diferem: Feb/Fev, Apr/Abr,
  46 |     // May/Mai, Aug/Ago, Sep/Set, Oct/Out, Dec/Dez.
> 47 |     await expect(tooltip).not.toContainText(
     |                               ^ Error: expect(locator).not.toContainText(expected) failed
  48 |       /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\bFeb\b|\bApr\b|\bMay\b|\bAug\b|\bSep\b|\bOct\b|\bDec\b/
  49 |     );
  50 |   });
  51 | });
  52 | 
```
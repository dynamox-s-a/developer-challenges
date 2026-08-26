# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tooltip.spec.ts >> Tooltip on hover (challenge RN4) >> 27. tooltip month abbreviation matches the Portuguese format shown in the Figma prototype (Dez, not Dec)
- Location: tests/tooltip.spec.ts:54:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.highcharts-tooltip')
Expected pattern: /\bDez\b/
Received string:  "Friday, Dec 1, 05:02:42 AM​● Radial: 0 g​"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.highcharts-tooltip')
    14 × locator resolved to <g opacity="1" data-z-index="8" transform="translate(444,253)" filter="url(#highcharts-drop-shadow-3)" class="highcharts-label highcharts-tooltip highcharts-color-undefined">…</g>
       - unexpected value "Friday, Dec 1, 05:02:42 AM​● Radial: 0 g​"

```

```yaml
- text: "Friday, Dec 1, 05:02:42 AM● Radial: 0 g"
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
  36 |   // Não há requisito documentado (Figma/desafio) sobre o idioma do dia da
  37 |   // semana especificamente, mas toda a UI é PT-BR, então dia da semana em
  38 |   // inglês é inconsistente. Ver docs/questions-to-designer.md (pergunta
  39 |   // sobre regra explícita para isso).
  40 |   test('26. tooltip date follows the PT-BR language of the rest of the UI', async ({ page }) => {
  41 |     const chart = page.locator(HIGHCHARTS.container).first();
  42 |     await hoverChartPoint(chart);
  43 | 
  44 |     const tooltip = page.locator(HIGHCHARTS.tooltip);
  45 |     await expect(tooltip).not.toContainText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  46 |   });
  47 | 
  48 |   // Diferente do teste 26, aqui temos evidência concreta do Figma: o eixo X
  49 |   // dos 3 gráficos mostra os meses abreviados em português ("31. Mai",
  50 |   // "1. Jun"...). Isso não é suposição de UX, é o que o protótipo define.
  51 |   // Testamos com um ponto de dezembro porque "Dez" (PT-BR) e "Dec" (EN) são
  52 |   // visivelmente diferentes, ao contrário de "Nov"/"Nov", que coincidem nos
  53 |   // dois idiomas e não provariam nada.
  54 |   test('27. tooltip month abbreviation matches the Portuguese format shown in the Figma prototype (Dez, not Dec)', async ({ page }) => {
  55 |     const chart = page.locator(HIGHCHARTS.container).first();
  56 |     // ~70% da largura do container cai em pontos de dezembro nesse dataset
  57 |     // (dados vão de 7 nov a 12 dez); ver docs/defects.md #3 para o ponto
  58 |     // exato usado para confirmar isso manualmente ("Friday, Dec 1, 05:02:42 AM").
  59 |     await hoverChartPoint(chart, 0.7, 0.5);
  60 | 
  61 |     const tooltip = page.locator(HIGHCHARTS.tooltip);
  62 |     await expect(tooltip).toBeVisible();
> 63 |     await expect(tooltip).toContainText(/\bDez\b/);
     |                           ^ Error: expect(locator).toContainText(expected) failed
  64 |   });
  65 | });
  66 | 
```
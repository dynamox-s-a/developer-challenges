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

  // Não há requisito documentado (Figma/desafio) sobre o idioma do dia da
  // semana especificamente, mas toda a UI é PT-BR, então dia da semana em
  // inglês é inconsistente. Ver docs/questions-to-designer.md (pergunta
  // sobre regra explícita para isso).
  test('26. tooltip date follows the PT-BR language of the rest of the UI', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).first();
    await hoverChartPoint(chart);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).not.toContainText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  // Diferente do teste 26, aqui temos evidência concreta do Figma: o eixo X
  // dos 3 gráficos mostra os meses abreviados em português ("31. Mai",
  // "1. Jun"...). Isso não é suposição de UX, é o que o protótipo define.
  // Testamos com um ponto de dezembro porque "Dez" (PT-BR) e "Dec" (EN) são
  // visivelmente diferentes, ao contrário de "Nov"/"Nov", que coincidem nos
  // dois idiomas e não provariam nada.
  test('27. tooltip month abbreviation matches the Portuguese format shown in the Figma prototype (Dez, not Dec)', async ({ page }) => {
    const chart = page.locator(HIGHCHARTS.container).first();
    // ~70% da largura do container cai em pontos de dezembro nesse dataset
    // (dados vão de 7 nov a 12 dez); ver docs/defects.md #3 para o ponto
    // exato usado para confirmar isso manualmente ("Friday, Dec 1, 05:02:42 AM").
    await hoverChartPoint(chart, 0.7, 0.5);

    const tooltip = page.locator(HIGHCHARTS.tooltip);
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(/\bDez\b/);
  });
});

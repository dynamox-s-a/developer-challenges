import type { Locator } from '@playwright/test';

/**
 * Seletores centralizados.
 *
 * O app (React + MUI) não expõe data-testid nem ids estáveis, as classes MUI
 * são hashes gerados no build (ex.: "css-1f62mcz") e não devem ser usadas como
 * seletor. Por isso a estratégia aqui é:
 *   1. Texto visível (getByText) para o header e títulos dos gráficos, é o
 *      contrato mais estável que o app oferece hoje.
 *   2. Classes nativas do Highcharts (.highcharts-container, .highcharts-tooltip)
 *      para interação com os gráficos, essas são estáveis entre builds porque
 *      vêm da lib, não do bundler do app.
 *
 * RECOMENDAÇÃO PARA O TIME DE DEV (ver docs/questions-to-dev.md):
 * adicionar data-testid nos containers de header e de cada gráfico tornaria
 * os testes mais resilientes a mudanças de copy/i18n.
 */
export const CHART_TITLES = {
  accelerationRms: 'Aceleração RMS',
  temperature: 'Temperatura',
  velocityRms: 'Velocidade RMS',
} as const;

export const HIGHCHARTS = {
  container: '.highcharts-container',
  tooltip: '.highcharts-tooltip',
  series: '.highcharts-series',
};

/**
 * Move o mouse para um pixel real dentro da área de plot do gráfico.
 *
 * `locator.hover()` mira no centro do bounding-box do elemento; para as
 * séries do Highcharts (paths finos e compridos) o centro geométrico do
 * path muitas vezes cai fora da própria linha, então o mousemove não
 * dispara o evento nativo do Highcharts que abre o tooltip. Mover o mouse
 * para um ponto fixo dentro do container (25%/50% da largura/altura) é o
 * que reproduz o comportamento real de um usuário passando o mouse sobre
 * o gráfico.
 */
export async function hoverChartPoint(chart: Locator, xRatio = 0.25, yRatio = 0.5) {
  // Necessário para os gráficos 2º e 3º, que ficam abaixo da dobra: sem
  // scroll, o boundingBox() fica com coordenadas fora da viewport e o
  // Chrome não faz o hit-test corretamente.
  await chart.scrollIntoViewIfNeeded();
  const box = await chart.boundingBox();
  if (!box) throw new Error('Chart container não está visível na página.');
  const page = chart.page();
  await page.mouse.move(box.x + box.width * xRatio, box.y + box.height * yRatio);
  // Highcharts anima a exibição do tooltip; um pequeno passo extra de mouse
  // garante que o evento de mousemove seja processado antes da asserção.
  await page.mouse.move(box.x + box.width * xRatio + 1, box.y + box.height * yRatio);
}

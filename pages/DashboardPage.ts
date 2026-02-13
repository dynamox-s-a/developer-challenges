import { expect, Page } from '@playwright/test'

export class DashboardPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async visit() {
    await this.page.goto('/')
  }

  get locators() {
    return {
      chartContainer: this.page.locator('.highcharts-container').first(),
      plotBackground: this.page.locator('.highcharts-plot-background').first(),
      tooltip: this.page.locator('.highcharts-tooltip'),
      chartTitle: this.page.locator('.highcharts-title'),
      headerTitle: this.page.locator('h6', { hasText: 'Análise de dados' }),
      idMachine: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^Máquina\s+\d+$/ }),
      spot: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^Ponto\s+\d+$/ }),
      RPM: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^\d+$/ }),
      dynamicRange: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^\d+g$/ }),
      interval: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^\d+\s*min$/i })
    };
  }

  async mockChartData(data: object) {
    await this.page.route('**/data.json*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    });
  }

  async hoverOverChart() {
    const chart = this.locators.chartContainer;

    await expect(chart).toBeVisible({ timeout: 500 });

    await this.page.waitForTimeout(500);

    // 2. Cálculos matemáticos para o movimento do mouse
    const box = await chart.boundingBox();
    if (!box) throw new Error("Não foi possível pegar as dimensões do gráfico");

    const centerY = box.y + (box.height / 2);
    const startX = box.x + 10;
    const endX = box.x + box.width - 10;

    // 3. Executa o movimento suave da esquerda para a direita
    // Isso "acorda" o tracker do gráfico
    await this.page.mouse.move(startX, centerY);
    await this.page.mouse.move(endX, centerY, { steps: 25 });
  }

  async validateTooltipContent(expectedText: string) {
    const tooltip = this.locators.tooltip;

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(expectedText);
  }
}
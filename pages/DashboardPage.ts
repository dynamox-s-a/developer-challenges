import { expect, Page } from '@playwright/test'

export class DashboardPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  get locators() {
    return {
      chartAcceleration: this.page.locator('.highcharts-container').first(),
      chartTemperature: this.page.locator('.highcharts-container').nth(1),
      chartVelocity: this.page.locator('.highcharts-container').nth(2),
      plotBackground: this.page.locator('.highcharts-plot-background').first(),
      tooltip: this.page.locator('.highcharts-tooltip'),
      chartTitle: this.page.locator('.highcharts-title'),
      headerTitle: this.page.locator('h6', { hasText: 'Análise de dados' }),
      idMachine: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^Máquina\s+\d+$/ }),
      spot: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^Ponto\s+\d+$/ }),
      RPM: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^\d+$/ }),
      dynamicRange: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^\d+g$/ }),
      interval: this.page.locator('span.MuiTypography-caption').filter({ hasText: /^\d+\s*min$/i }),
      axialLegend: this.page.locator('g.highcharts-legend-item', { has: this.page.locator('text=Axial') }),
      horizontalLegend: this.page.locator('g.highcharts-legend-item', { has: this.page.locator('text=Horizontal') }),
      verticalLegend: this.page.locator('g.highcharts-legend-item', { has: this.page.locator('text=Vertical') }),
      legends: 'g.highcharts-legend-item text'
    };
  }
  
  async visit() {
    await this.page.goto('/')
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

  async hoverOverChart(index: number) {
    const chart = this.page.locator('.highcharts-container').nth(index);
    await chart.scrollIntoViewIfNeeded();
    await expect(chart).toBeVisible({ timeout: 1000 });

    await this.page.waitForTimeout(1000);

    const box = await chart.boundingBox();
    if (!box) throw new Error("Não foi possível pegar as dimensões do gráfico");

    const centerY = box.y + (box.height / 2);
    const startX = box.x + 10;
    const endX = box.x + box.width - 10;

    await this.page.mouse.move(startX, centerY);
    await this.page.mouse.move(endX, centerY, { steps: 25 });
  }

  async validateTooltipContent(expectedText: string) {
    const tooltips = this.page.locator('.highcharts-tooltip');
    const visibleTooltip = tooltips.locator('visible=true').first();

    await expect(visibleTooltip).toBeVisible({ timeout: 5000 });
    await expect(visibleTooltip).toContainText(expectedText);
  }
}
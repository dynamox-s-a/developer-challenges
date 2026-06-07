import { test, expect, Locator } from '@playwright/test';

const METADATA = {
  machine: 'Máquina 1023',
  spot: 'Ponto 20192',
  rpm: '200',
  dynamicRange: '16g',
  interval: '20 min',
};

const CHART_LABELS = ['Axial', 'Horizontal', 'Radial'];

const CHART_TITLES = ['Aceleração RMS', 'Velocidade RMS', 'Temperatura'];

async function expectLabelActive(label: Locator) {
  await expect(label).toHaveAttribute('style', /text-decoration: none/);
  await expect(label).toHaveAttribute('style', /fill: rgb\(51, 51, 51\)/);
}

async function expectLabelInactive(label: Locator) {
  await expect(label).toHaveAttribute('style', /text-decoration: line-through/);
  await expect(label).toHaveAttribute('style', /fill: rgb\(102, 102, 102\)/);
}

test.describe('Dynamox QA Challenge - Sensor Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display machine metadata in the header', async ({ page }) => {
      for (const [key, value] of Object.entries(METADATA)) {
      await expect(page.getByText(value), `Campo "${key}" não encontrado`).toBeVisible();
    }
  });

  test('should display chart titles and series labels', async ({ page }) => {
    for (const title of CHART_TITLES) {
      await expect(
        page.getByRole('heading', { name: title }),
        `Título "${title}" não encontrado`
      ).toBeVisible();
    }

    for (const label of CHART_LABELS) {
      await expect(
        page.getByText(label).first(),
        `Label "${label}" não encontrada`
      ).toBeVisible();
    }
  });

  test('should toggle series visibility on label click', async ({ page }) => {
    const label = page.getByText('Axial').first();

    // Valida apenas o primeiro gráfico — comportamento é o mesmo para todos
    await expectLabelActive(label);

    await label.click();
    await expectLabelInactive(label);

    await label.click();
    await expectLabelActive(label);
  });

  test('should fetch data and metadata on page load', async ({ page }) => {
    const REQUIRED_ENDPOINTS = ['/data.json', '/metadata.json'];
    const requests: string[] = [];

    page.on('request', request => requests.push(request.url()));

    const assertRequests = (label: string) => {
      for (const endpoint of REQUIRED_ENDPOINTS) {
        expect(
          requests.some(url => url.includes(endpoint)),
          `Requisição para ${endpoint} não foi disparada ${label}`
        ).toBe(true);
      }
    };

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    assertRequests('no carregamento inicial');

    requests.length = 0;

    await page.reload();
    await page.waitForLoadState('networkidle');
    assertRequests('após reload');
  });

});


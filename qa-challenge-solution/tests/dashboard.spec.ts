import { test, expect } from '@playwright/test';

test.describe('Dashboard Dynamox', () => {

  test('Exibe as informações da máquina', async ({ page }) => {

    await page.goto('https://frontend-test-for-qa.vercel.app/');

    await expect(page.getByText('Máquina 1023')).toBeVisible();
    await expect(page.getByText('Ponto 20192')).toBeVisible();
    await expect(page.getByText('200')).toBeVisible();
    await expect(page.getByText('16g')).toBeVisible();

  });

  test('Exibe os três gráficos', async ({ page }) => {

    await page.goto('https://frontend-test-for-qa.vercel.app/');

    await expect(
      page.getByRole('heading', { name: 'Aceleração RMS' })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Temperatura' })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Velocidade RMS' })
    ).toBeVisible();

  });

  test('Deve carregar os dados da API', async ({ page }) => {

    const responsePromise = page.waitForResponse(
      response => response.url().includes('/data')
    );

    await page.goto('https://frontend-test-for-qa.vercel.app/');

    const response = await responsePromise;

    expect(response.status()).toBe(200);

  });

  test('Deve exibir os filtros de aceleração', async ({ page }) => {

    await page.goto('https://frontend-test-for-qa.vercel.app/');

    await expect(
      page.getByText('Axial').first()
    ).toBeVisible();

    await expect(
      page.getByText('Horizontal').first()
    ).toBeVisible();

    await expect(
      page.getByText('Radial').first()
    ).toBeVisible();

  });

});
import { test, expect } from '@playwright/test'
import { DashboardPage } from '../pages/DashboardPage'

test.describe('Dashboard', () => {
    let dashboardPage: DashboardPage

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page)
        await dashboardPage.visit()
    })

    test('deve exibir um cabeçalho com informações das maquinas', async ({ page }) => {
        const headerTitle = page.locator('h6', { hasText: 'Análise de dados' });
        const idMachine = page.locator('span.MuiTypography-caption').filter({ hasText: /^Máquina\s+\d+$/ });
        const spot = page.locator('span.MuiTypography-caption').filter({ hasText: /^Ponto\s+\d+$/ });
        const RPM = page.locator('span.MuiTypography-caption').filter({ hasText: /^\d+$/ });
        const dynamicRange = page.locator('span.MuiTypography-caption').filter({ hasText: /^\d+g$/ });
        const interval = page.locator('span.MuiTypography-caption').filter({ hasText: /^\d+\s*min$/i });

        await expect(headerTitle).toBeVisible();
        await expect(idMachine).toBeVisible();
        await expect(spot).toBeVisible();
        await expect(RPM).toBeVisible();
        await expect(dynamicRange).toBeVisible();
        await expect(interval).toBeVisible();
    })

    test('deve exibir os títulos dos gráficos', async ({ page }) => {
        await expect(page.locator('h6', { hasText: /RMS|Temperatura/ })).toHaveCount(3);
    })

    test('deve buscar os dados ao acessar a página', async ({ page }) => {

        const dataPromise = page.waitForResponse(response =>
            response.url().endsWith('/data.json') && response.status() === 200
        );

        const metadataPromise = page.waitForResponse(response =>
            response.url().endsWith('/metadata.json') && response.status() === 200
        );

        await page.goto('/');

        const [dataResponse, metadataResponse] = await Promise.all([
            dataPromise,
            metadataPromise
        ]);

        const metadataBody = await metadataResponse.json();
        console.log(metadataBody);

        expect(dataResponse.status()).toBe(200);
        expect(metadataResponse.status()).toBe(200);
        await expect(page.getByText(metadataBody.machine)).toBeVisible();
        await expect(page.getByText(metadataBody.spot)).toBeVisible();
        await expect(page.getByText(metadataBody.rpm)).toBeVisible();
        await expect(page.getByText(metadataBody.dynamicRange)).toBeVisible();
    });

})
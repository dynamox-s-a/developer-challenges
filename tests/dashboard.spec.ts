import { test, expect } from '@playwright/test'
import { DashboardPage } from '../pages/DashboardPage'

test.describe('Dashboard', () => {
    let dashboardPage: DashboardPage

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page)
        await dashboardPage.visit()
    })

    test('deve exibir um cabeçalho com informações das maquinas', async () => {
        test.fail(true, 'Bug reportado: O cabeçalho não está sendo exibido corretamente,faltando informações de intervalo de tempo.')
        const headerTitle = dashboardPage.locators.headerTitle;
        const idMachine = dashboardPage.locators.idMachine;
        const spot = dashboardPage.locators.spot;
        const RPM = dashboardPage.locators.RPM;
        const dynamicRange = dashboardPage.locators.dynamicRange;
        const interval = dashboardPage.locators.interval;

        await expect(headerTitle).toBeVisible();
        await expect(idMachine).toBeVisible();
        await expect(spot).toBeVisible();
        await expect(RPM).toBeVisible();
        await expect(dynamicRange).toBeVisible();
        await expect(interval).toBeVisible();
    })

    test('deve exibir 3 gráficos ao acessar a pagina', async ({ page }) => {
        await expect(page.locator('h6', { hasText: /RMS|Temperatura/ })).toHaveCount(3);
        await expect(page.locator('.highcharts-series-group')).toHaveCount(3);
    })

    test('deve buscar os dados dos graficos ao acessar a página', async ({ page }) => {

        const dataPromise = page.waitForResponse(response =>
            response.url().endsWith('/data.json') && response.status() === 200
        );

        const metadataPromise = page.waitForResponse(response =>
            response.url().endsWith('/metadata.json') && response.status() === 200
        );

        await dashboardPage.visit();

        const [dataResponse, metadataResponse] = await Promise.all([
            dataPromise,
            metadataPromise
        ]);

        const metadataBody = await metadataResponse.json();

        expect(dataResponse.status()).toBe(200);
        expect(metadataResponse.status()).toBe(200);
        await expect(page.getByText(metadataBody.machine)).toBeVisible();
        await expect(page.getByText(metadataBody.spot)).toBeVisible();
        await expect(page.getByText(metadataBody.rpm)).toBeVisible();
        await expect(page.getByText(metadataBody.dynamicRange)).toBeVisible();
    });

    test('deve exibir o tooltip com os valores corretos ao repousar o mouse sobre o gráfico', async ({ page }) => {

        const fixedDate = '2026-02-13T12:00:00.000Z'; 


        const mockData = {
            data: [
                {
                    name: "accelerationRms/x",
                    data: [
                        { datetime: fixedDate, max: 0.888 }
                    ]
                }
            ]
        };

        await dashboardPage.mockChartData(mockData);
        await dashboardPage.visit();
        await expect(dashboardPage.locators.chartContainer).toBeVisible({ timeout: 10000 });
        await dashboardPage.hoverOverChart();
        await dashboardPage.validateTooltipContent('Friday, Feb 13, 2026​● Axial: 0.888 g​');
    });
});
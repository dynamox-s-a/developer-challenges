import { test, expect } from '@playwright/test'
import { DashboardPage } from '../pages/DashboardPage'

test.describe('Dashboard', () => {
    let dashboardPage: DashboardPage

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page)
        await dashboardPage.visit()
    })

    test('deve exibir um cabeçalho com informações das maquinas', async () => {
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

    test('deve buscar os dados dos gráficos ao acessar a página', async ({ page }) => {
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

    test('deve exibir o tooltip com os valores ao repousar o mouse sobre o gráfico de Aceleração', async ({ page }) => {
        const indexChartAcceleration = 0;
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
        
        await expect(dashboardPage.locators.chartAcceleration).toBeVisible({ timeout: 3000 });
        await dashboardPage.hoverOverChart(indexChartAcceleration);
        await dashboardPage.validateTooltipContent('Friday, Feb 13, 2026​● Axial: 0.888 g​');
    });

    test('deve exibir o tooltip com os valores ao repousar o mouse sobre o gráfico de Temperatura', async ({ page }) => {
        const indexChartTemperature = 1;
        const fixedDate = '2026-02-13T12:00:00.000Z';
        const mockData = {
            data: [
                {
                    name: "Temperature/x",
                    data: [
                        { datetime: fixedDate, max: 35.5 }
                    ]
                }
            ]
        };

        await dashboardPage.mockChartData(mockData);
        await dashboardPage.visit();
        await expect(dashboardPage.locators.chartTemperature).toBeVisible({ timeout: 3000 });
        await dashboardPage.hoverOverChart(indexChartTemperature);
        await dashboardPage.validateTooltipContent('Friday, Feb 13, 2026​● Axial: 35.5°C');
    });

    test('deve exibir o tooltip com os valores ao repousar o mouse sobrere o gráfico de Velocidade', async ({ page }) => {
        const indexChartVelocity = 2;
        const fixedDate = '2026-02-13T12:00:00.000Z';
        const mockData = {
            data: [
                {
                    name: "velocityRms/x",
                    data: [
                        { datetime: fixedDate, max: 0.67765 }
                    ]
                }
            ]
        };

        await dashboardPage.mockChartData(mockData);
        
        await expect(dashboardPage.locators.chartVelocity).toBeVisible({ timeout: 3000 });
        await dashboardPage.hoverOverChart(indexChartVelocity);
        await dashboardPage.validateTooltipContent('Friday, Feb 13, 2026​● Axial: 0.67765 mm/s​');
    });

    test('deve filtrar séries do gráfico de Aceleração ao interagir com a legenda', async ({ page }) => {
        const indexChartAcceleration = 0;
        const fixedDate = '2026-02-13T12:00:00.000Z';
        const mockData = {
            data: [
                {
                    name: 'accelerationRms/x',
                    data: [{ datetime: fixedDate, max: 0.05698 }]
                },
                {
                    name: 'accelerationRms/y',
                    data: [{ datetime: fixedDate, max: 0.08598 }]
                },
                {
                    name: 'accelerationRms/z',
                    data: [{ datetime: fixedDate, max: 0.03125 }]
                }
            ]
        };

        await dashboardPage.mockChartData(mockData);
        const legends = dashboardPage.locators.chartAcceleration.locator(dashboardPage.locators.legends);
        await expect(legends).toHaveCount(3);

        await dashboardPage.locators.axialLegend.click();
        await dashboardPage.locators.horizontalLegend.click();

        await expect(dashboardPage.locators.chartAcceleration.locator(dashboardPage.locators.legends, { hasText: 'Radial' })).toBeVisible();
        await expect(dashboardPage.locators.chartAcceleration).toBeVisible({ timeout: 3000 });
        await dashboardPage.hoverOverChart(indexChartAcceleration);
        await dashboardPage.validateTooltipContent('Friday, Feb 13, 2026​● Radial: 0.03125 g​');
    });
});
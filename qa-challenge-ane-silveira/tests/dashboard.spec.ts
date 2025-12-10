import { test, expect } from '@playwright/test';
import { DashboardPage } from './dashboard.page';

test.describe('Machine information', () => {

    test('check machine name', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();
        
        const machineName = page
            .locator('.MuiBox-root .MuiBox-root .MuiTypography-caption', {hasText: 'Máquina 1023'});
        
        await expect(machineName).toBeVisible();
    });

    test('check spot name', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const spotName = page
            .locator('.MuiBox-root .MuiBox-root .MuiTypography-caption', {hasText: 'Ponto 20192'});
        
        await expect(spotName).toBeVisible();
   
    });

    test('check rpm value', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const rpmValue = page
            .locator('.MuiBox-root .MuiBox-root .MuiTypography-caption', {hasText: '200'});

        await expect(rpmValue).toBeVisible();
            
    });

    test('check dynamic range value', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const dynamicRangeValue = page
            .locator('.MuiBox-root .MuiBox-root .MuiTypography-caption', {hasText: '16g'});

        await expect(dynamicRangeValue).toBeVisible();  
    });

    test('check interval value', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const intervalValue = page
            .locator('.MuiBox-root .MuiBox-root .MuiTypography-caption', {hasText: '20min'});

        await expect(intervalValue).toBeVisible();  
    });

});

test.describe('Ensure charts are visible', () => {

    test('check Aceleration RMS charts are visible,', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const acelerationChart = dashboardPage.page
            .locator('div[data-highcharts-chart="3"]');

        await expect(acelerationChart).toBeVisible();
    });

    test('check Temperature chart is visible,', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const temperatureChart = dashboardPage.page
            .locator('div[data-highcharts-chart="4"]');

        await expect(temperatureChart).toBeVisible();
    });

    test('check Velocity RMS chart is visible,', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

         const velocityChart = dashboardPage.page
            .locator('div[data-highcharts-chart="5"]');

        await expect(velocityChart).toBeVisible();
    });

});

test.describe('test graphics functionality', () => {

    test('Test acceleration graph', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const chart = dashboardPage.page
            .locator('div[data-highcharts-chart="3"]');

        const curves = chart
            .locator('.highcharts-series-group');

        const axialButton = chart.locator('.highcharts-legend-item', { hasText: 'Axial' });
        const axialColor = await axialButton.locator('.highcharts-graph').getAttribute('stroke');
        const axialCurve = curves.locator('.highcharts-graph[stroke="' + axialColor + '"]');

        const radialButton = chart.locator('.highcharts-legend-item', { hasText: 'Radial' });
        const radialColor = await radialButton.locator('.highcharts-graph').getAttribute('stroke');
        const radialCurve = curves.locator('.highcharts-graph[stroke="' + radialColor + '"]');

        const horizontalButton = chart.locator('.highcharts-legend-item', { hasText: 'Horizontal' });
        const horizontalColor = await horizontalButton.locator('.highcharts-graph').getAttribute('stroke');
        const horizontalCurve = curves.locator('.highcharts-graph[stroke="' + horizontalColor + '"]');

        await expect(axialCurve).toBeVisible();
        await expect(horizontalCurve).toBeVisible();
        await expect(radialCurve).toBeVisible();        

        await axialButton.click();
        await expect(axialCurve).toBeHidden();
        await expect(horizontalCurve).toBeVisible();
        await expect(radialCurve).toBeVisible();

        await radialButton.click();
        await expect(axialCurve).toBeHidden();
        await expect(horizontalCurve).toBeVisible();
        await expect(radialCurve).toBeHidden();

        await horizontalButton.click();
        await expect(axialCurve).toBeHidden();
        await expect(horizontalCurve).toBeHidden();
        await expect(radialCurve).toBeHidden();
    });

    test('Test temperature graph', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const chart = dashboardPage.page
            .locator('div[data-highcharts-chart="4"]');
            
        const curve = chart
            .locator('.highcharts-series-group');

        const temperatureButton = chart.locator('.highcharts-legend-item', { hasText: 'Temperatura' });
        const temperatureColor = await temperatureButton.locator('.highcharts-graph').getAttribute('stroke');
        const temperatureCurve = curve.locator('.highcharts-graph[stroke="' + temperatureColor + '"]');

        await expect(temperatureCurve).toBeVisible();

        await temperatureButton.click();
        await expect(temperatureCurve).toBeHidden();
    });

    test('Test velocity RMS graph', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const chart = dashboardPage.page
            .locator('div[data-highcharts-chart="5"]');
            
        const curve = chart
            .locator('.highcharts-series-group');

        const axialButton = chart.locator('.highcharts-legend-item', { hasText: 'Axial' });
        const axialColor = await axialButton.locator('.highcharts-graph').getAttribute('stroke');
        const axialCurve = curve.locator('.highcharts-graph[stroke="' + axialColor + '"]');

        const radialButton = chart.locator('.highcharts-legend-item', { hasText: 'Radial' });
        const radialColor = await radialButton.locator('.highcharts-graph').getAttribute('stroke');
        const radialCurve = curve.locator('.highcharts-graph[stroke="' + radialColor + '"]');

        const horizontalButton = chart.locator('.highcharts-legend-item', { hasText: 'Horizontal' });
        const horizontalColor = await horizontalButton.locator('.highcharts-graph').getAttribute('stroke');
        const horizontalCurve = curve.locator('.highcharts-graph[stroke="' + horizontalColor + '"]');

        await expect(axialCurve).toBeVisible();
        await expect(horizontalCurve).toBeVisible();
        await expect(radialCurve).toBeVisible();        

        await axialButton.click();
        await expect(axialCurve).toBeHidden();
        await expect(horizontalCurve).toBeVisible();
        await expect(radialCurve).toBeVisible();

        await radialButton.click();
        await expect(axialCurve).toBeHidden();
        await expect(horizontalCurve).toBeVisible();
        await expect(radialCurve).toBeHidden();

        await horizontalButton.click();
        await expect(axialCurve).toBeHidden();
        await expect(horizontalCurve).toBeHidden();
        await expect(radialCurve).toBeHidden();

    });
});

test('Test hover Aceleration', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        const chart = dashboardPage.page
            .locator('div[data-highcharts-chart="3"]');

        await chart.hover();
        const tooltip = chart.locator('.highcharts-tooltip');
        await chart.hover();
        await expect(tooltip).toBeVisible();

        await page.mouse.move(0, 0);
        
        await expect(tooltip).toBeHidden();
        await expect(tooltip).toHaveAttribute('opacity', '0');

        await chart.hover();
        await expect(tooltip).toBeVisible();
        await expect(tooltip).toHaveAttribute('opacity', '1');

        const textTooltip = tooltip.locator('highcharts-color-undefined')

        await expect(tooltip).toHaveText('Thursday, Nov 23, 12:00:15 AM​● Radial: 0 g​');   
});

test('Test hover Temperature', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    const chart = dashboardPage.page
        .locator('div[data-highcharts-chart="4"]');
        
    await chart.hover();
    const tooltip = chart.locator('.highcharts-tooltip');
    await chart.hover();
    await expect(tooltip).toBeVisible();

    await page.mouse.move(0, 0);
    
    await expect(tooltip).toBeHidden();
    await expect(tooltip).toHaveAttribute('opacity', '0');

    await chart.hover();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveAttribute('opacity', '1');

    await expect(tooltip).toHaveText('Thursday, Nov 23, 12:00:15 AM​● Temperatura: 22 °C​');
});

test('Test hover Velocity RMS', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    const chart = dashboardPage.page
        .locator('div[data-highcharts-chart="5"]');

    await chart.hover();
    const tooltip = chart.locator('.highcharts-tooltip');
    await chart.hover();
    await expect(tooltip).toBeVisible();

    await page.mouse.move(0, 0);
    
    await expect(tooltip).toBeHidden();
    await expect(tooltip).toHaveAttribute('opacity', '0');

    await chart.hover();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveAttribute('opacity', '1');

    await expect(tooltip).toHaveText('Thursday, Nov 23, 03:00:15 PM​● Radial: 4.150384615384616 mm/s');
});  


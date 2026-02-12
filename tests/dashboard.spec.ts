import { test, expect } from '@playwright/test'
import { DashboardPage } from '../pages/DashboardPage'

test.describe('Dashboard', () => {
    let dashboardPage: DashboardPage

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page)
        await dashboardPage.visit()
    })

    test('deve exibir os títulos dos gráficos', async () => {
        await expect(dashboardPage.page.locator('h6', { hasText: /RMS|Temperatura/ })).toHaveCount(3);
    })
})
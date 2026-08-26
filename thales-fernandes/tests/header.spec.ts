import { test, expect } from '@playwright/test';

test.describe('Header, machine information (challenge RN1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('17. displays page title', async ({ page }) => {
    await expect(page.getByText('Análise de dados')).toBeVisible();
  });

  test('18. displays Máquina and Ponto from the API', async ({ page }) => {
    await expect(page.getByText(/^Máquina \S+/)).toBeVisible();
    await expect(page.getByText(/^Ponto \S+/)).toBeVisible();
  });

  test('19. displays "rpm" and "dynamicRange" fields', async ({ page }) => {
    await expect(page.getByText(/^\d+g$/)).toBeVisible(); // dynamicRange, ex: "16g"
  });

  test('20. header interval text matches "<número> min"', async ({ page }) => {
    const interval = page.getByText(/min$/);
    await expect(interval).toBeVisible();
    await expect(interval).toHaveText(/^\d+\s?min$/);
  });
});

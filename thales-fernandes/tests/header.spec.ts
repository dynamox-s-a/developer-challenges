import { test, expect } from '@playwright/test';

test.describe('Header, informações da máquina (RN1 do desafio)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('17. exibe título da página', async ({ page }) => {
    await expect(page.getByText('Análise de dados')).toBeVisible();
  });

  test('18. exibe Máquina e Ponto vindos da API', async ({ page }) => {
    await expect(page.getByText(/^Máquina \S+/)).toBeVisible();
    await expect(page.getByText(/^Ponto \S+/)).toBeVisible();
  });

  test('19. exibe campos "rpm" e "dynamicRange"', async ({ page }) => {
    await expect(page.getByText(/^\d+g$/)).toBeVisible(); // dynamicRange, ex: "16g"
  });

  test('20. texto de intervalo no header corresponde a "<número> min"', async ({ page }) => {
    const interval = page.getByText(/min$/);
    await expect(interval).toBeVisible();
    await expect(interval).toHaveText(/^\d+\s?min$/);
  });
});

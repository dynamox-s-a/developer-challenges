# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: header.spec.ts >> Header, machine information (challenge RN1) >> 20. header interval text matches "<número> min"
- Location: tests/header.spec.ts:21:7

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByText(/min$/)
Expected pattern: /^\d+\s?min$/
Received string:  "null min"
Timeout: 5000ms

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for getByText(/min$/)
    14 × locator resolved to <span class="MuiTypography-root MuiTypography-caption css-uij8q3">null min</span>
       - unexpected value "null min"

```

```yaml
- text: null min
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Header, machine information (challenge RN1)', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('17. displays page title', async ({ page }) => {
  9  |     await expect(page.getByText('Análise de dados')).toBeVisible();
  10 |   });
  11 | 
  12 |   test('18. displays Máquina and Ponto from the API', async ({ page }) => {
  13 |     await expect(page.getByText(/^Máquina \S+/)).toBeVisible();
  14 |     await expect(page.getByText(/^Ponto \S+/)).toBeVisible();
  15 |   });
  16 | 
  17 |   test('19. displays "rpm" and "dynamicRange" fields', async ({ page }) => {
  18 |     await expect(page.getByText(/^\d+g$/)).toBeVisible(); // dynamicRange, ex: "16g"
  19 |   });
  20 | 
  21 |   test('20. header interval text matches "<número> min"', async ({ page }) => {
  22 |     const interval = page.getByText(/min$/);
  23 |     await expect(interval).toBeVisible();
> 24 |     await expect(interval).toHaveText(/^\d+\s?min$/);
     |                            ^ Error: expect(locator).toHaveText(expected) failed
  25 |   });
  26 | });
  27 | 
```
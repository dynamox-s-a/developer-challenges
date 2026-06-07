import test, { expect } from "@playwright/test";

const EXPECTED_SERIES = [
  'accelerationRms/x',
  'accelerationRms/y',
  'accelerationRms/z',
  'velocityRms/x',
  'velocityRms/y',
  'velocityRms/z',
  'temperature',
];

test.describe('GET /data.json', () => {

  test('should return status 200', async ({ request }) => {
    const response = await request.get('https://frontend-test-for-qa.vercel.app/data.json');
    expect(response.status()).toBe(200);
  });

  test('should contain all expected series', async ({ request }) => {
    const response = await request.get('https://frontend-test-for-qa.vercel.app/data.json');
    const body = await response.json();

    const seriesNames = body.data.map((serie: { name: string }) => serie.name);

    for (const expected of EXPECTED_SERIES) {
      expect(seriesNames, `Série "${expected}" não encontrada`).toContain(expected);
    }
  });

  test('should not contain null values in max field', async ({ request }) => {
    const response = await request.get('https://frontend-test-for-qa.vercel.app/data.json');
    const body = await response.json();

    for (const serie of body.data) {
      for (const point of serie.data) {
        expect(
          point.max,
          `Série "${serie.name}" contém valor inválido em max: ${point.max} (datetime: ${point.datetime})`
        ).not.toBe('null');
        expect(
          point.max,
          `Série "${serie.name}" contém null em max (datetime: ${point.datetime})`
        ).not.toBeNull();
      }
    }
  });

  test('should have valid datetime format in all records', async ({ request }) => {
    const response = await request.get('https://frontend-test-for-qa.vercel.app/data.json');
    const body = await response.json();

    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

    for (const serie of body.data) {
      for (const point of serie.data) {
        expect(
          isoRegex.test(point.datetime),
          `Série "${serie.name}" contém datetime inválido: ${point.datetime}`
        ).toBe(true);
      }
    }
  });

});
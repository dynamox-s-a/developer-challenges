import { test, expect } from './support/api-fixtures';

/**
 * Contrato das APIs consumidas pela página.
 *
 * Nota de escopo: o desafio descreve os endpoints como GET /data e GET /metadata,
 * mas a implementação real serve GET /data.json e GET /metadata.json
 * (confirmado via DevTools). Ver docs/questions-to-designer.md, reportado como divergência
 * entre spec e implementação, não é bug, mas time de produto deveria saber.
 */
test.describe('API /metadata.json', () => {
  test('1. retorna todos os campos esperados pelo header', async ({ apiCalls }) => {
    const { metadata } = apiCalls;
    expect(metadata).toHaveProperty('machine');
    expect(metadata).toHaveProperty('spot');
    expect(metadata).toHaveProperty('rpm');
    expect(metadata).toHaveProperty('dynamicRange');
    expect(metadata).toHaveProperty('interval');
  });

  test('2. campos "machine" e "spot" devem ser string não vazia', async ({ apiCalls }) => {
    const { metadata } = apiCalls;
    expect(metadata.machine).toMatch(/\S/);
    expect(metadata.spot).toMatch(/\S/);
  });

  test('3. campo "interval" deve ser number', async ({ apiCalls }) => {
    const { metadata } = apiCalls;
    expect(typeof metadata.interval).toBe('number');
  });
});

test.describe('API /data.json', () => {
  test('4. retorna as 7 séries esperadas (3 eixos x2 grandezas + temperatura)', async ({ apiCalls }) => {
    const { data } = apiCalls;
    const names = data.data.map((s) => s.name).sort();
    expect(names).toEqual(
      [
        'accelerationRms/x',
        'accelerationRms/y',
        'accelerationRms/z',
        'velocityRms/x',
        'velocityRms/y',
        'velocityRms/z',
        'temperature',
      ].sort()
    );
  });

  test('5. todas as séries têm o mesmo número de pontos (séries alinhadas no tempo)', async ({ apiCalls }) => {
    const { data } = apiCalls;
    const lengths = new Set(data.data.map((s) => s.data.length));
    expect(lengths.size).toBe(1);
  });

  test('6. campo "max" deve ser number ou null', async ({ apiCalls }) => {
    const { data } = apiCalls;
    const offenders = data.data.flatMap((s) =>
      s.data
        .filter((p) => typeof p.max !== 'number' && p.max !== null)
        .map((p) => `${s.name}@${p.datetime} (recebido: ${JSON.stringify(p.max)})`)
    );
    expect(offenders).toEqual([]);
  });
});

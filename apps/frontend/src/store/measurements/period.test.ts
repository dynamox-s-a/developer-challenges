import { describe, expect, it } from 'vitest';

import { periodToRange } from './period';

const LAST_READING = '2023-12-12T15:02:42.000Z';

describe('periodToRange', () => {
  it('não recorta quando o período é "all"', () => {
    expect(periodToRange('all', LAST_READING)).toEqual({});
  });

  it('ancora o recorte na última leitura, não no relógio do usuário', () => {
    expect(periodToRange('7d', LAST_READING)).toEqual({
      from: '2023-12-05T15:02:42.000Z',
      to: LAST_READING,
    });
  });

  it('conta os dias corretos para 30 dias, atravessando a virada de mês', () => {
    expect(periodToRange('30d', LAST_READING)).toEqual({
      from: '2023-11-12T15:02:42.000Z',
      to: LAST_READING,
    });
  });

  it('não recorta quando a âncora é ausente ou inválida', () => {
    expect(periodToRange('7d', undefined)).toEqual({});
    expect(periodToRange('7d', 'não é data')).toEqual({});
  });
});

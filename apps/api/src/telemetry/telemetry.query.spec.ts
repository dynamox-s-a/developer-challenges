/**
 * Unitários puros do parser de query de amostras (TS-03): limites, inteiros seguros e
 * rejeição de parâmetros desconhecidos, sem Nest nem banco.
 */
import { BadRequestException } from '@nestjs/common';

import { parseSamplesQuery } from './telemetry.controller';

function errorCode(fn: () => unknown): string {
  try {
    fn();
  } catch (error) {
    if (error instanceof BadRequestException) {
      return (error.getResponse() as { code: string }).code;
    }
    throw error;
  }
  throw new Error('esperava BadRequestException');
}

describe('parseSamplesQuery — recuperação completa sem truncamento silencioso', () => {
  it('sem parâmetros, usa limit 500 e offset 0', () => {
    expect(parseSamplesQuery({})).toEqual({ limit: 500, offset: 0 });
  });

  it('aceita os extremos válidos de limit (1 e 5000) e offset arbitrário', () => {
    expect(parseSamplesQuery({ limit: '1' })).toEqual({ limit: 1, offset: 0 });
    expect(parseSamplesQuery({ limit: '5000', offset: '12345' })).toEqual({
      limit: 5000,
      offset: 12345,
    });
  });

  it('recusa limit fora de 1..5000 e offset negativo ou não numérico', () => {
    for (const query of [
      { limit: '0' },
      { limit: '5001' },
      { limit: 'abc' },
      { offset: '-1' },
      { offset: '1.5' },
    ]) {
      expect(errorCode(() => parseSamplesQuery(query))).toBe('INVALID_SAMPLES_QUERY');
    }
  });

  it('recusa inteiros gigantes que virariam Infinity no OFFSET (400, nunca 500)', () => {
    expect(errorCode(() => parseSamplesQuery({ offset: '9'.repeat(400) }))).toBe(
      'INVALID_SAMPLES_QUERY',
    );
  });

  it('recusa parâmetro desconhecido em vez de ignorá-lo', () => {
    expect(errorCode(() => parseSamplesQuery({ foo: '1' }))).toBe('INVALID_SAMPLES_QUERY');
  });
});

import { describe, expect, it } from 'bun:test';

import { computeStats, filterPointsByRange, parseSeriesId } from './series';

describe('parseSeriesId', () => {
  it('separa grandeza e eixo das séries do acelerômetro', () => {
    expect(parseSeriesId('accelerationRms/x')).toEqual({ metric: 'acceleration', axis: 'x' });
    expect(parseSeriesId('velocityRms/z')).toEqual({ metric: 'velocity', axis: 'z' });
  });

  it('trata temperatura como grandeza escalar, sem eixo', () => {
    expect(parseSeriesId('temperature')).toEqual({ metric: 'temperature', axis: null });
  });

  it('ignora séries desconhecidas ou com eixo inválido', () => {
    expect(parseSeriesId('humidity')).toBeNull();
    expect(parseSeriesId('velocityRms/w')).toBeNull();
  });
});

describe('computeStats', () => {
  it('calcula mínimo, máximo, média e última leitura', () => {
    const points = [
      { datetime: '2023-11-07T00:00:00.000Z', max: 2 },
      { datetime: '2023-11-08T00:00:00.000Z', max: 6 },
      { datetime: '2023-11-09T00:00:00.000Z', max: 4 },
    ];

    expect(computeStats(points)).toEqual({ min: 2, max: 6, avg: 4, last: 4 });
  });

  it('não quebra com série vazia', () => {
    expect(computeStats([])).toEqual({ min: 0, max: 0, avg: 0, last: 0 });
  });
});

describe('filterPointsByRange', () => {
  const points = [
    { datetime: '2023-11-07T00:00:00.000Z', max: 1 },
    { datetime: '2023-11-08T00:00:00.000Z', max: 2 },
    { datetime: '2023-11-09T00:00:00.000Z', max: 3 },
  ];

  it('recorta pelo intervalo, incluindo os limites', () => {
    const result = filterPointsByRange(points, '2023-11-08T00:00:00.000Z', '2023-11-09T00:00:00.000Z');

    expect(result.map((point) => point.max)).toEqual([2, 3]);
  });

  it('aceita limite aberto de um lado só', () => {
    expect(filterPointsByRange(points, undefined, '2023-11-07T12:00:00.000Z')).toHaveLength(1);
    expect(filterPointsByRange(points, '2023-11-08T12:00:00.000Z')).toHaveLength(1);
  });

  it('devolve a série inteira quando não há limites ou eles são inválidos', () => {
    expect(filterPointsByRange(points)).toHaveLength(3);
    expect(filterPointsByRange(points, 'não é data')).toHaveLength(3);
  });
});

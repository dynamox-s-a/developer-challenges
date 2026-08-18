import { describe, expect, it } from 'vitest';
import { parseSeries } from './parserSeries';

describe('parseSeries', () => {
  it('returns an empty array when data is not provided', () => {
    expect(parseSeries(undefined, [0, 1])).toEqual([]);
    expect(parseSeries([], [0, 1])).toEqual([]);
  });

  it('returns an empty array when indexes are not provided', () => {
    const data = [{ name: 'S1', data: [{ datetime: 1710000000000, max: 10 }] }];

    expect(parseSeries(data, [])).toEqual([]);
    expect(parseSeries(data, undefined as unknown as number[])).toEqual([]);
  });

  it('ignores non-existing indexes', () => {
    const data = [{ name: 'S1', data: [{ datetime: 1710000000000, max: 10 }] }];

    expect(parseSeries(data, [0, 3, 9])).toEqual([
      {
        name: 'S1',
        type: 'line',
        data: [[1710000000000, 10]],
      },
    ]);
  });

  it('converts correctly items to Highcharts series', () => {
    const data = [
      {
        name: 'Acel X',
        data: [
          { datetime: 1710000000000, max: 1.2 },
          { datetime: 1710000060000, max: 1.4 },
        ],
      },
      {
        name: 'Acel Y',
        data: [{ datetime: '2024-03-10T12:00:00Z', max: 2.5 }],
      },
    ];

    const result = parseSeries(data, [0, 1]);

    expect(result).toEqual([
      {
        name: 'Acel X',
        type: 'line',
        data: [
          [1710000000000, 1.2],
          [1710000060000, 1.4],
        ],
      },
      {
        name: 'Acel Y',
        type: 'line',
        data: [['2024-03-10T12:00:00Z', 2.5]],
      },
    ]);
  });
});

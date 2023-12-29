import { expect, test, describe } from 'vitest';
import { generateLineChart } from './generateLineChart';
import { TDataChartLine, TResponseChart } from '@/common/types';

describe('generateLineChart', () => {
  const mockData: TResponseChart = {
    data: [
      {
        datetime: '2023-11-07T11:53:38.187Z',
        max: 0,
      },
      {
        datetime: '2023-11-07T15:59:08.000Z',
        max: 0,
      },
      {
        datetime: '2023-11-07T19:59:08.000Z',
        max: 0,
      },
    ],
    name: 'test',
  };
  const newData: TDataChartLine = {
    axisName: 'test generateLineChart',
    range: ['07-nov', '07-nov', '07-nov'],
    series: [
      ['07-nov-2023 08:53', 0],
      ['07-nov-2023 12:59', 0],
      ['07-nov-2023 04:59', 0],
    ],
  };
  test('should process the data and mounting the new array of data ', () => {
    expect(
      generateLineChart({ axisName: 'test generateLineChart', data: mockData }),
    ).toStrictEqual(newData);
  });
});

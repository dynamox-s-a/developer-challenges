import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import Chart from './index';

const mockSeries = [
  {
    type: 'line',
    name: 'Temperature',
    data: [18, 21, 19, 23, 25],
  },
  {
    type: 'line',
    name: 'Pressure',
    data: [101, 99, 100, 102, 103],
  },
] as ComponentProps<typeof Chart>['series'];

describe('Chart', () => {
  it('renders correctly', () => {
    const { container } = render(
      <Chart title={'Chart Title'} series={mockSeries} xAxisTitle={'x axis title'} />,
    );

    expect(container.firstChild).toBeTruthy();
    expect(screen.getByText('Chart Title')).toBeTruthy();
    expect(screen.getByText('Temperature')).toBeTruthy();
    expect(screen.getByText('Pressure')).toBeTruthy();
  });
});

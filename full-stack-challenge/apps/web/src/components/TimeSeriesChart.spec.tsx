import type { ReadingDto } from '@dynapredict/shared-types';
import { ThemeProvider } from '@mui/material';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { cloneElement, type ReactElement } from 'react';
import { createAppTheme } from '../theme/createAppTheme';
import {
  describeChart,
  TimeSeriesChart,
  toChartPoints,
} from './TimeSeriesChart';

// jsdom has no layout, so ResponsiveContainer would measure 0×0 and draw
// nothing. Give the chart a fixed size instead.
vi.mock('recharts', async (importOriginal) => {
  const recharts = await importOriginal<typeof import('recharts')>();
  return {
    ...recharts,
    ResponsiveContainer: ({ children }: { children: ReactElement }) =>
      cloneElement(
        children as ReactElement<{ width: number; height: number }>,
        {
          width: 800,
          height: 400,
        },
      ),
  };
});

const START = Date.UTC(2026, 9, 1, 12);

function series(values: number[], offsetMinutes = 0): ReadingDto[] {
  return values.map((value, i) => ({
    timestamp: new Date(START + (offsetMinutes + i * 5) * 60_000).toISOString(),
    value,
  }));
}

const readings = series([1, 3, 2]);
const forecast = series([2.5, 2.6], 15);

function renderChart(
  props: Partial<Parameters<typeof TimeSeriesChart>[0]> = {},
  mode: 'light' | 'dark' = 'light',
) {
  return render(
    <ThemeProvider theme={createAppTheme(mode)}>
      <TimeSeriesChart readings={readings} forecast={forecast} {...props} />
    </ThemeProvider>,
  );
}

function linePaths(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<SVGPathElement>('path.recharts-line-curve'),
  );
}

describe('toChartPoints', () => {
  it('puts both series on one axis and joins them at the last reading', () => {
    const points = toChartPoints(readings, forecast);
    expect(points).toHaveLength(5);
    expect(points[2]).toEqual({
      t: Date.parse(readings[2].timestamp),
      reading: 2,
      forecast: 2,
    });
    expect(points[3]).toEqual({
      t: Date.parse(forecast[0].timestamp),
      forecast: 2.5,
    });
  });

  it('leaves the readings alone without a forecast', () => {
    expect(
      toChartPoints(readings, []).every((p) => p.forecast === undefined),
    ).toBe(true);
  });
});

describe('describeChart', () => {
  it('summarises the series and the forecast in one sentence', () => {
    const text = describeChart(readings, forecast);
    expect(text).toMatch(
      /^Line chart of 3 readings from .+ to .+, ranging from 1 to 3/,
    );
    expect(text).toContain('followed by a forecast of 2 points ending at 2.6.');
  });

  it('says when there is nothing to plot', () => {
    expect(describeChart([], [])).toBe('No readings to plot.');
  });
});

describe('TimeSeriesChart', () => {
  it('draws the readings and a dashed forecast in the theme colours', () => {
    const { container } = renderChart();
    const theme = createAppTheme('light');
    const [readingsLine, forecastLine] = linePaths(container);

    expect(readingsLine.getAttribute('stroke')).toBe(
      theme.palette.chart.readings,
    );
    expect(readingsLine.getAttribute('stroke-dasharray')).toBeNull();
    expect(forecastLine.getAttribute('stroke')).toBe(
      theme.palette.chart.forecast,
    );
    expect(forecastLine.getAttribute('stroke-dasharray')).toBe('6 4');
  });

  it('uses the dark steps in dark mode', () => {
    const { container } = renderChart({}, 'dark');
    expect(linePaths(container)[0].getAttribute('stroke')).toBe(
      createAppTheme('dark').palette.chart.readings,
    );
  });

  it('names both series in a legend', () => {
    renderChart();
    const legend = screen.getByRole('list', { name: 'Legend' });
    expect(
      within(legend)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Readings', 'Forecast']);
  });

  it('describes the chart in text tied to the figure', () => {
    renderChart();
    const figure = screen.getByRole('figure', { name: 'Readings chart' });
    const summary = document.getElementById(
      figure.getAttribute('aria-describedby') ?? '',
    );
    expect(summary?.textContent).toContain('Line chart of 3 readings');
  });

  it('offers the values as a table', () => {
    renderChart();
    const toggle = screen.getByRole('button', { name: 'Show data table' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(toggle);

    const table = screen.getByRole('table', { name: 'Chart data' });
    // Header + 3 readings + 2 forecast points.
    expect(within(table).getAllByRole('row')).toHaveLength(6);
    expect(within(table).getAllByText('Forecast')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: 'Hide data table' }),
    ).toBeTruthy();
  });

  it('omits the forecast from the legend when there is none', () => {
    const { container } = renderChart({ forecast: [] });
    expect(linePaths(container)).toHaveLength(1);
    expect(
      within(screen.getByRole('list', { name: 'Legend' })).queryByText(
        'Forecast',
      ),
    ).toBeNull();
  });

  it('explains an empty series instead of drawing empty axes', () => {
    const { container } = renderChart({ readings: [], forecast: [] });
    expect(screen.getByText(/No readings to plot yet/)).toBeTruthy();
    expect(container.querySelector('svg.recharts-surface')).toBeNull();
  });
});

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '@mui/material';
import Highcharts from 'highcharts';
import { Chart } from './index';
import { mockChartData, theme } from './chart.mock';

vi.mock('highcharts', () => ({
  default: {
    chart: vi.fn(() => ({
      destroy: vi.fn(),
    })),
  },
}));

const renderChart = () => {
  return render(
    <ThemeProvider theme={theme}>
      <Chart data={mockChartData} />
    </ThemeProvider>,
  );
};

describe('Chart component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render CardWrapper with the correct title and initialize Highcharts', () => {
    renderChart();

    expect(screen.getByText(mockChartData.chartTitle)).toBeInTheDocument();
    expect(Highcharts.chart).toHaveBeenCalledTimes(1);
  });

  it('should destroy the Highcharts instance when unmounting the component', () => {
    const mockDestroy = vi.fn();

    vi.mocked(Highcharts.chart).mockReturnValueOnce({
      destroy: mockDestroy,
    } as unknown as Highcharts.Chart);

    const { unmount } = renderChart();

    unmount();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });
});

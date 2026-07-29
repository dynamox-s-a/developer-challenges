import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from '@mui/material';
import type { MetricsResponse } from '../../features/data/types';
import { ERROR_MESSAGES } from '../../features/data/constants';
import { mockMetricsResponse, mockValidCharts } from '../../mocks/metricsMock';
import { theme } from '../../mocks/themeMock';
import DataPage from './index';
import { useMetricsData } from './useMetricsData';
import { getValidCharts } from './chartMetricsMapper';
import { DATA_PAGE_TEXTS } from './constants';

vi.mock('./useMetricsData');
vi.mock('./chartMetricsMapper');

const renderDataPage = () => {
  return render(
    <ThemeProvider theme={theme}>
      <DataPage />
    </ThemeProvider>,
  );
};

describe('DataPage Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component title and machine summary', () => {
    vi.mocked(useMetricsData).mockReturnValue({
      metrics: {} as MetricsResponse,
      isLoading: false,
      error: null,
    });
    vi.mocked(getValidCharts).mockReturnValue([]);

    renderDataPage();

    expect(screen.getByTestId('page-header-title')).toHaveTextContent(
      DATA_PAGE_TEXTS.pageTitle,
    );
    expect(
      screen.getByTestId('machine-summary-bar-container'),
    ).toBeInTheDocument();
  });

  it('should only display Loading component when isLoading is true', () => {
    vi.mocked(useMetricsData).mockReturnValue({
      metrics: {} as MetricsResponse,
      isLoading: true,
      error: null,
    });

    renderDataPage();

    expect(
      screen.getByTestId('data-page-charts-container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('loading-container')).toBeInTheDocument();
    expect(screen.queryByTestId('error-wrapper')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('data-page-wrapper-chat'),
    ).not.toBeInTheDocument();
    const charts = screen.queryAllByTestId('chart-content');
    expect(charts).toEqual([]);
  });

  it('should only display error message when there is a failure', () => {
    vi.mocked(useMetricsData).mockReturnValue({
      metrics: {} as MetricsResponse,
      isLoading: false,
      error: ERROR_MESSAGES.FETCH_METRICS,
    });

    renderDataPage();

    expect(screen.getByTestId('error-wrapper')).toBeInTheDocument();
    expect(screen.getByText(ERROR_MESSAGES.FETCH_METRICS)).toBeInTheDocument();
    expect(
      screen.queryByTestId('data-page-charts-container'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading-container')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('data-page-wrapper-chat'),
    ).not.toBeInTheDocument();
    const charts = screen.queryAllByTestId('chart-content');
    expect(charts).toEqual([]);
  });

  it('should render graphs when returns valid data', () => {
    vi.mocked(useMetricsData).mockReturnValue({
      metrics: mockMetricsResponse,
      isLoading: false,
      error: null,
    });
    vi.mocked(getValidCharts).mockReturnValue(mockValidCharts);

    renderDataPage();

    const charts = screen.getAllByTestId('chart-content');
    expect(charts).toHaveLength(mockValidCharts.length);
  });
});

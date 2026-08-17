import { RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import Highcharts from 'highcharts';
import useChartSync from './useChartSync';

vi.mock('highcharts', () => ({
  default: {
    charts: [],
  },
}));

type MockChart = {
  pointer: { normalize: ReturnType<typeof vi.fn> };
  series: Array<{ searchPoint?: ReturnType<typeof vi.fn> }>;
  tooltip: { refresh: ReturnType<typeof vi.fn>; hide: ReturnType<typeof vi.fn> };
  xAxis: Array<{
    drawCrosshair: ReturnType<typeof vi.fn>;
    hideCrosshair: ReturnType<typeof vi.fn>;
  }>;
  hoverPoints?: unknown[];
};

function createMockChart(foundPoint: unknown = { x: 1, y: 2 }): MockChart {
  return {
    pointer: { normalize: vi.fn((e) => e) },
    series: [{ searchPoint: vi.fn(() => foundPoint) }],
    tooltip: { refresh: vi.fn(), hide: vi.fn() },
    xAxis: [{ drawCrosshair: vi.fn(), hideCrosshair: vi.fn() }],
  };
}

function createMockChartWithOptions(options?: {
  foundPoint?: unknown;
  includeSearchPoint?: boolean;
  includeTooltip?: boolean;
  includeXAxis?: boolean;
  normalizeThrows?: boolean;
  hoverPoints?: unknown[];
}) {
  const foundPoint = options?.foundPoint ?? { x: 1, y: 2 };
  const includeSearchPoint = options?.includeSearchPoint ?? true;
  const includeTooltip = options?.includeTooltip ?? true;
  const includeXAxis = options?.includeXAxis ?? true;
  const normalizeThrows = options?.normalizeThrows ?? false;

  const chart = {
    pointer: {
      normalize: normalizeThrows
        ? vi.fn(() => {
            throw new Error('normalize failed');
          })
        : vi.fn((e) => e),
    },
    series: includeSearchPoint ? [{ searchPoint: vi.fn(() => foundPoint) }] : [{}],
    hoverPoints: options?.hoverPoints,
    tooltip: includeTooltip ? { refresh: vi.fn(), hide: vi.fn() } : undefined,
    xAxis: includeXAxis ? [{ drawCrosshair: vi.fn(), hideCrosshair: vi.fn() }] : undefined,
  };

  return chart;
}

describe('useChartSync', () => {
  beforeEach(() => {
    (Highcharts.charts as unknown[]) = [];
    vi.clearAllMocks();
  });

  it('does not attach listeners when data is empty', () => {
    const container = document.createElement('div');
    const addSpy = vi.spyOn(container, 'addEventListener');
    const containerRef = { current: container } as RefObject<HTMLDivElement>;

    renderHook(() => useChartSync({ containerRef, data: [] }));

    expect(addSpy).not.toHaveBeenCalled();
  });

  it('syncs tooltip and crosshair on mousemove when a point is found', () => {
    const container = document.createElement('div');
    const point = { x: 10, y: 20 };
    const chart = createMockChart(point);
    (Highcharts.charts as unknown[]) = [chart];

    const containerRef = { current: container } as RefObject<HTMLDivElement>;
    renderHook(() => useChartSync({ containerRef, data: [1] }));

    container.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

    expect(chart.pointer.normalize).toHaveBeenCalled();
    expect(chart.tooltip.refresh).toHaveBeenCalledWith([point]);
    expect(chart.xAxis[0].drawCrosshair).toHaveBeenCalled();
  });

  it('hides tooltip and crosshair on mousemove when no point is found', () => {
    const container = document.createElement('div');
    const chart = createMockChart(null);
    (Highcharts.charts as unknown[]) = [chart];

    const containerRef = { current: container } as RefObject<HTMLDivElement>;
    renderHook(() => useChartSync({ containerRef, data: [1] }));

    container.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

    expect(chart.tooltip.hide).toHaveBeenCalled();
    expect(chart.xAxis[0].hideCrosshair).toHaveBeenCalled();
  });

  it('hides tooltip and crosshair on mouseleave', () => {
    const container = document.createElement('div');
    const chart = createMockChart();
    (Highcharts.charts as unknown[]) = [chart];

    const containerRef = { current: container } as RefObject<HTMLDivElement>;
    renderHook(() => useChartSync({ containerRef, data: [1] }));

    container.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    expect(chart.tooltip.hide).toHaveBeenCalled();
    expect(chart.xAxis[0].hideCrosshair).toHaveBeenCalled();
  });

  it('removes listeners on unmount', () => {
    const container = document.createElement('div');
    const removeSpy = vi.spyOn(container, 'removeEventListener');
    const containerRef = { current: container } as RefObject<HTMLDivElement>;

    const { unmount } = renderHook(() => useChartSync({ containerRef, data: [1] }));
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
  });

  it('attaches listeners to document.body when containerRef.current is null', () => {
    const addSpy = vi.spyOn(document.body, 'addEventListener');
    const removeSpy = vi.spyOn(document.body, 'removeEventListener');
    const containerRef = { current: null } as RefObject<HTMLDivElement>;

    const { unmount } = renderHook(() => useChartSync({ containerRef, data: [1] }));

    expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
  });

  it('ignores null charts and charts without searchPoint safely', () => {
    const container = document.createElement('div');
    const chartWithoutSearchPoint = createMockChartWithOptions({ includeSearchPoint: false });
    (Highcharts.charts as unknown[]) = [null, chartWithoutSearchPoint];

    const containerRef = { current: container } as RefObject<HTMLDivElement>;
    renderHook(() => useChartSync({ containerRef, data: [1] }));

    expect(() => {
      container.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      container.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    }).not.toThrow();

    expect(chartWithoutSearchPoint.pointer.normalize).toHaveBeenCalled();
    expect('searchPoint' in chartWithoutSearchPoint.series[0]).toBe(false);
  });

  it('uses hoverPoints when available on tooltip refresh', () => {
    const container = document.createElement('div');
    const point = { x: 10, y: 20 };
    const hoverPoints = [{ x: 11, y: 21 }];
    const chart = createMockChartWithOptions({ foundPoint: point, hoverPoints });
    (Highcharts.charts as unknown[]) = [chart];

    const containerRef = { current: container } as RefObject<HTMLDivElement>;
    renderHook(() => useChartSync({ containerRef, data: [1] }));

    container.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

    expect(chart.tooltip?.refresh).toHaveBeenCalledWith(hoverPoints);
  });

  it('does not fail when chart has no tooltip or xAxis', () => {
    const container = document.createElement('div');
    const chart = createMockChartWithOptions({ includeTooltip: false, includeXAxis: false });
    (Highcharts.charts as unknown[]) = [chart];

    const containerRef = { current: container } as RefObject<HTMLDivElement>;
    renderHook(() => useChartSync({ containerRef, data: [1] }));

    expect(() => {
      container.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
      container.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    }).not.toThrow();
  });

  it('swallows per-chart errors and continues processing other charts', () => {
    const container = document.createElement('div');
    const failingChart = createMockChartWithOptions({ normalizeThrows: true });
    const healthyPoint = { x: 5, y: 6 };
    const healthyChart = createMockChart(healthyPoint);
    (Highcharts.charts as unknown[]) = [failingChart, healthyChart];

    const containerRef = { current: container } as RefObject<HTMLDivElement>;
    renderHook(() => useChartSync({ containerRef, data: [1] }));

    expect(() => {
      container.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    }).not.toThrow();

    expect(healthyChart.pointer.normalize).toHaveBeenCalled();
    expect(healthyChart.tooltip.refresh).toHaveBeenCalledWith([healthyPoint]);
  });
});

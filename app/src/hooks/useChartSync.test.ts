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
});

import type Highcharts from 'highcharts';
import { createContext, use, useCallback, useMemo, useRef, type ReactNode } from 'react';

import Box from '@mui/material/Box';

type ChartSyncContextValue = {
  register: (chart: Highcharts.Chart) => () => void;
};

const ChartSyncContext = createContext<ChartSyncContextValue | null>(null);

export const useChartSync = () => use(ChartSyncContext);

export function ChartSyncGroup({ children }: { children: ReactNode }) {
  const chartsRef = useRef<Set<Highcharts.Chart>>(new Set());

  const register = useCallback((chart: Highcharts.Chart) => {
    chartsRef.current.add(chart);

    return () => {
      chartsRef.current.delete(chart);
    };
  }, []);

  const handleMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    chartsRef.current.forEach((chart) => {
      if (!chart.pointer || !chart.series?.length) return;

      const normalized = chart.pointer.normalize(event.nativeEvent);
      const hovered = chart.series[0].searchPoint(normalized, true);

      if (!hovered) return;

      const points = chart.series
        .map((series) => series.points?.[hovered.index])
        .filter((point): point is Highcharts.Point => Boolean(point));

      points.forEach((point) => point.setState('hover'));
      chart.tooltip?.refresh(points);
      chart.xAxis[0]?.drawCrosshair(normalized, hovered);
    });
  }, []);

  const handleLeave = useCallback(() => {
    chartsRef.current.forEach((chart) => {
      if (!chart.pointer || !chart.series?.length) return;

      chart.series.forEach((series) => series.points?.forEach((point) => point.setState('')));
      chart.tooltip?.hide();
      chart.xAxis[0]?.hideCrosshair();
    });
  }, []);

  const value = useMemo(() => ({ register }), [register]);

  return (
    <ChartSyncContext value={value}>
      <Box
        data-testid="chart-sync-group"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchEnd={handleLeave}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {children}
      </Box>
    </ChartSyncContext>
  );
}

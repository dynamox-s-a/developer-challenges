import { RefObject, useEffect } from 'react';
import Highcharts from 'highcharts';

type UseChartSyncProps = {
  containerRef: RefObject<HTMLDivElement>;
  data?: unknown[] | null;
};

export default function useChartSync({ containerRef, data }: UseChartSyncProps) {
  useEffect(() => {
    if (!data || data.length === 0) return;

    const syncHandler = (e: MouseEvent) => {
      Highcharts.charts.forEach((chart) => {
        if (!chart) return;

        try {
          const event = chart.pointer.normalize(e);
          let foundPoint = null;

          chart.series.forEach((series) => {
            if (!series.searchPoint) return;
            const point = series.searchPoint(event, true);
            if (point) foundPoint = point;
          });

          if (foundPoint) {
            if (chart.tooltip) chart.tooltip.refresh(chart.hoverPoints || [foundPoint]);
            if (chart.xAxis?.[0]) {
              chart.xAxis[0].drawCrosshair(event, foundPoint);
            }
          } else {
            if (chart.tooltip) chart.tooltip.hide();
            if (chart.xAxis?.[0]) chart.xAxis[0].hideCrosshair();
          }
        } catch {
          // ignore per-chart errors
        }
      });
    };

    const leaveHandler = () => {
      Highcharts.charts.forEach((chart) => {
        if (!chart) return;
        if (chart.tooltip) chart.tooltip.hide();
        if (chart.xAxis?.[0]) chart.xAxis[0].hideCrosshair();
      });
    };

    const container = containerRef.current || document.body;
    container.addEventListener('mousemove', syncHandler);
    container.addEventListener('mouseleave', leaveHandler);

    return () => {
      container.removeEventListener('mousemove', syncHandler);
      container.removeEventListener('mouseleave', leaveHandler);
    };
  }, [containerRef, data]);
}

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Highcharts from 'highcharts';
import type { ChartGroup } from '../../features/telemetry/telemetry.transform';
import TimeSeriesChart from './TimeSeriesChart';

type Props = {
    groups: ChartGroup[];
};

const SyncedCharts = ({ groups }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        let rafId: number | null = null;

        const syncCrosshairs = (e: MouseEvent | TouchEvent) => {
            if (rafId !== null) return;

            rafId = requestAnimationFrame(() => { rafId = null; });

            Highcharts.charts.forEach((chart) => {
                if (!chart) return;

                const event = chart.pointer.normalize(e);

                const points = chart.series.map((serie) => serie.searchPoint(event, true))
                    .filter((point): point is Highcharts.Point => point !== undefined);

                if (points.length === 0) return;

                chart.pointer.reset = () => undefined;
                chart.tooltip.refresh(points);
                chart.xAxis[0].drawCrosshair(event, points[0]);

                points.forEach((point) => point.onMouseOver());
            });
        };

        const resetCrosshairs = () => {
            Highcharts.charts.forEach((chart) => {
                if (!chart) return;

                delete (chart.pointer as any).reset;

                chart.tooltip.hide();
                chart.xAxis[0].hideCrosshair();
            });
        };

        const events = ['mousemove', 'touchmove', 'touchstart'] as const;
        events.forEach((event) => container.addEventListener(
            event, syncCrosshairs as EventListener
        ));

        container.addEventListener('mouseleave', resetCrosshairs);

        return () => {
            events.forEach((event) => container.removeEventListener(
                event, syncCrosshairs as EventListener
            ));

            container.removeEventListener('mouseleave', resetCrosshairs);
        };
    }, []);

    return (
        <Box ref={containerRef} sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {groups.map((group) => (
                <TimeSeriesChart key={group.title} group={group} />
            ))}
        </Box>
    );
};

export default SyncedCharts;

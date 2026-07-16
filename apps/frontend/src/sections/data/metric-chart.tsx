import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useMemo, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { varAlpha } from 'minimal-shared/utils';

import type { MetricGroup } from 'src/store/measurements/selectors';

import { buildChartOptions, type ChartPalette } from './chart-options';
import { useChartSync } from './chart-sync';
import { SeriesStatsRow } from './series-stats-row';

import 'highcharts/modules/accessibility';

Highcharts.setOptions({
  time: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  lang: { resetZoom: 'Redefinir zoom', resetZoomTitle: 'Voltar ao período completo' },
});

type Props = { group: MetricGroup };

export function MetricChart({ group }: Props) {
  const theme = useTheme();
  const sync = useChartSync();
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const palette: ChartPalette = useMemo(
    () => ({
      text: theme.vars.palette.text.primary,
      subtext: theme.vars.palette.text.secondary,
      divider: theme.vars.palette.divider,
      tooltipBg: theme.vars.palette.background.paper,
      buttonText: theme.vars.palette.text.primary,
      buttonBg: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
      buttonHoverBg: varAlpha(theme.vars.palette.grey['500Channel'], 0.32),
    }),
    [theme]
  );

  const options = useMemo(() => buildChartOptions(group, palette), [group, palette]);

  useEffect(() => {
    const chart = chartRef.current?.chart;

    if (!chart || !sync) return;

    return sync.register(chart);
  }, [sync, options]);

  return (
    <Card>
      <CardHeader title={group.label} subheader={`Unidade: ${group.unit}`} sx={{ mb: 1 }} />

      <SeriesStatsRow group={group} />

      <Box sx={{ px: 1, pb: 1 }}>
        <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
      </Box>
    </Card>
  );
}

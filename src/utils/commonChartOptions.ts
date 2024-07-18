import Highcharts, { SeriesLineOptions } from 'highcharts';
import { formatDateLabel } from './formatDateLabel';
import { formatTooltip } from './formatTooltip';
import { syncCrosshair } from './syncCrosshair';

export const commonChartOptions = (
  titleText: string,
  yAxisText: string,
  series: SeriesLineOptions[],
): Highcharts.Options => ({
  title: { text: titleText },
  xAxis: {
    type: 'datetime',
    crosshair: true,
    labels: {
      formatter: function () {
        return formatDateLabel(this.value);
      },
    },
  },
  yAxis: { title: { text: yAxisText } },
  series,
  tooltip: {
    shared: true,
    formatter: formatTooltip,
  },
  chart: {
    events: {
      load() {
        const chart = this;
        chart.container.addEventListener('mousemove', function (e) {
          syncCrosshair(chart, e);
        });
      },
    },
  },
});

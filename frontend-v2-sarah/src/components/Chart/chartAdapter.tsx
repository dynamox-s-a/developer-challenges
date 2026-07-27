import Highcharts from 'highcharts';
import type { CSSProperties } from 'react';
import type { ChartData } from '../../features/data/types';

interface adaptToHighchartsProps {
  data: ChartData;
  chartStyleConfig: {
    lineColor: string;
    bodyFontConfig: CSSProperties;
    legendFontConfig: CSSProperties;
  };
}

export const adaptChartDataToHighcharts = ({
  data,
  chartStyleConfig,
}: adaptToHighchartsProps): Highcharts.Options => {
  const { lineColor, bodyFontConfig, legendFontConfig } = chartStyleConfig;

  const bodyFontStyle = {
    color: bodyFontConfig.color,
    fontSize: bodyFontConfig.fontSize,
    fontWeight: bodyFontConfig.fontWeight?.toString(),
    lineHeight: bodyFontConfig.lineHeight,
  };
  const legendFontStyle = {
    fontFamily: legendFontConfig.fontFamily,
    fontWeight: legendFontConfig.fontWeight?.toString(),
    fontSize: legendFontConfig.fontSize,
    color: legendFontConfig.color,
    lineHeight: legendFontConfig.lineHeight,
  };

  return {
    chart: {
      type: 'line',
      height: 430,
      backgroundColor: 'transparent',
      style: bodyFontStyle,
    },
    title: {
      text: undefined,
    },
    legend: {
      enabled: true,
      itemStyle: legendFontStyle,
    },
    xAxis: {
      type: 'datetime',
      tickLength: 0,
      dateTimeLabelFormats: {
        day: { main: '%e. %b' },
        week: { main: '%e. %b' },
        month: { main: '%b %Y' },
      },
      lineColor: lineColor,
      labels: {
        style: bodyFontStyle,
      },
      gridLineWidth: 1,
      gridLineColor: lineColor,
      gridLineDashStyle: 'Solid',
    },
    yAxis: {
      tickAmount: 5,
      tickLength: 0,
      title: {
        text: data.yAxisTitle,
        style: bodyFontStyle,
      },
      labels: {
        style: bodyFontStyle,
      },
      gridLineWidth: 1,
      gridLineColor: lineColor,
      gridLineDashStyle: 'Solid',
    },
    tooltip: {
      shared: true,
      xDateFormat: '%d/%m/%Y %H:%M:%S',
    },
    accessibility: {
      enabled: false,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 1200,
          },
          chartOptions: {
            legend: {
              itemStyle: {
                fontSize: '0.75rem',
              },
            },
            xAxis: {
              labels: {
                style: {
                  fontSize: '0.75rem',
                },
              },
            },
            yAxis: {
              title: {
                style: {
                  fontSize: '0.75rem',
                },
              },
              labels: {
                style: {
                  fontSize: '0.75rem',
                },
              },
            },
          },
        },
      ],
    },

    series: data.series.map((serie) => ({
      type: 'line',
      id: serie.id,
      name: serie.label,
      color: serie.color,
      data: serie.data,
    })),
    credits: {
      enabled: false,
    },
  } as Highcharts.Options;
};

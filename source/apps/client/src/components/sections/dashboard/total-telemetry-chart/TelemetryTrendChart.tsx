import { useMemo } from 'react';
import { SxProps, useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TooltipComponentOption } from 'echarts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

interface SpentChartProps {
  categories: string[];
  series: {
    name: string;
    data: number[];
    color: string;
  }[];
  sx?: SxProps;
}

const TelemetryTrendChart = ({ categories, series, ...rest }: SpentChartProps) => {
  const theme = useTheme();

  const finalCategories = categories && categories.length > 0 ? categories.map(v => new Date(v).toLocaleTimeString()) : [];
  const finalSeries = series && series.length > 0 ? series : [];

  const option = useMemo(
    () => ({
      grid: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
        containerLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
          label: {
            backgroundColor: theme.palette.neutral.light,
          },
        },
        backgroundColor: theme.palette.primary.dark,
        padding: [10, 18, 10, 18],
        borderRadius: 10,
        borderWidth: 0,
        textStyle: {
          color: theme.palette.neutral.light,
          fontFamily: theme.typography.fontFamily,
        },
        extraCssText: 'border: none; box-shadow: none',
        confine: true,
        position: (
          point: [number, number],
          _params: TooltipComponentOption[],
          _dom: HTMLElement,
          _rect: unknown,
          size: { contentSize: [number, number]; viewSize: [number, number] },
        ) => {
          const [x, y] = point;
          const tooltipHeight = size.contentSize[1];
          const topOffset = y - tooltipHeight - 20;
          const bottomOffset = y + 20;

          if (topOffset > 0) {
            return [x - size.contentSize[0] / 2, topOffset];
          } else {
            return [x - size.contentSize[0] / 2, bottomOffset];
          }
        },
      },
      xAxis: {
        type: 'category',
        data: finalCategories,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          margin: 10,
          color: theme.palette.text.disabled,
          fontSize: theme.typography.caption.fontSize,
          fontFamily: theme.typography.fontFamily,
          fontWeight: 500,
          formatter: (value: string) => {
            if (!value) return '';
            if (value.includes(':')) return value; // Already formatted or mock
            try {
              const date = new Date(value);
              if (isNaN(date.getTime())) return value;
              return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            } catch {
              return value;
            }
          }
        },
        splitLine: {
          show: false,
        },
        boundaryGap: 0,
      },
      yAxis: {
        type: 'value',
        min: 0,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      series: finalSeries.map((s) => ({
        name: s.name,
        data: s.data,
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: s.color,
        },
        lineStyle: {
          width: 4,
          type: 'solid',
          cap: 'round',
          color: s.color,
        },
        emphasis: {
          focus: 'series',
          scale: 3,
          itemStyle: {
            borderWidth: 3,
            borderColor: s.color,
          },
          lineStyle: {
            width: 4,
            shadowBlur: 25,
            shadowColor: s.color,
            shadowOffsetX: 0,
            shadowOffsetY: 20,
          },
        },
      })),
    }),
    [theme, finalCategories, finalSeries],
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default TelemetryTrendChart;

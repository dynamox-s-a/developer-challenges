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
  data?: {
    line1: number[];
    line2: number[];
  };
  sx?: SxProps;
}

const SpentChart = ({ data, ...rest }: SpentChartProps) => {
  const theme = useTheme();
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
        data: ['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'],
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
        },
        splitLine: {
          show: false,
        },
        boundaryGap: 0,
      },
      yAxis: {
        type: 'value',
        min: 1,
        minInterval: 10,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          name: 'Line 1',
          data: data?.line1,
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: theme.palette.primary.main,
          },
          lineStyle: {
            width: 4,
            type: 'solid',
            cap: 'round',
            color: theme.palette.primary.main,
          },
          emphasis: {
            focus: 'series',
            scale: 3,
            itemStyle: {
              borderWidth: 3,
              borderColor: theme.palette.primary.main,
            },
            lineStyle: {
              width: 4,
              shadowBlur: 25,
              shadowColor: theme.palette.primary.main,
              shadowOffsetX: 0,
              shadowOffsetY: 20,
            },
          },
        },
        {
          name: 'Line 2',
          data: data?.line2,
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: theme.palette.secondary.main,
          },
          lineStyle: {
            width: 4,
            type: 'solid',
            cap: 'round',
            color: theme.palette.secondary.main,
          },
          emphasis: {
            focus: 'series',
            scale: 3,
            itemStyle: {
              borderWidth: 3,
              borderColor: theme.palette.secondary.main,
            },
            lineStyle: {
              width: 4,
              shadowBlur: 25,
              shadowColor: theme.palette.secondary.main,
              shadowOffsetX: 0,
              shadowOffsetY: 20,
            },
          },
        },
      ],
    }),
    [theme, data],
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default SpentChart;

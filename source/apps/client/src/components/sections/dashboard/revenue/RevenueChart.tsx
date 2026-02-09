import { useMemo } from 'react';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { SxProps, useTheme } from '@mui/material';
import {
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  CanvasRenderer,
]);

interface BarChartProps {
  data: {
    categories: string[] | number[];
    series: {
      name: string;
      data: number[];
    }[];
  };
  sx?: SxProps;
}

const RevenueChart = ({ data, ...rest }: BarChartProps) => {
  const theme = useTheme();

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        top: 20,
        bottom: 50,
        left: 20,
        right: 20,
      },
      xAxis: {
        type: 'category',
        data: data.categories,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: theme.palette.text.secondary,
          fontSize: theme.typography.caption.fontSize,
          margin: 20,
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
      series: data.series.map((item, index) => ({
        name: item.name,
        type: 'bar',
        stack: 'total',
        barWidth: 14,
        label: {
          show: false,
        },
        emphasis: {
          focus: 'series',
        },
        itemStyle: {
          color:
            index === 0
              ? theme.palette.primary.light
              : index === 1
                ? theme.palette.secondary.light
                : theme.palette.neutral.main,
          borderRadius: index === 2 ? [10, 10, 0, 0] : [0, 0, 0, 0],
        },
        data: item.data,
      })),
    }),
    [theme],
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default RevenueChart;

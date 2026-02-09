import { useMemo } from 'react';
import { SxProps, useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import ReactEchart from 'components/base/ReactEchart';
import { TooltipComponent, GridComponent, AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, TooltipComponent, GridComponent, AxisPointerComponent, CanvasRenderer]);

interface DailyTrafficChartProps {
  data: number[];
  sx?: SxProps;
}

const DailyTrafficChart = ({ data, ...rest }: DailyTrafficChartProps) => {
  const theme = useTheme();

  const option = useMemo(
    () => ({
      tooltip: {
        axisPointer: null,
        formatter: 'Traffic: {c}',
      },
      grid: {
        top: '22%',
        left: '5%',
        right: '5%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['00', '04', '08', '12', '14', '16', '18'],
          boundaryGap: false,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            margin: 20,
            fontWeight: 500,
            color: theme.palette.text.disabled,
            fontSize: theme.typography.caption.fontSize,
            fontFamily: theme.typography.fontFamily,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 10,
          minInterval: 1,
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: 'Traffic',
          type: 'bar',
          barWidth: '28%',
          showBackground: false,
          data,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: theme.palette.primary.main },
              { offset: 1, color: 'rgba(67, 24, 255, 0.2)' },
            ]),
            borderRadius: [10, 10, 0, 0],
          },
        },
      ],
    }),
    [theme, data],
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default DailyTrafficChart;

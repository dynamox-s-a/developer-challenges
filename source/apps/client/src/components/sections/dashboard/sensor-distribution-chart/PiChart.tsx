import { SxProps, useTheme } from '@mui/material';
import ReactEchart from 'components/base/ReactEchart';
import EChartsReactCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { PiChartData } from 'data/piChartData';
import { useMemo } from 'react';

interface PiChartProps {
  sx?: SxProps;
  chartRef: React.RefObject<EChartsReactCore | null>;
}

echarts.use([PieChart, TooltipComponent, CanvasRenderer]);

const PiChart = ({ chartRef, ...rest }: PiChartProps) => {
  const theme = useTheme();

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%',
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '80%',
          data: PiChartData.map((item) => {
            return {
              ...item,
              itemStyle: {
                color:
                  item.id === 1
                    ? theme.palette.primary.main
                    : item.id === 2
                      ? theme.palette.secondary.main
                      : theme.palette.warning.main,
              },
            };
          }),
          emphasis: {
            label: {
              show: false,
            },
            itemStyle: {
              shadowBlur: 5,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: false,
          },
        },
      ],
    }),
    [theme],
  );

  return <ReactEchart ref={chartRef} echarts={echarts} option={option} {...rest} />;
};

export default PiChart;

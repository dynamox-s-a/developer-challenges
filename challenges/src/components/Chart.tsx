import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

interface ChartProps {
  data: { name: string; data: [number, number][] }[];
  yAxisTitle?: string;
  chartType?: 'line' | 'bar';
}

const Chart: React.FC<ChartProps> = ({ data, chartType = 'line', yAxisTitle = 'Valor' }) => {
  const options: Highcharts.Options = {
    chart: {
      type: chartType,
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: yAxisTitle
      }
    },
    series: data.map((seriesData) => ({
      type: chartType,
      name: seriesData.name,
      data: seriesData.data
    }))
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />
};

export default Chart;

import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface TimeSeriesChartProps {
  data: { name: string; data: [number, number][] }[];
  title: string;
  colors?: string[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title, colors }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.chart;

      chart.update({
        series: data.map((series, index) => ({
          name: series.name,
          data: series.data,
          color: colors ? colors[index] : undefined,
          type: 'line',
        })),
      });
    }
  }, [data, title, colors]);

  const options = {
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: '',
      },
    },
    series: data.map((series, index) => ({
      name: series.name,
      data: series.data,
      color: colors ? colors[index] : undefined,
    })),
  };

  switch (title.toLowerCase()) {
    case 'aceleração rms':
      options.yAxis.title.text = 'Aceleração RMS (g)';
      break;
    case 'temperatura':
      options.yAxis.title.text = 'Temperatura (ºC)';
      break;
    case 'velocidade rms':
      options.yAxis.title.text = 'Velocidade RMS (g)';
      break;
  }


  return (
    <main>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
        allowChartUpdate
      />
    </main>
  );
};

export default TimeSeriesChart;

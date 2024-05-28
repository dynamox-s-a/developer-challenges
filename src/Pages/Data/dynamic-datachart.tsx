import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Measure } from '../../@types/types';
import { useAppSelector } from '../../store';

interface DynamicDataChartProps {
  scope: string
}

export function DynamicDataChart({ scope }: DynamicDataChartProps ){
  const measures: Measure[] = useAppSelector(store => store.measures.data);

  // Função para pegar os últimos 10 objetos de um array
  function sliceData(data: string) {
    // a cada mais ou menos 7 é um dia
    if(scope === 'lastDay') {
      return data.slice(-7);
    }

    if(scope === 'lastWeek') {
      return data.slice(-42);
    }

    if(scope === 'lastMonth') {
      return data.slice(-217);
    }
    if(scope === 'lastYear') {
      return data.slice(-2555);
    }

    return data
  }

  // Função para encontrar os dados da métrica e limitar aos últimos 10 objetos
  function findMetricData(measures: Measure[], metricName: string){
    const metric = measures.find(metric => metric.name.includes(metricName));
    return metric ? { ...metric, data: sliceData(metric.data) } : undefined;
  }

  function formatMetricData(metricData: Measure | undefined){ 
    return metricData ? metricData.data.map(entry => [new Date(entry.datetime).getTime(), entry.max]) : []
  }

  const createChartData = (metricNames: string[]) => 
    metricNames.map(metricName => ({
      name: metricName,
      data: formatMetricData(findMetricData(measures, metricName)),
    }));

  const accelerationData = createChartData(['accelerationRms/x', 'accelerationRms/y', 'accelerationRms/z']);
  const velocityData = createChartData(['velocityRms/x', 'velocityRms/y', 'velocityRms/z']);
  const temperatureData = createChartData(['temperature']);

  const chartOptions = {
    xAxis: { type: 'datetime' },
    yAxis: { title: { text: 'Magnitude' } },
    tooltip: { 
      shared: true,
      crosshairs: true,
    },
    plotOptions: {
      series: {
        cursor: 'pointer',
        marker: {
          lineWidth: 1
        },
        states: {
          hover: {
            lineWidthPlus: 0
          }
        },
        enableMouseTracking: true
      }
    },
  };

  const accelerationOptions = {
    ...chartOptions,
    title: { text: 'Aceleração RMS' },
    series: accelerationData,
  };

  const velocityOptions = {
    ...chartOptions,
    title: { text: 'Velocidade RMS' },
    series: velocityData,
  };

  const temperatureOptions = {
    ...chartOptions,
    title: { text: 'Temperatura' },
    series: temperatureData,
  };

  return (
    <>
        <HighchartsReact highcharts={Highcharts} options={accelerationOptions} />
        <HighchartsReact highcharts={Highcharts} options={velocityOptions} />
        <HighchartsReact highcharts={Highcharts} options={temperatureOptions} />
    </>
  )
}

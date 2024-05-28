import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Measure } from '../../../@types/types';
import { useAppSelector } from '../../../store';

export function FullDataChart(){
  const measures: Measure[] = useAppSelector(store => store.measures.data);

   // Função para processar os dados do JSON para o formato do Highcharts
   function findMetricData(measures: Measure[], metricName: string){
    return measures.find(metric => metric.name.includes(metricName))
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
    xAxis: { 
      type: 'datetime',
      gridLineWidth: 1,
    },
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
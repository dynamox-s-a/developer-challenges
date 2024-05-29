import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Measure, MeasureItem } from '../../@types/types';
import { useAppSelector } from '../../store';

export function VelocityChart(){
  const measures: Measure[] = useAppSelector(store => store.measures.data);
  console.log('measures', measures)

  const scope: string = useAppSelector(store => store.measures.scope.velocity);

  // Função para pegar os últimos 10 objetos de um array
  function sliceData(data: MeasureItem[]) {
    // a cada mais ou menos 7 itens do [] equivalem a um dia
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
    console.log(metric)
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

    const velocityData = createChartData(['velocityRms/x', 'velocityRms/y', 'velocityRms/z']);

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

  const velocityOptions = {
    ...chartOptions,
    title: { text: '' },
    series: velocityData,
  };

  return (
    <>
        <HighchartsReact highcharts={Highcharts} options={velocityOptions} />
    </>
  )
}

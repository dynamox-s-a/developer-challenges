import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Measure, MeasureItem } from '../../@types/types';
import { useAppSelector } from '../../store';

export function AcelerationChart(){
  const measures: Measure[] = useAppSelector(store => store.measures.data);
  const scope: string = useAppSelector(store => store.measures.scope.aceleration);

  function sliceData(data: MeasureItem[]) {
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
    return data;
  }
  
  function findMetricData(measures: Measure[], metricName: string){
    const metric = measures.find(metric => metric.name.includes(metricName));
    return metric ? { ...metric, data: sliceData(metric.data) } : undefined;
  }

  function formatMetricData(metricData: Measure | undefined){ 
    return metricData ? metricData.data.map(entry => [new Date(entry.datetime).getTime(), entry.max]) : [];
  }

  const accelerationOptions = {
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
    title: { text: '' },
    series: [
      {
        name: 'accelerationRms/x',
        color: '#f5c815',
        data: formatMetricData(findMetricData(measures, 'accelerationRms/x')),
      },
      {
        name: 'accelerationRms/y',
        color: '#ef4242',
        data: formatMetricData(findMetricData(measures, 'accelerationRms/y')),
      },
      {
        name: 'accelerationRms/z',
        color: '#0f75e2', // Cor azul
        data: formatMetricData(findMetricData(measures, 'accelerationRms/z')),
      }
    ]
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={accelerationOptions} />
    </>
  )
}

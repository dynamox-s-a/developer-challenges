import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Measure, MeasureItem } from "../../@types/types";
import { useAppSelector } from "../../store";

export function TemperatureChart(){
  const measures: Measure[] = useAppSelector(store => store.measures.data);

  const scope: string = useAppSelector(store => store.measures.scope.temperature);

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
  
  function findMetricData(measures: Measure[], metricName: string){
    const metric = measures.find(metric => metric.name.includes(metricName));
    return metric ? { ...metric, data: sliceData(metric.data) } : undefined;
  }

  function formatMetricData(metricData: Measure | undefined){ 
    return metricData ? metricData.data.map(entry => [new Date(entry.datetime).getTime(), entry.max]) : [];
  }

  const temperatureOptions = {
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
        name: 'temperature',
        color: '#e38623',
        data: formatMetricData(findMetricData(measures, 'temperature')),
      },
    ]
  };

  return(
    <>
      <HighchartsReact highcharts={Highcharts} options={temperatureOptions} />
    </>
  )
}
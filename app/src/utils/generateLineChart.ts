import { TDataChartLine, TResponseChart } from '../common/types';

function formatDate(value: string): string {
  const date = new Date(value);

  const month: { [index: number]: string } = {
    0: 'Jan',
    1: 'Fev',
    2: 'Mar',
    3: 'Abr',
    4: 'Mai',
    5: 'Jun',
    6: 'Jul',
    7: 'Ago',
    8: 'Set',
    9: 'Out',
    10: 'Nov',
    11: 'Dez',
  };
  const m = date.getMonth();

  const d = date.getDay();
  const day = d < 10 ? `0${d}` : d;

  return `${day} ${month[m]}`;
}

export function generateLineChart(data: TResponseChart): TDataChartLine {
  const xAxisData: Array<string> = [];
  const yAxisData: Array<number> = [];

  data.data.forEach(element => {
    const date = formatDate(element.datetime);

    xAxisData.push(date);
    yAxisData.push(element.max);
  });

  return {
    name: `${data.name}`,
    xAxisData,
    yAxisData,
  };
}

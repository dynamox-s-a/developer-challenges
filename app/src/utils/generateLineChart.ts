import { ptBR } from 'date-fns/locale/pt-BR';
import { TDataChartLine, TResponseChart } from '../common/types';
import { format } from 'date-fns/format';

function formatDate(value: string): string {
  const date = format(value, 'dd-LLL', { locale: ptBR });
  return date;
}

export function generateLineChart({
  data,
  axisName,
}: {
  data: TResponseChart;
  axisName: string;
}): TDataChartLine {
  const series: Array<number> = [];
  const range: Array<string> = [];

  data.data.forEach(element => {
    const date = formatDate(element.datetime);

    series.push(element.max);
    range.push(date);
  });

  return {
    axisName,
    series,
    range,
  };
}

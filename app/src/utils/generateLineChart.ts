import { ptBR } from 'date-fns/locale/pt-BR';
import { format } from 'date-fns/format';
import { TDataChartLine, TResponseChart } from '@/common/types';

function formatDate(value: string, pattern?: string): string {
  const date = format(value, pattern ?? 'dd-LLL', { locale: ptBR });
  return date;
}

export function generateLineChart({
  data,
  axisName,
}: {
  data: TResponseChart;
  axisName: string;
}): TDataChartLine {
  const series: Array<[string, number]> = [];
  const range: Array<string> = [];

  data.data.forEach(element => {
    const date = formatDate(element.datetime);
    const dateTime = formatDate(element.datetime, 'dd-LLL-yyyy hh:mm');

    series.push([dateTime, element.max]);
    range.push(date);
  });

  return {
    axisName,
    series,
    range,
  };
}

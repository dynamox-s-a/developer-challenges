import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumber } from '../../lib/format';
import type { TimeSeriesSample } from './time-series-details.slice';

const ONE_DAY = 24 * 60 * 60 * 1000;

// O Recharts precisa de números no eixo do tempo: o instante vira
// milissegundos (o mesmo número que o Date usa por dentro)
export function toChartData(samples: TimeSeriesSample[]) {
  return samples.map((sample) => ({
    time: Date.parse(sample.timestamp),
    value: sample.value,
  }));
}

// O texto de cada marca do eixo do tempo. Uma série de até 2 dias mostra as
// horas (14:30); uma mais longa mostra os dias (22/11)
export function timeTickFormatter(first: number, last: number) {
  if (last - first <= 2 * ONE_DAY) {
    return (time: number) =>
      new Date(time).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
  }
  return (time: number) =>
    new Date(time).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
}

type TimeSeriesChartProps = {
  samples: TimeSeriesSample[];
  unit: string | null;
  mean: number;
};

export function TimeSeriesChart({ samples, unit, mean }: TimeSeriesChartProps) {
  const theme = useTheme();
  // Com até 10.000 medições, só refaz a conversão se a série mudar
  const data = useMemo(() => toChartData(samples), [samples]);
  const formatTick = timeTickFormatter(
    data[0].time,
    data[data.length - 1].time,
  );
  const withUnit = (value: number) =>
    unit ? `${formatNumber(value)} ${unit}` : formatNumber(value);

  return (
    // responsive: o gráfico ocupa a largura do quadro e acompanha a tela
    <LineChart
      responsive
      data={data}
      style={{ width: '100%', height: 360 }}
      margin={{ top: 16, right: 16, bottom: 8, left: 8 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="time"
        type="number"
        scale="time"
        domain={['dataMin', 'dataMax']}
        tickFormatter={formatTick}
        minTickGap={32}
      />
      {/* domain auto: o eixo vai do menor ao maior valor da série, e não do
          zero (uma temperatura entre 31 e 33 °C ficaria uma linha reta) */}
      <YAxis
        domain={['auto', 'auto']}
        tickFormatter={formatNumber}
        width={56}
      />
      <Tooltip
        labelFormatter={(time) =>
          new Date(Number(time)).toLocaleString('pt-BR')
        }
        formatter={(value) => [withUnit(Number(value)), 'Valor']}
      />
      {/* Uma linha tracejada na média ajuda a ver o que foge do normal */}
      <ReferenceLine
        y={mean}
        stroke={theme.palette.text.secondary}
        strokeDasharray="6 4"
        label={{ value: 'Média', position: 'insideTopRight' }}
      />
      {/* Sem bolinhas em cada medição e sem animação: com milhares de
          medições, os dois deixariam o gráfico lento */}
      <Line
        dataKey="value"
        stroke={theme.palette.primary.main}
        strokeWidth={2}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  );
}

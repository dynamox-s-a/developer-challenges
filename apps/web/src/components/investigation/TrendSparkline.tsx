import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

import type { TrendPointDto } from '@dynamox/domain';

import { conditionColor, type ConditionTagKind } from '../condition/ConditionTag';

/**
 * Miniatura de tendência: responde "subindo, estável ou caindo" — e só isso.
 *
 * Consome os buckets agregados que a API já devolve com a condição (até doze valores). Não
 * existe versão desta miniatura que baixe amostra bruta: foi assim que a tela antiga
 * transportava milhões de linhas para desenhar 72 pixels.
 *
 * O domínio do eixo acompanha os dados: ancorar em zero achataria variações de milésimos
 * de g, que é exatamente o que a miniatura precisa mostrar.
 */
export function TrendSparkline({
  trend,
  condition,
  width = 72,
  height = 22,
}: {
  trend: TrendPointDto[];
  condition: ConditionTagKind;
  width?: number;
  height?: number;
}): JSX.Element {
  const muiTheme = useTheme();

  if (trend.length < 2) {
    return (
      <Typography variant="caption" color="text.secondary">
        —
      </Typography>
    );
  }

  const values = trend.map((point) => point.value);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const pad = Math.max((high - low) * 0.15, high * 0.01);

  return (
    <Box sx={{ width, height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trend} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
          <YAxis hide domain={[low - pad, high + pad]} />
          <Line
            type="linear"
            dataKey="value"
            stroke={conditionColor(condition, muiTheme.palette)}
            strokeWidth={1.6}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

/** Direção da tendência em texto — o canal acessível da miniatura. */
export function trendDirection(trend: TrendPointDto[]): 'subindo' | 'estável' | 'caindo' | null {
  if (trend.length < 2) return null;
  const first = trend[0].value;
  const last = trend[trend.length - 1].value;
  if (first === 0) return 'estável';
  const change = (last - first) / first;
  if (change > 0.05) return 'subindo';
  if (change < -0.05) return 'caindo';
  return 'estável';
}

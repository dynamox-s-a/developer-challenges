import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import type {
  ConditionKind,
  DashboardView,
} from '../../features/dashboard/dashboardAggregations';
import { formatNumber } from '../../features/dashboard/dashboardFormatters';
import { conditionColor } from '../condition/ConditionTag';

/** Ordem canônica dos segmentos: do melhor para o pior, depois os não medidos. */
const SEGMENTS: Array<{ kind: ConditionKind; label: string }> = [
  { kind: 'normal', label: 'Normal demonstrativo' },
  { kind: 'observation', label: 'Observação demonstrativa' },
  { kind: 'attention', label: 'Atenção demonstrativa' },
  { kind: 'unclassified', label: 'Sem classificação' },
  { kind: 'no-data', label: 'Sem dados' },
  { kind: 'no-sensor', label: 'Sem sensor' },
];

/**
 * Distribuição da condição de toda a frota numa faixa segmentada — o total que dá
 * contexto às barras por máquina. Vive dentro do card de condição por ativo em vez de
 * ocupar um painel próprio: é a mesma pergunta, em outro nível de agregação.
 */
export function FleetConditionStrip({ view }: { view: DashboardView }): JSX.Element | null {
  const muiTheme = useTheme();
  const total = view.cells.length;
  if (total === 0) return null;

  const counts = new Map<ConditionKind, number>();
  for (const cell of view.cells) {
    counts.set(cell.condition, (counts.get(cell.condition) ?? 0) + 1);
  }
  const present = SEGMENTS.map((segment) => ({
    ...segment,
    count: counts.get(segment.kind) ?? 0,
  })).filter((segment) => segment.count > 0);

  return (
    <Box sx={{ mb: 1.25 }}>
      <Stack
        direction="row"
        role="img"
        aria-label={present
          .map((segment) => `${segment.label}: ${segment.count} de ${total}`)
          .join('; ')}
        sx={{ height: 14, borderRadius: 999, overflow: 'hidden' }}
      >
        {present.map((segment) => (
          <Tooltip
            key={segment.kind}
            arrow
            title={`${segment.label} — ${segment.count} ponto(s) · ${formatNumber((segment.count / total) * 100, 1)}%`}
          >
            <Box
              sx={{
                width: `${(segment.count / total) * 100}%`,
                minWidth: 8,
                bgcolor: conditionColor(segment.kind, muiTheme.palette),
              }}
            />
          </Tooltip>
        ))}
      </Stack>

      <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} sx={{ mt: 0.75 }}>
        <Typography variant="caption" color="text.secondary">
          {total} ponto(s)
        </Typography>
        {present.map((segment) => (
          <Stack key={segment.kind} direction="row" alignItems="center" spacing={0.5}>
            <Box
              aria-hidden="true"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                flexShrink: 0,
                bgcolor: conditionColor(segment.kind, muiTheme.palette),
              }}
            />
            <Typography variant="caption" noWrap>
              {segment.label}: <strong>{segment.count}</strong>
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

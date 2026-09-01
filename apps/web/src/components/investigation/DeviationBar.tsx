import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { DEFAULT_CONDITION_POLICY } from '@dynamox/domain';

import { formatNumber } from '../../features/dashboard/dashboardFormatters';
import { conditionColor, type ConditionTagKind } from '../condition/ConditionTag';

/**
 * Razão entre a aquisição atual e a de referência, com barra proporcional.
 *
 * A barra satura em 2× o limiar de atenção de propósito: acima disso a escala deixaria de
 * distinguir 2,1× de 2,4×, que é a faixa onde a decisão de inspecionar acontece.
 */
/** A barra satura em 2× o limiar de atenção: acima disso a escala não distingue mais nada. */
const BAR_FULL_SCALE = 2 * DEFAULT_CONDITION_POLICY.attentionRatio;

export function DeviationBar({
  ratio,
  condition,
  title,
}: {
  ratio: number | null;
  condition: ConditionTagKind;
  title?: string;
}): JSX.Element {
  const muiTheme = useTheme();

  if (ratio === null) {
    return (
      <Typography variant="caption" color="text.secondary">
        —
      </Typography>
    );
  }

  const color = conditionColor(condition, muiTheme.palette);
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 96 }} title={title}>
      <Box
        aria-hidden="true"
        sx={{ flexGrow: 1, height: 6, borderRadius: 999, bgcolor: 'action.hover', overflow: 'hidden' }}
      >
        <Box sx={{ width: `${Math.min(1, ratio / BAR_FULL_SCALE) * 100}%`, height: '100%', bgcolor: color }} />
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 700, color, whiteSpace: 'nowrap' }}>
        {formatNumber(ratio, 2)}×
      </Typography>
    </Stack>
  );
}

import Box from '@mui/material/Box';
import { alpha, useTheme, type Theme } from '@mui/material/styles';

import type { ConditionKind } from '@dynamox/domain';

/**
 * CONDIÇÃO ≠ ALERTA.
 *
 * O que este componente pinta é o estado DERIVADO da telemetria — a leitura atual contra
 * uma aquisição de referência. Alerta é outro conceito: evento persistido, com ciclo de
 * vida próprio, que este produto ainda não tem. Manter os nomes separados agora é o que
 * evita, depois, uma tela em que "atenção" signifique duas coisas diferentes.
 *
 * `stale`/`future` entram aqui porque a interface precisa de um rótulo para recência com
 * a mesma gramática visual — não porque sejam condições do domínio.
 */
export type ConditionTagKind = ConditionKind | 'stale' | 'future';

const LABELS: Record<ConditionTagKind, string> = {
  normal: 'Normal',
  observation: 'Observação',
  attention: 'Atenção',
  unclassified: 'Sem classificação',
  'no-data': 'Sem dados',
  'no-sensor': 'Sem sensor',
  stale: 'Desatualizado',
  future: 'Relógio divergente',
};

export function conditionColor(kind: ConditionTagKind, palette: Theme['palette']): string {
  switch (kind) {
    case 'normal':
      return palette.condition.normal;
    case 'observation':
      return palette.condition.observation;
    case 'attention':
      return palette.condition.attention;
    case 'no-data':
      return palette.condition.noData;
    case 'stale':
      return palette.condition.stale;
    case 'future':
      return palette.condition.attention;
    default:
      return palette.condition.unclassified;
  }
}

/**
 * Rótulo de condição — é informação, não ação: nunca parece um botão. Cor + texto sempre
 * juntos, porque cor não pode ser o único canal.
 */
export function ConditionTag({
  kind,
  label,
}: {
  kind: ConditionTagKind;
  label?: string;
}): JSX.Element {
  const muiTheme = useTheme();
  const color = conditionColor(kind, muiTheme.palette);
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        px: 0.7,
        py: 0.1,
        borderRadius: 1,
        bgcolor: alpha(color, 0.12),
        color,
        fontSize: '0.58rem',
        fontWeight: 700,
        lineHeight: 1.35,
        whiteSpace: 'nowrap',
      }}
    >
      {label ?? LABELS[kind]}
    </Box>
  );
}

import Box from '@mui/material/Box';
import { alpha, useTheme, type Theme } from '@mui/material/styles';

import type { AlertLevel, AlertStatus } from '@dynamox/domain';

import { ALERT_LEVEL_LABELS, ALERT_STATUS_LABELS } from '../../features/alerts/alertLabels';

/**
 * ALERTA ≠ CONDIÇÃO. `ConditionTag` pinta o estado derivado da telemetria; esta etiqueta
 * pinta o NÍVEL de um episódio persistido (A1/A2) e, opcionalmente, o seu status. As duas
 * podem aparecer lado a lado no mesmo ponto — e precisam parecer coisas diferentes.
 */
export function alertLevelColor(level: AlertLevel, palette: Theme['palette']): string {
  return level === 'A2' ? palette.alert.a2 : palette.alert.a1;
}

export function alertStatusColor(status: AlertStatus, palette: Theme['palette']): string {
  switch (status) {
    case 'acknowledged':
      return palette.alert.acknowledged;
    case 'resolved':
      return palette.alert.resolved;
    default:
      return palette.text.primary;
  }
}

function Tag({ color, children, filled }: { color: string; children: string; filled?: boolean }): JSX.Element {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        px: 0.7,
        py: 0.1,
        borderRadius: 1,
        bgcolor: filled ? color : alpha(color, 0.12),
        color: filled ? '#fff' : color,
        fontSize: '0.58rem',
        fontWeight: 750,
        lineHeight: 1.35,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
}

/** Nível do episódio. Resolvido esmaece o nível: o que importa é que já passou. */
export function AlertLevelTag({ level, status = 'open', label }: { level: AlertLevel; status?: AlertStatus; label?: string }): JSX.Element {
  const { palette } = useTheme();
  const color = status === 'resolved' ? palette.alert.resolved : alertLevelColor(level, palette);
  return (
    <Tag color={color} filled={status !== 'resolved'}>
      {label ?? ALERT_LEVEL_LABELS[level]}
    </Tag>
  );
}

export function AlertStatusTag({ status }: { status: AlertStatus }): JSX.Element {
  const { palette } = useTheme();
  return <Tag color={alertStatusColor(status, palette)}>{ALERT_STATUS_LABELS[status]}</Tag>;
}

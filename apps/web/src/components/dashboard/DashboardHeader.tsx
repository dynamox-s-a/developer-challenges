import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import type { DashboardPeriod } from '../../features/dashboard/dashboardSlice';
import { TIME_ZONE_LABEL, formatDateTime } from '../../features/time/instant';

const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  '24h': '24 h',
  '7d': '7 dias',
  '30d': '30 dias',
  all: 'Tudo',
};

/** Períodos oferecidos no seletor. `all` é alcançado pela ação do painel de tendência. */
const PERIODS: DashboardPeriod[] = ['24h', '7d', '30d'];

export interface DashboardHeaderProps {
  period: DashboardPeriod;
  loadedAt: string | null;
  latestReading: string | null;
  nowMs: number;
  onPeriodChange: (period: DashboardPeriod) => void;
}

/**
 * Cabeçalho da página — apenas identificação e período. Sem card, sem borda e sem um
 * terceiro nível de título: a barra da aplicação já está acima e os painéis vêm abaixo.
 */
export function DashboardHeader({
  period,
  loadedAt,
  latestReading,
  onPeriodChange,
}: DashboardHeaderProps): JSX.Element {
  return (
    // Um <div>, não outro <header>: o único landmark de cabeçalho é a barra da aplicação.
    <Box sx={{ pt: 2, pb: 1.5 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
        gap={1.5}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h1" component="h1">
            Visão geral operacional
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.25 }}>
            Priorização de inspeção, tendência e saúde dos sensores com dados persistidos pela API.
            Todos os horários em {TIME_ZONE_LABEL}.
          </Typography>
          <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            {latestReading ? (
              <Chip
                icon={<ScheduleOutlinedIcon />}
                label={`Última leitura: ${formatDateTime(latestReading)} ${TIME_ZONE_LABEL}`}
                size="small"
                variant="outlined"
              />
            ) : null}
            {loadedAt ? (
              <Chip
                icon={<ScheduleOutlinedIcon />}
                label={`Painel atualizado: ${formatDateTime(loadedAt)}`}
                size="small"
                variant="outlined"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              />
            ) : null}
            {/* Sem botão no seletor: o período completo só aparece quando está ativo. */}
            {period === 'all' ? (
              <Chip
                icon={<CalendarMonthOutlinedIcon />}
                label="Período: Tudo"
                size="small"
                color="primary"
                variant="outlined"
              />
            ) : null}
          </Stack>
        </Box>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={period}
          aria-label="Período global do dashboard"
          onChange={(_event, next: DashboardPeriod | null) => {
            if (next) onPeriodChange(next);
          }}
          sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', md: 'flex-start' } }}
        >
          {PERIODS.map((key) => (
            <ToggleButton key={key} value={key} aria-label={PERIOD_LABELS[key]} sx={{ flex: 1, px: 2 }}>
              {PERIOD_LABELS[key]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
}

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { type AlertListResponseDto, machineTag } from '@dynamox/domain';
import { EmptyState, ErrorState } from '@dynamox/ui';

import { ALERT_TYPE_SHORT, alertSummary } from '../../features/alerts/alertLabels';
import { links } from '../../features/investigation/links';
import { formatShortDateTime } from '../../features/time/instant';
import type { RequestStatus } from '../../store/requestStatus';
import { AlertLevelTag, AlertStatusTag } from '../alerts/AlertLevelTag';
import { DashboardCard } from './DashboardCard';

/**
 * Alertas recentes — episódios PERSISTIDOS pelo motor, por evidência mais recente: ativos
 * e recém-resolvidos juntos, porque "o que aconteceu" inclui o que acabou de normalizar.
 * Cada linha abre o episódio; a listagem completa fica a um clique.
 *
 * Lista em vez de tabela: numa coluna de um terço, duas linhas por item deixam a
 * mensagem visível — e é ela que diz por que o item importa.
 */
export function RecentOccurrences({
  alerts,
  status,
  error,
  onRetry,
}: {
  alerts: AlertListResponseDto | null;
  status: RequestStatus;
  error: string | null;
  onRetry: () => void;
}): JSX.Element {
  const navigate = useNavigate();
  const rows = alerts?.items ?? [];
  const loading = status === 'idle' || status === 'loading';

  return (
    <DashboardCard
      title="Alertas recentes"
      titleId="occurrences-title"
      subtitle="Episódios do motor, do mais recente ao mais antigo — ativos e recém-resolvidos."
      info="Alerta é diferente de condição: a condição compara a última aquisição com a anterior; o alerta compara com a baseline aprendida do ponto e tem ciclo de vida (aberto, escalado, reconhecido, resolvido)."
      action={
        <Button component={RouterLink} to={links.alerts({ status: 'active' })} size="small" variant="text">
          Ver todos
        </Button>
      }
      flush
    >
      {loading ? (
        <Stack spacing={1} sx={{ px: 2 }}>
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} variant="rounded" height={44} />
          ))}
        </Stack>
      ) : null}

      {status === 'failed' ? (
        <Box sx={{ px: 2 }}>
          <ErrorState message={error ?? 'Não foi possível consultar os alertas.'} onRetry={onRetry} />
        </Box>
      ) : null}

      {status === 'succeeded' && rows.length === 0 ? (
        <Box sx={{ px: 2 }}>
          <EmptyState
            title="Nenhum alerta registrado"
            description="O motor abre um episódio quando uma regra da política dispara por leituras consecutivas."
          />
        </Box>
      ) : null}

      {status === 'succeeded' && rows.length > 0 ? (
        <Stack component="ul" aria-label="Alertas recentes" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {rows.map((alert) => {
            const identity =
              alert.scope === 'fleet'
                ? `Frota · ${alert.affectedCount ?? 0} pontos`
                : [alert.machineName ? machineTag(alert.machineName) : null, alert.monitoringPointName, alert.sensorSerialNumber]
                    .filter(Boolean)
                    .join(' · ');
            const when = alert.status === 'resolved' ? `resolvido ${formatShortDateTime(alert.resolvedAt)}` : `desde ${formatShortDateTime(alert.openedAt)}`;
            return (
              <Box component="li" key={alert.id}>
                <ButtonBase
                  onClick={() => navigate(links.alert(alert.id))}
                  aria-label={`Abrir alerta ${alert.level} ${ALERT_TYPE_SHORT[alert.type]} em ${identity}: ${alertSummary(alert)}`}
                  sx={(theme) => ({
                    width: '100%',
                    display: 'block',
                    textAlign: 'left',
                    px: `${theme.dashboard.cardPadding}px`,
                    py: 0.9,
                    borderTop: 1,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                    '&:focus-visible': {
                      outline: `2px solid ${alpha(theme.palette.primary.main, 0.55)}`,
                      outlineOffset: -2,
                    },
                  })}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                    <Stack direction="row" alignItems="center" gap={0.75} sx={{ minWidth: 0 }}>
                      <AlertLevelTag level={alert.level} status={alert.status} label={alert.level} />
                      <Typography variant="body2" sx={{ fontWeight: 650 }} noWrap title={identity}>
                        {ALERT_TYPE_SHORT[alert.type]} · {identity}
                      </Typography>
                    </Stack>
                    <AlertStatusTag status={alert.status} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" component="div" noWrap title={alertSummary(alert)}>
                    {when} · {alertSummary(alert)}
                  </Typography>
                </ButtonBase>
              </Box>
            );
          })}
        </Stack>
      ) : null}
    </DashboardCard>
  );
}

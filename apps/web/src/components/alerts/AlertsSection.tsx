import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

import type { AlertOccurrenceDto } from '@dynamox/domain';
import { ErrorState } from '@dynamox/ui';

import { api, type AlertListParams } from '../../api/client';
import { ALERT_TYPE_SHORT, alertSummary } from '../../features/alerts/alertLabels';
import { links } from '../../features/investigation/links';
import { useAnalyticsQuery } from '../../features/investigation/useAnalyticsQuery';
import { formatShortDateTime } from '../../features/time/instant';
import { AlertLevelTag, AlertStatusTag } from './AlertLevelTag';

const RECENT_LIMIT = 5;

/**
 * Costura de alertas nas páginas de máquina, ponto e sensor: os episódios ATIVOS do recorte
 * e os últimos resolvidos, com link para a listagem já filtrada. Compacta de propósito — a
 * página é do ativo; o alerta tem a própria página.
 *
 * O recorte é por máquina (chave natural) ou por sensor (série): é o que a API sabe filtrar
 * no servidor. Uma página de ponto recorta pelo sensor instalado — sem sensor, não há alerta.
 */
export function AlertsSection({
  scope,
  title = 'Alertas',
  subtitle,
}: {
  scope: { machine: string } | { sensor: string };
  title?: string;
  subtitle?: string;
}): JSX.Element {
  const params: AlertListParams = 'machine' in scope ? { machine: scope.machine } : { sensor: scope.sensor };
  const key = 'machine' in scope ? `m:${scope.machine}` : `s:${scope.sensor}`;
  const active = useAnalyticsQuery(() => api.alerts({ ...params, status: 'active', pageSize: 100, sortBy: 'level', sortDir: 'desc' }), [key]);
  const recent = useAnalyticsQuery(
    () => api.alerts({ ...params, status: 'resolved', pageSize: RECENT_LIMIT, sortBy: 'lastEvaluatedAt', sortDir: 'desc' }),
    [key],
  );
  const loading = active.status === 'loading' || active.status === 'idle' || recent.status === 'loading' || recent.status === 'idle';
  const failed = active.status === 'failed' || recent.status === 'failed';
  const activeItems = active.data?.items ?? [];
  const resolvedItems = recent.data?.items ?? [];
  const counts = active.data?.counts;
  const listHref = links.alerts({ ...('machine' in scope ? { machine: scope.machine } : { sensor: scope.sensor }), status: 'all' });

  return (
    <Card variant="outlined" component="section" aria-labelledby="alerts-section-title">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={1}
        sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, pt: 1.5, pb: 0.5 })}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h2" component="h2" id="alerts-section-title">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            {subtitle ??
              'Episódios persistidos pelo motor (baseline aprendida do ponto) — diferente da condição derivada mostrada acima.'}
          </Typography>
        </Box>
        <Button component={RouterLink} to={listHref} size="small" variant="text" sx={{ flexShrink: 0 }}>
          Ver todos{counts ? ` (${counts.total})` : ''}
        </Button>
      </Stack>

      {failed ? (
        <Box sx={{ p: 2 }}>
          <ErrorState
            message={active.error ?? recent.error ?? 'Falha ao consultar alertas.'}
            onRetry={() => {
              active.reload();
              recent.reload();
            }}
          />
        </Box>
      ) : null}

      {loading && !failed ? (
        <Stack spacing={1} sx={{ p: 2 }} role="status" aria-label="Carregando alertas">
          {[0, 1].map((item) => (
            <Skeleton key={item} variant="rounded" height={40} />
          ))}
        </Stack>
      ) : null}

      {!loading && !failed ? (
        <Box sx={{ pb: 1 }}>
          <Group label={`Ativos (${activeItems.length})`} items={activeItems} empty="Nenhum alerta ativo neste recorte." />
          <Group label="Últimos resolvidos" items={resolvedItems} empty="Nenhum episódio resolvido ainda." />
        </Box>
      ) : null}
    </Card>
  );
}

function Group({ label, items, empty }: { label: string; items: AlertOccurrenceDto[]; empty: string }): JSX.Element {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" component="div" sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, pt: 1 })}>
        {label}
      </Typography>
      {items.length === 0 ? (
        <Typography variant="caption" color="text.secondary" component="div" sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, py: 0.75 })}>
          {empty}
        </Typography>
      ) : (
        <Stack component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {items.map((alert) => (
            <Box
              component="li"
              key={alert.id}
              sx={(theme) => ({
                borderTop: 1,
                borderColor: 'divider',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
              })}
            >
              <Stack
                component={RouterLink}
                to={links.alert(alert.id)}
                direction="row"
                alignItems="center"
                gap={1.25}
                aria-label={`Abrir alerta ${alert.level} ${ALERT_TYPE_SHORT[alert.type]}: ${alertSummary(alert)}`}
                sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, py: 0.9, textDecoration: 'none', color: 'inherit' })}
              >
                <AlertLevelTag level={alert.level} status={alert.status} label={alert.level} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 650 }} noWrap>
                    {ALERT_TYPE_SHORT[alert.type]}
                    {alert.monitoringPointName ? ` · ${alert.monitoringPointName}` : ''}
                    {alert.sensorSerialNumber ? ` · ${alert.sensorSerialNumber}` : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="div" noWrap title={alertSummary(alert)}>
                    {alert.status === 'resolved' ? `resolvido ${formatShortDateTime(alert.resolvedAt)}` : `desde ${formatShortDateTime(alert.openedAt)}`} · {alertSummary(alert)}
                  </Typography>
                </Box>
                <AlertStatusTag status={alert.status} />
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

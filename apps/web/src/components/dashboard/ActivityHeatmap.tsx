import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme, type Theme } from '@mui/material/styles';

import { DEFAULT_CONDITION_POLICY, type HeatmapBucketDto, type HeatmapResponseDto, machineTag } from '@dynamox/domain';
import { EmptyState, ErrorState } from '@dynamox/ui';

import { formatMeasurement, formatNumber } from '../../features/dashboard/dashboardFormatters';
import { formatDayKey, formatHourLabel, formatWeekdayKey } from '../../features/time/instant';
import { DashboardCard } from './DashboardCard';

/**
 * SEVERIDADE por data × hora, calculada no banco (`/analytics/heatmap`).
 *
 * A célula pinta o MAIOR desvio radial da frota naquela hora — a leitura mais alta contra a
 * baseline saudável do próprio ponto. Antes ela pintava cobertura ("quantos sensores
 * reportaram"), que numa planta de cadência fixa é praticamente binária: 156 das 168 células
 * diziam "12 de 12", a escala de cor tinha dois tons na prática e a única informação real
 * ("ninguém reportou") já é dita, com mais contexto, pelo alerta de perda de telemetria.
 *
 * Com magnitude, a grade passa a responder o que só ela responde bem: ONDE NO TEMPO piorou.
 * Uma degradação aparece como um bloco que escurece dia após dia; um transiente aparece como
 * uma célula quente sozinha — a mesma distinção que o gatilho de leituras consecutivas faz.
 *
 * A cor usa o vocabulário de condição do produto (normal / observação / atenção), então o
 * tom não é decorativo: ele diz em que faixa da política aquela hora caiu.
 */
export interface ActivityHeatmapProps {
  data: HeatmapResponseDto | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  /** Abre a janela temporal correspondente à célula. */
  onSelectWindow: (bucketStart: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const { observationRatio, attentionRatio } = DEFAULT_CONDITION_POLICY;
/** Acima disto a cor satura: o que importa é "muito acima", não a casa decimal. */
export const COLOR_CEILING = 3.5;

/**
 * Razão → cor, nas faixas da política. Dentro de cada faixa a intensidade cresce, para que
 * a diferença entre 1,45× e 1,58× — a rampa acontecendo — seja visível sem trocar de faixa.
 */
export function severityColor(ratio: number | null, palette: Theme['palette']): string {
  if (ratio === null || !Number.isFinite(ratio)) return alpha(palette.text.disabled, 0.12);
  if (ratio < observationRatio) {
    const t = Math.max(0, Math.min(1, (ratio - 1) / (observationRatio - 1)));
    return alpha(palette.condition.normal, 0.14 + t * 0.3);
  }
  if (ratio < attentionRatio) {
    const t = (ratio - observationRatio) / (attentionRatio - observationRatio);
    return alpha(palette.condition.observation, 0.5 + t * 0.38);
  }
  const t = Math.min(1, (ratio - attentionRatio) / (COLOR_CEILING - attentionRatio));
  return alpha(palette.condition.attention, 0.62 + t * 0.38);
}

/** O que a célula diz ao ser apontada — e por que ela vale um clique. */
function cellTooltip(day: string, hour: number, bucket: HeatmapBucketDto | undefined): string {
  const quando = `${formatDayKey(day)} ${formatHourLabel(hour)}`;
  if (!bucket) return `${quando} — nenhuma aquisição nesta hora`;
  if (bucket.maxDeviationRatio === null) {
    return `${quando} — ${bucket.reportingSensors}/${bucket.expectedSensors} sensores reportaram, mas nenhum ponto tem baseline estabelecida ainda`;
  }
  const onde = [bucket.maxDeviationMachine ? machineTag(bucket.maxDeviationMachine) : null, bucket.maxDeviationPoint, bucket.maxDeviationSensor]
    .filter(Boolean)
    .join(' · ');
  return (
    `${quando} — pior desvio ${formatNumber(bucket.maxDeviationRatio, 2)}× ` +
    `(${formatMeasurement(bucket.maxDeviationValue, 'g')}) em ${onde}. ` +
    `${bucket.reportingSensors}/${bucket.expectedSensors} sensores · ${bucket.acquisitionCount} aquisição(ões). Clique para investigar.`
  );
}

export function ActivityHeatmap({
  data,
  loading,
  error,
  onRetry,
  onSelectWindow,
}: ActivityHeatmapProps): JSX.Element {
  const muiTheme = useTheme();

  const byDay = new Map<string, Map<number, HeatmapBucketDto>>();
  for (const bucket of data?.buckets ?? []) {
    const hours = byDay.get(bucket.day) ?? new Map<number, HeatmapBucketDto>();
    hours.set(bucket.hour, bucket);
    byDay.set(bucket.day, hours);
  }
  // Mais recente em cima: a investigação começa pelo que acabou de acontecer.
  const days = [...byDay.keys()].sort().reverse().slice(0, 14);

  const comSeveridade = (data?.buckets ?? []).filter((bucket) => bucket.maxDeviationRatio !== null);
  const pior = comSeveridade.reduce<HeatmapBucketDto | null>(
    (maior, bucket) => (maior === null || (bucket.maxDeviationRatio ?? 0) > (maior.maxDeviationRatio ?? 0) ? bucket : maior),
    null,
  );

  return (
    <DashboardCard
      title="Severidade por hora (data × hora)"
      titleId="activity-heatmap-title"
      subtitle="Maior desvio radial da frota em cada hora, contra a baseline aprendida do ponto. Clique numa célula para investigar a janela."
      info="Reaproveita a evidência por ciclo já calculada pelo motor de alertas e a baseline por hora UTC de cada ponto — a mesma fórmula do resto do produto, sem baixar amostra bruta. Hora sem aquisição, ou ponto ainda sem baseline, fica neutra."
      action={
        pior ? (
          <Typography variant="caption" color="text.secondary" noWrap>
            pico {formatNumber(pior.maxDeviationRatio, 2)}× · {pior.maxDeviationSensor}
          </Typography>
        ) : undefined
      }
    >
      {loading ? <Skeleton variant="rounded" height={210} /> : null}

      {!loading && error ? (
        <ErrorState message={error} onRetry={onRetry} title="Não foi possível carregar o mapa" />
      ) : null}

      {!loading && !error && days.length === 0 ? (
        <EmptyState
          title="Sem leituras no período"
          description="O mapa é preenchido conforme as aquisições são persistidas."
        />
      ) : null}

      {!loading && !error && days.length > 0 ? (
        <Box sx={{ overflowX: 'auto', flexGrow: 1, display: 'flex' }}>
          <Box sx={{ minWidth: 620, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '62px repeat(24, minmax(0, 1fr))', gap: '1px', mb: '1px' }}
              aria-hidden="true"
            >
              <Box />
              {HOURS.map((hour) => (
                <Typography
                  key={hour}
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 10, textAlign: 'center', lineHeight: 1 }}
                >
                  {hour % 2 === 0 ? formatHourLabel(hour) : ''}
                </Typography>
              ))}
            </Box>

            {days.map((day) => (
              <Box
                key={day}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '62px repeat(24, minmax(0, 1fr))',
                  gap: '1px',
                  mb: '1px',
                  flex: 1,
                  minHeight: 18,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', display: 'flex', alignItems: 'center' }}
                >
                  {formatDayKey(day)} {formatWeekdayKey(day)}
                </Typography>
                {HOURS.map((hour) => {
                  const bucket = byDay.get(day)?.get(hour);
                  const ratio = bucket?.maxDeviationRatio ?? null;
                  const rotulo =
                    ratio === null
                      ? `Investigar ${formatDayKey(day)} ${hour}h: sem desvio calculável`
                      : `Investigar ${formatDayKey(day)} ${hour}h: pior desvio ${formatNumber(ratio, 2)}× em ${bucket?.maxDeviationSensor ?? '—'}`;
                  return (
                    <Tooltip key={hour} arrow enterDelay={120} title={cellTooltip(day, hour, bucket)}>
                      <Box
                        component="button"
                        type="button"
                        disabled={!bucket}
                        onClick={() => bucket && onSelectWindow(bucket.bucketStart)}
                        aria-label={rotulo}
                        sx={{
                          all: 'unset',
                          cursor: bucket ? 'pointer' : 'default',
                          display: 'block',
                          height: '100%',
                          minHeight: 14,
                          borderRadius: '2px',
                          bgcolor: severityColor(ratio, muiTheme.palette),
                          '&:hover': bucket
                            ? { outline: `2px solid ${muiTheme.palette.text.primary}`, outlineOffset: -1 }
                            : undefined,
                          '&:focus-visible': { outline: `2px solid ${muiTheme.palette.text.primary}` },
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            ))}

            {/* A legenda nomeia as FAIXAS da política — a cor não é decorativa. */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={0.75}
              sx={{ mt: 'auto', pt: 1, flexWrap: 'wrap', rowGap: 0.5 }}
            >
              {[
                { label: 'sem dado', ratio: null },
                { label: '1×', ratio: 1 },
                { label: `${formatNumber(observationRatio, 1)}× observação`, ratio: observationRatio },
                { label: `${formatNumber(attentionRatio, 1)}× atenção`, ratio: attentionRatio },
                { label: `${formatNumber(COLOR_CEILING, 1)}×+`, ratio: COLOR_CEILING },
              ].map((step) => (
                <Stack key={step.label} direction="row" alignItems="center" spacing={0.4}>
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 16,
                      height: 8,
                      borderRadius: '2px',
                      bgcolor: severityColor(step.ratio, muiTheme.palette),
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {step.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>
      ) : null}
    </DashboardCard>
  );
}

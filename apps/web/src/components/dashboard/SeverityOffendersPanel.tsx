import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { machineTag, type HeatmapResponseDto } from '@dynamox/domain';
import { EmptyState } from '@dynamox/ui';

import { formatMeasurement, formatNumber } from '../../features/dashboard/dashboardFormatters';
import { formatDayKey, formatHourLabel } from '../../features/time/instant';
import { COLOR_CEILING, severityColor } from './ActivityHeatmap';
import { DashboardCard } from './DashboardCard';

/**
 * Quem puxa a severidade: os líderes horários do mapa, agrupados por sensor.
 *
 * Substitui "Atividade de aquisição (24 h)": amostras por hora numa frota de cadência fixa
 * são uma constante (12 sensores × 4 aquisições × 60 amostras = 2 880/h) — o gráfico só
 * sabia dizer "ligado/desligado", e "desligado" já é dito com contexto pelo alerta de perda
 * de telemetria. Aqui cada hora do período elege, no banco, o pior desvio da frota; o painel
 * soma essas lideranças por sensor: até onde cada um chegou e por quantas horas foi o pior.
 * Numa frota sadia a lista é curta e clara — a ausência é o resultado bom.
 */
interface Offender {
  sensor: string;
  machine: string | null;
  point: string | null;
  /** Horas do período em que este sensor foi o pior desvio da frota. */
  hoursLed: number;
  peakRatio: number;
  peakValue: number | null;
  peakDay: string;
  peakHour: number;
  peakBucketStart: string;
}

export function SeverityOffendersPanel({
  heatmap,
  loading,
  onSelectWindow,
}: {
  heatmap: HeatmapResponseDto | null;
  loading: boolean;
  /** Abre a janela do pico do sensor na investigação. */
  onSelectWindow: (bucketStart: string) => void;
}): JSX.Element {
  const muiTheme = useTheme();

  const bySensor = new Map<string, Offender>();
  let ledTotal = 0;
  for (const bucket of heatmap?.buckets ?? []) {
    if (bucket.maxDeviationRatio === null || !bucket.maxDeviationSensor) continue;
    ledTotal += 1;
    const current = bySensor.get(bucket.maxDeviationSensor);
    if (!current) {
      bySensor.set(bucket.maxDeviationSensor, {
        sensor: bucket.maxDeviationSensor,
        machine: bucket.maxDeviationMachine,
        point: bucket.maxDeviationPoint,
        hoursLed: 1,
        peakRatio: bucket.maxDeviationRatio,
        peakValue: bucket.maxDeviationValue,
        peakDay: bucket.day,
        peakHour: bucket.hour,
        peakBucketStart: bucket.bucketStart,
      });
      continue;
    }
    current.hoursLed += 1;
    if (bucket.maxDeviationRatio > current.peakRatio) {
      current.peakRatio = bucket.maxDeviationRatio;
      current.peakValue = bucket.maxDeviationValue;
      current.peakDay = bucket.day;
      current.peakHour = bucket.hour;
      current.peakBucketStart = bucket.bucketStart;
      current.machine = bucket.maxDeviationMachine;
      current.point = bucket.maxDeviationPoint;
    }
  }
  const offenders = [...bySensor.values()].sort((a, b) => b.peakRatio - a.peakRatio).slice(0, 6);

  return (
    <DashboardCard
      title="Quem puxa a severidade"
      titleId="severity-offenders-title"
      size="chart"
      subtitle="Por sensor: o pico de desvio no período e quantas horas ele foi o pior da frota."
      info="Agrupamento dos mesmos buckets do mapa: cada hora elege o pior desvio contra a baseline; aqui as horas lideradas são somadas por sensor. Sensor que nunca liderou uma hora não aparece. A barra satura em 3,5×, o mesmo teto de cor do mapa."
      action={
        bySensor.size > 0 ? (
          <Typography variant="caption" color="text.secondary" noWrap>
            {bySensor.size} sensor(es) · {ledTotal} h
          </Typography>
        ) : undefined
      }
    >
      {loading ? <Skeleton variant="rounded" height={150} /> : null}

      {!loading && offenders.length === 0 ? (
        <EmptyState
          title="Sem desvio calculável no período"
          description="A lista aparece quando algum ponto tem baseline estabelecida."
        />
      ) : null}

      {!loading && offenders.length > 0 ? (
        <Stack spacing={0.5} sx={{ flexGrow: 1, justifyContent: 'center' }}>
          {offenders.map((offender) => {
            const where = [offender.machine ? machineTag(offender.machine) : null, offender.point]
              .filter(Boolean)
              .join(' · ');
            const pico = `${formatDayKey(offender.peakDay)} ${formatHourLabel(offender.peakHour)}`;
            return (
              <Tooltip
                key={offender.sensor}
                arrow
                enterDelay={120}
                title={`Pico ${formatNumber(offender.peakRatio, 2)}× (${formatMeasurement(offender.peakValue, 'g')}) em ${pico}, em ${where}. Foi o pior da frota em ${offender.hoursLed} hora(s) do período. Clique para investigar a janela do pico.`}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => onSelectWindow(offender.peakBucketStart)}
                  aria-label={`Investigar o pico de ${offender.sensor}: ${formatNumber(offender.peakRatio, 2)}× em ${pico}`}
                  sx={{
                    all: 'unset',
                    display: 'block',
                    cursor: 'pointer',
                    borderRadius: 1,
                    px: 0.75,
                    py: 0.5,
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:focus-visible': { outline: `2px solid ${muiTheme.palette.text.primary}` },
                  }}
                >
                  <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 0.4 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }} noWrap>
                      {offender.sensor}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
                      {where}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {formatNumber(offender.peakRatio, 2)}×
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ width: 34, textAlign: 'right' }}>
                      {offender.hoursLed} h
                    </Typography>
                  </Stack>
                  <Box aria-hidden="true" sx={{ height: 6, borderRadius: '3px', bgcolor: alpha(muiTheme.palette.text.disabled, 0.12) }}>
                    <Box
                      sx={{
                        height: '100%',
                        borderRadius: '3px',
                        width: `${Math.min(100, (offender.peakRatio / COLOR_CEILING) * 100)}%`,
                        bgcolor: severityColor(offender.peakRatio, muiTheme.palette),
                      }}
                    />
                  </Box>
                </Box>
              </Tooltip>
            );
          })}
        </Stack>
      ) : null}
    </DashboardCard>
  );
}

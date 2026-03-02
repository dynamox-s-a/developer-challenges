import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { MonitoringPointWithMachineAndSensor } from '@dynamox/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createTimeSeries,
  deleteAllTimeSeries,
  fetchTimeSeries,
} from '../store/features/time-series/time-series.slice';
import { notify } from '../utils/notifications';
import { useConfirmDialog } from '../utils/useConfirmDialog';
import { METRICS, type MetricKey } from '../utils/constants';
import ConfirmDialog from './ConfirmDialog';
import MetricChart from './MetricChart';
import ExperimentalFeatureBadge from './ExperimentalFeatureBadge';

interface TimeSeriesModalProps {
  open: boolean;
  onClose: () => void;
  point: MonitoringPointWithMachineAndSensor | undefined;
}

function formatMetric(value: number | null | undefined): string {
  if (value == null) return '—';
  return value.toFixed(2);
}

function generateTestEntries(count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    temperature: parseFloat((20 + Math.random() * 60).toFixed(2)),
    accelerationRms: parseFloat((Math.random() * 10).toFixed(2)),
    velocityRms: parseFloat((Math.random() * 50).toFixed(2)),
    timestamp: new Date(Date.now() - (count - i) * 60_000).toISOString(),
  }));
}

function TimeSeriesModal({ open, onClose, point }: TimeSeriesModalProps) {
  const dispatch = useAppDispatch();
  const { entries, metrics, isLoading } = useAppSelector((state) => state.timeSeries);
  const [tab, setTab] = useState<MetricKey>('temperature');
  const { confirm, dialogProps } = useConfirmDialog();

  const sensorUuid = point?.sensor?.uuid;

  useEffect(() => {
    if (open && sensorUuid) {
      dispatch(fetchTimeSeries(sensorUuid));
    }
  }, [open, sensorUuid, dispatch]);

  const handleAddData = async () => {
    if (!sensorUuid) return;
    try {
      await dispatch(createTimeSeries({ sensorUuid, data: generateTestEntries(10) })).unwrap();
      notify('10 registros adicionados com sucesso.', 'success');
    } catch {
      notify('Erro ao adicionar registros. Tente novamente.', 'error');
    }
  };

  const handleDeleteAll = async () => {
    if (!sensorUuid) return;
    const confirmed = await confirm({
      title: 'Limpar todos os dados?',
      description: `Isso irá remover permanentemente todos os registros de série temporal deste sensor.`,
      severity: 'error',
      confirmLabel: 'Limpar tudo',
    });
    if (confirmed) {
      try {
        await dispatch(deleteAllTimeSeries(sensorUuid)).unwrap();
        notify('Dados removidos com sucesso.', 'success');
      } catch {
        notify('Erro ao remover dados. Tente novamente.', 'error');
      }
    }
  };

  const activeMetric = METRICS.find((m) => m.key === tab) ?? METRICS[0];

  const chartData = entries.map((entry) => ({
    time: new Date(entry.timestamp).toLocaleTimeString('pt-BR'),
    temperature: entry.temperature,
    accelerationRms: entry.accelerationRms,
    velocityRms: entry.velocityRms,
  }));

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Análise de Série Temporal
              </Typography>
              {point && (
                <>
                  <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                    {point.machine.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {point.name} · {point.sensor?.model}
                  </Typography>
                </>
              )}
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              mb: 2,
              bgcolor: alpha(theme.palette.info.main, 0.08),
              border: '1px solid',
              borderColor: alpha(theme.palette.info.main, 0.3),
              borderRadius: 1,
              color: 'info.main',
            })}
          >
            <InfoOutlinedIcon fontSize="small" />
            <Typography variant="body2">Exibindo dados das últimas 24 horas.</Typography>
          </Box>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {metrics?.count ?? entries.length} pontos
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<DeleteForeverIcon />}
                disableElevation
                disabled={entries.length === 0}
                onClick={handleDeleteAll}
              >
                Limpar tudo
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                endIcon={
                  <ExperimentalFeatureBadge tooltipText="Simulação para fins de demonstração. Em produção, assume-se que os dados seriam alimentados automaticamente pelo sensor (ex: polling ou pub/sub remoto)." />
                }
                onClick={handleAddData}
              >
                Adicionar dados
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
            {METRICS.map(({ label, key, unit, Icon }) => {
              const m = metrics?.[key];
              return (
                <Paper key={key} variant="outlined" sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mb: 1.5,
                      justifyContent: 'center',
                    }}
                  >
                    <Icon fontSize="small" color="action" />
                    <Typography variant="subtitle2">
                      {label} ({unit})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    {(['min', 'avg', 'max'] as const).map((stat) => (
                      <Box key={stat} sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textTransform: 'uppercase', display: 'block' }}
                        >
                          {stat}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatMetric(m?.[stat])}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              );
            })}
          </Box>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            {METRICS.map(({ key, label, Icon }) => (
              <Tab
                key={key}
                value={key}
                label={label}
                icon={<Icon fontSize="small" />}
                iconPosition="start"
              />
            ))}
          </Tabs>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : entries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Nenhum dado nas últimas 24 horas. Clique em "Adicionar dados" para gerar registros
                de teste.
              </Typography>
            </Box>
          ) : (
            <MetricChart
              data={chartData}
              dataKey={activeMetric.key}
              label={activeMetric.label}
              unit={activeMetric.unit}
              color={activeMetric.color}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog {...dialogProps} />
    </>
  );
}

export default TimeSeriesModal;

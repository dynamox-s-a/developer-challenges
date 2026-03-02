import { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SensorsIcon from '@mui/icons-material/Sensors';
import RadarIcon from '@mui/icons-material/Radar';
import BarChartIcon from '@mui/icons-material/BarChart';
import SpeedIcon from '@mui/icons-material/Speed';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDashboardMetrics } from '../../store/features/reports/report.slice';
import MetricCard from '../../components/MetricCard';
import PieChartCard from '../../components/PieChartCard';
import { notify } from '../../utils/notifications';
import { MACHINE_COLORS, SENSOR_COLORS, SENSOR_LABEL_MAP } from '../../utils/constants';

function MainDashboard() {
  const dispatch = useAppDispatch();
  const { metrics, isLoading, error } = useAppSelector((state) => state.reports);

  useEffect(() => {
    if (error) notify(error, 'error');
  }, [error]);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

  const sensorCoverage =
    metrics && metrics.monitoringPointCount > 0
      ? Math.round((metrics.assignedSensorCount / metrics.monitoringPointCount) * 100)
      : 0;

  const cards = [
    {
      title: 'Máquinas',
      value: metrics?.machineCount ?? 0,
      icon: <PrecisionManufacturingIcon />,
    },
    {
      title: 'Pontos de Monitoramento',
      value: metrics?.monitoringPointCount ?? 0,
      icon: <RadarIcon />,
    },
    {
      title: 'Sensores Atribuídos',
      value: metrics?.assignedSensorCount ?? 0,
      icon: <SensorsIcon />,
    },
    {
      title: 'Registros de Série Temporal',
      value: metrics?.timeSeriesRecordCount ?? 0,
      icon: <BarChartIcon />,
    },
    {
      title: 'Cobertura de Sensores',
      value: `${sensorCoverage}%`,
      icon: <SpeedIcon />,
    },
  ];

  const machinesByTypeData = (metrics?.machinesByType ?? []).map((item) => ({
    name: item.type,
    value: item._count.type,
  }));

  const sensorDistributionData = (metrics?.sensorDistribution ?? []).map((item) => ({
    name: SENSOR_LABEL_MAP[item.model] ?? item.model,
    value: item._count.model,
  }));

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Visão geral da plataforma de monitoramento de ativos
      </Typography>

      <Grid container spacing={3} columns={{ xs: 1, sm: 2, md: 5 }} sx={{ mb: 3 }}>
        {cards.map((card) => (
          <Grid item xs={1} key={card.title}>
            <MetricCard {...card} loading={isLoading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PieChartCard
            title="Máquinas por Tipo"
            data={machinesByTypeData}
            colors={MACHINE_COLORS}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PieChartCard
            title="Distribuição de Sensores"
            data={sensorDistributionData}
            colors={SENSOR_COLORS}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainDashboard;

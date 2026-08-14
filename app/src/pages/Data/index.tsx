import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDataRequest } from '../../store/data/actions';
import { selectData, selectDataError, selectDataLoading } from '../../store/data/selectors';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Paper, Stack, useTheme } from '@mui/material';
import MachineIcon from '../../components/icons/Machine';
import LocationIcon from '../../components/icons/Location';
import RpmIcon from '../../components/icons/Rpm';
import DurationIcon from '../../components/icons/Duration';
import IntervalIcon from '../../components/icons/Interval';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

const chartConfig = {
  title: {
    text: '',
  },
  chart: {
    type: 'line',
    spacingBottom: 15,
    spacingTop: 25,
    spacingLeft: 20,
    spacingRight: 20,
    plotBorderWidth: 1,
    plotBorderColor: '#E5E7EB',
  },
  xAxis: {
    type: 'datetime',
    tickInterval: 4 * 24 * 3600 * 1000,
    gridLineWidth: 1,
    gridLineColor: '#E5E7EB',
  },
  yAxis: {
    gridLineWidth: 1,
    gridLineColor: '#E5E7EB',
  },
  palette: {
    colorScheme: 'light',
  },
  tooltip: {
    xDateFormat: '%d/%m/%Y %H:%M:%S',
    shared: true,
  },
};

export default function Data() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const data = useSelector(selectData);
  const loading = useSelector(selectDataLoading);
  const error = useSelector(selectDataError);

  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ my: 2, fontWeight: 500, fontSize: 20, color: theme.palette.primary.main }}
        >
          Análise de Dados
        </Typography>
      </Box>
      <Divider />
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={2}
        sx={{ backgroundColor: '#F8FAFC', p: 2, pb: 8 }}
      >
        <Paper
          variant="outlined"
          sx={{
            display: 'flex',
            alignItems: 'center',
            minHeight: 46,
            justifyContent: 'space-between',
            p: 1,
          }}
        >
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ width: '100%' }}>
            <MachineIcon />
            <Typography variant="body2" color="text.secondary" sx={{ pt: 0.25 }}>
              Máquina 1023
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ width: '100%' }}>
            <LocationIcon />
            <Typography variant="body2" color="text.secondary" sx={{ pt: 0.25 }}>
              Ponto 20192
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ width: '100%' }}>
            <RpmIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary" sx={{ pt: 0.25 }}>
              200
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ width: '100%' }}>
            <DurationIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary" sx={{ pt: 0.25 }}>
              16g
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ width: '100%' }}>
            <IntervalIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary" sx={{ pt: 0.25 }}>
              20 min
            </Typography>
          </Stack>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 46,
            justifyContent: 'space-between',
            p: 2,
            gap: 2,
            pb: 8,
          }}
        >
          <Paper variant="outlined">
            <Typography
              variant="body2"
              sx={{ p: 2, color: theme.palette.primary.main, fontWeight: 500 }}
            >
              Aceleração RMS
            </Typography>
            <Divider></Divider>
            {data[0] && (
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...chartConfig,
                  yAxis: {
                    ...chartConfig.yAxis,
                    title: {
                      text: 'Aceleração RMS (g)',
                    },
                  },
                  series: [
                    {
                      name: data[0].name,
                      type: 'line',
                      data: data[0].data.map((point) => [point.datetime, point.max]),
                    },
                    {
                      name: data[1].name,
                      type: 'line',
                      data: data[1].data.map((point) => [point.datetime, point.max]),
                    },
                    {
                      name: data[2].name,
                      type: 'line',
                      data: data[3].data.map((point) => [point.datetime, point.max]),
                    },
                  ],
                }}
              />
            )}
          </Paper>
          <Paper variant="outlined">
            <Typography
              variant="body2"
              sx={{ p: 2, color: theme.palette.primary.main, fontWeight: 500 }}
            >
              Temperatura
            </Typography>
            <Divider></Divider>
            {data[0] && (
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...chartConfig,
                  yAxis: {
                    ...chartConfig.yAxis,
                    title: {
                      text: 'Temperatura (ºC)',
                    },
                  },
                  series: [
                    {
                      name: data[6].name,
                      type: 'line',
                      data: data[6].data.map((point) => [point.datetime, point.max]),
                    },
                  ],
                }}
              />
            )}
          </Paper>
          <Paper variant="outlined">
            <Typography
              variant="body2"
              sx={{ p: 2, color: theme.palette.primary.main, fontWeight: 500 }}
            >
              Velocidade RMS
            </Typography>
            <Divider></Divider>
            {data[0] && (
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  ...chartConfig,
                  yAxis: {
                    ...chartConfig.yAxis,
                    title: {
                      text: 'Aceleração  (g)',
                    },
                  },
                  series: [
                    {
                      name: data[3].name,
                      type: 'line',
                      data: data[3].data.map((point) => [point.datetime, point.max]),
                    },
                    {
                      name: data[4].name,
                      type: 'line',
                      data: data[4].data.map((point) => [point.datetime, point.max]),
                    },
                    {
                      name: data[5].name,
                      type: 'line',
                      data: data[5].data.map((point) => [point.datetime, point.max]),
                    },
                  ],
                }}
              />
            )}
          </Paper>
        </Paper>
      </Box>
    </main>
  );
}

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchDataRequest } from '../../store/data/actions';
import { selectData, selectDataError, selectDataLoading } from '../../store/data/selectors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import Header from '../../components/Header';
import Chart from '../../components/Chart';
import Loading from '../../components/Loading';
import MachineInfo from '../../components/MachineInfo';
import useChartSync from '../../hooks/useChartSync';
import { parseSeries } from '../../parsers/parserSeries';

export default function Data() {
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null!);

  const data = useSelector(selectData);
  const loading = useSelector(selectDataLoading);
  const error = useSelector(selectDataError);

  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);

  useChartSync({ containerRef, data });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <main>
        <Header />
        <Divider />
        <Box
          sx={{
            minHeight: 'calc(100vh - 57px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            p: 3,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              px: 4,
              py: 5,
              width: '100%',
              maxWidth: 480,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Ocorreu um erro ao carregar os dados
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Recarregar tela
            </Button>
          </Paper>
        </Box>
      </main>
    );
  }

  return (
    <main>
      <Header />
      <Divider />
      <Box
        ref={containerRef}
        display={'flex'}
        flexDirection={'column'}
        gap={2}
        sx={{ backgroundColor: '#F8FAFC', p: 2, pb: 8 }}
      >
        <MachineInfo />
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
          <Chart
            title="Aceleração RMS"
            xAxisTitle="Aceleração RMS (g)"
            series={parseSeries(data, [0, 1, 2])}
          />
          <Chart
            title="Temperatura"
            xAxisTitle="Temperatura (ºC)"
            series={parseSeries(data, [6])}
          />
          <Chart
            title="Velocidade RMS"
            xAxisTitle="Aceleração (g)"
            series={parseSeries(data, [3, 4, 5])}
          />
        </Paper>
      </Box>
    </main>
  );
}

import { useEffect } from 'react';
import {
  CircularProgress,
  Alert,
  Box,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMetricsRequest } from '../../features/data/dataSlice';
import { pageContainerStyle } from './style';

const DataPage = () => {
  const dispatch = useAppDispatch();

  const { metrics, isLoading, error } = useAppSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchMetricsRequest());
  }, [dispatch]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={pageContainerStyle}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'grey.300',
        }}
      >
        <Typography variant="h1" fontWeight="bold">
          Análise de Dados
        </Typography>
      </Paper>

      <Stack spacing={2}>
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 1,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Informacoes da Máquina
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 1,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'grey.300',
          }}
        >
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 1,
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Gráfico de Aceleração
            </Typography>
          </Paper>

          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 1,
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Gráfico de Temperaturas
            </Typography>
          </Paper>

          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 1,
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Gráfico de Velocidade
            </Typography>
          </Paper>
        </Paper>
      </Stack>
    </Box>
  );
};

export default DataPage;

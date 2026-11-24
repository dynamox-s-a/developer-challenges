import { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTimeSeriesCount } from './time-series.slice';

// Quantas séries temporais estão guardadas no sistema, somando todos os
// pontos. Busca o número sempre que aparece na tela
export function TimeSeriesCount() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.timeSeries.count);

  useEffect(() => {
    const request = dispatch(fetchTimeSeriesCount());
    // Saiu da página antes da resposta? Cancela a busca
    return () => request.abort();
  }, [dispatch]);

  // Enquanto o número não chega (ou se a busca falhar), não mostra nada
  if (count === null) {
    return null;
  }

  return (
    <Typography color="text.secondary">
      Séries temporais armazenadas: {count.toLocaleString('pt-BR')}
    </Typography>
  );
}

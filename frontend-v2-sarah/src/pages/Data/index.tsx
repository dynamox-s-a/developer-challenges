import { useEffect } from 'react';
import { CircularProgress, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMetricsRequest } from '../../features/data/dataSlice';

const DataPage = () => {
  const dispatch = useAppDispatch();

  const { metrics, isLoading, error } = useAppSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchMetricsRequest());
  }, [dispatch]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <h1>Metricas carregadas</h1>
      <pre>{JSON.stringify(metrics, null, 2)}</pre>
    </>
  );
};

export default DataPage;

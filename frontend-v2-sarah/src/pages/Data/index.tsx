import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import type { RootState } from '../../app/store';
import type { AppDispatch } from '../../app/store';
import { fetchMetricsRequest } from '../../features/data/dataSlice';

const DataPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { metrics, loading, error } = useSelector(
    (state: RootState) => state.data,
  );

  useEffect(() => {
    dispatch(fetchMetricsRequest());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <alert severity="error">{error}</alert>;

  return (
    <>
      <h1>Metricas carregadas</h1>
    </>
  );
};

export default DataPage;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <pre>{JSON.stringify(metrics, null, 2)}</pre>;
};

export default DataPage;

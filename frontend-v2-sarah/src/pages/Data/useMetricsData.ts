import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMetricsRequest } from '../../features/data/dataSlice';

export const useMetricsData = () => {
  const dispatch = useAppDispatch();

  const { metrics, isLoading, error } = useAppSelector((state) => state.data);

  const getMetrics = useCallback(() => {
    dispatch(fetchMetricsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!metrics && !isLoading) getMetrics();
  }, [metrics, isLoading, getMetrics]);

  return { metrics, isLoading, error };
};

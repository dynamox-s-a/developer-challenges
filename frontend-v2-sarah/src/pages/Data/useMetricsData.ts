import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMetricsRequest } from '../../features/data/dataSlice';

export const useMetricsData = () => {
  const dispatch = useAppDispatch();

  const { metrics, isLoading, error } = useAppSelector((state) => state.data);
  const hasFetched = useRef(false);

  const getMetrics = useCallback(() => {
    dispatch(fetchMetricsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!hasFetched.current && !isLoading) {
      hasFetched.current = true;
      getMetrics();
    }
  }, [metrics, isLoading, getMetrics]);

  return { metrics, isLoading, error };
};

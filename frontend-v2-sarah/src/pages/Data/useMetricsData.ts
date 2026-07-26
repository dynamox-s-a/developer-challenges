import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMetricsRequest } from '../../features/data/dataSlice';

export const useMetricsData = () => {
  const dispatch = useAppDispatch();

  const { metrics, isLoading, error } = useAppSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchMetricsRequest());
  }, [dispatch]);

  return { metrics, isLoading, error };
};

import Chip from '@mui/material/Chip';
import { useEffect } from 'react';
import { checkApiHealth, type ApiStatus } from '../features/health/health-slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const LABELS: Record<ApiStatus, string> = {
  unknown: 'API: checking',
  online: 'API: online',
  offline: 'API: offline',
};

const COLORS = { unknown: 'default', online: 'success', offline: 'error' } as const;

/** Tells whether the API answers, so a screen with no data is never mistaken for an empty one. */
export function ApiStatusChip() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.health.status);

  useEffect(() => {
    void dispatch(checkApiHealth());
  }, [dispatch]);

  return <Chip size="small" label={LABELS[status]} color={COLORS[status]} />;
}

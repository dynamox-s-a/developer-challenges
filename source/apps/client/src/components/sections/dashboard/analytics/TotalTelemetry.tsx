import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store/store';
import { fetchTotalTelemetry, updateStats } from 'store/slices/statsSlice';
import { socket } from 'utils/socket';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const TotalTelemetry = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { totalTelemetry } = useSelector((state: RootState) => state.stats);

  useEffect(() => {
    dispatch(fetchTotalTelemetry());

    socket.on('telemetry_count_update', (data) => {
      dispatch(updateStats(data));
    });

    return () => {
      socket.off('telemetry_count_update');
    };
  }, [dispatch]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Stack component={Paper} p={2.5} alignItems="center" spacing={2.25} height={100}>
      <Stack
        alignItems="center"
        justifyContent="center"
        height={56}
        width={56}
        bgcolor="neutral.light"
        borderRadius="50%"
      >
        <IconifyIcon icon="tabler:history" fontSize="h2.fontSize" color="primary.main" />
      </Stack>
      <div>
        <Typography variant="body2" color="text.disabled">
          Total Telemetry
        </Typography>
        <Typography mt={0.25} variant="h3">
          {formatNumber(totalTelemetry)}
        </Typography>
      </div>
    </Stack>
  );
};

export default TotalTelemetry;

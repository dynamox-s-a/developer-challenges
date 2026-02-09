import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store/store';
import { fetchActiveSensorsCount, updateStats } from 'store/slices/statsSlice';
import { socket } from 'utils/socket';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const ActiveSensors = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeSensorsCount } = useSelector((state: RootState) => state.stats);

  useEffect(() => {
    dispatch(fetchActiveSensorsCount());

    socket.on('active_sensors_count_update', (data) => {
      dispatch(updateStats(data));
    });

    return () => {
      socket.off('active_sensors_count_update');
    };
  }, [dispatch]);

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
        <IconifyIcon icon="tabler:broadcast" fontSize="h2.fontSize" color="primary.main" />
      </Stack>
      <div>
        <Typography variant="body2" color="text.disabled" noWrap>
          Active Sensors
        </Typography>
        <Typography mt={0.25} variant="h3">
          {activeSensorsCount}
        </Typography>
      </div>
    </Stack>
  );
};

export default ActiveSensors;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Stack, Box, Paper } from '@mui/material';
import { socket } from 'utils/socket';
import { AppDispatch, RootState } from 'store/store';
import { fetchMonitoringPoints, updateTelemetry } from 'store/slices/monitoringPointsSlice';
import PageTitle from 'components/common/PageTitle';
import MonitoringPointsTable from 'components/sections/monitoring-points/MonitoringPointsTable';
import IconifyIcon from 'components/base/IconifyIcon';
import AddMonitoringPointDialog from 'components/sections/monitoring-points/AddMonitoringPointDialog';
import { Button } from '@mui/material';

const MonitoringPoints = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, status } = useSelector((state: RootState) => state.monitoringPoints);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting' | 'failed'>('disconnected');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMonitoringPoints({ page, sortBy, sortOrder }));
  }, [dispatch, page, sortBy, sortOrder]);

  useEffect(() => {
    if (socket.connected) {
      setConnectionStatus('connected');
    }

    const onConnect = () => setConnectionStatus('connected');
    const onReconnectAttemp = () => setConnectionStatus('reconnecting');
    const onDisconnect = () => setConnectionStatus('disconnected');
    const onConnectError = () => setConnectionStatus('failed');
    const onTelemetryUpdate = (data: any) => {
      dispatch(updateTelemetry({
        sensorId: data.sensorId,
        telemetry: {
          accelerationValue: data.accelerationValue,
          velocityValue: data.velocityValue,
          temperatureValue: data.temperatureValue,
          timestamp: data.timestamp,
        }
      }));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('telemetry_update', onTelemetryUpdate);
    socket.io.on('reconnect_failed', onConnectError);
    socket.io.on('reconnect_attempt', onReconnectAttemp);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('telemetry_update', onTelemetryUpdate);
    };
  }, [dispatch]);

  const manualSocketRetry = () => {
    socket.connect();
    setConnectionStatus('reconnecting');
  }

  return (
    <>
      <PageTitle title="Monitoring Points" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Monitoring Points
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time telemetry from all industrial points
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Paper 
              elevation={0} 
              sx={{ 
                  px: 2, 
                  py: 1, 
                  bgcolor: 
                    connectionStatus === 'connected' ? 'success.lighter' :
                    connectionStatus === 'reconnecting' ? 'warning.lighter' :
                    connectionStatus === 'failed' ? 'error.lighter' : 'neutral.lighter',
                  color: 
                    connectionStatus === 'connected' ? 'success.dark' :
                    connectionStatus === 'reconnecting' ? 'warning.dark' :
                    connectionStatus === 'failed' ? 'error.dark' : 'neutral.dark',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 2,
                  transition: 'all 0.3s ease'
              }}
            >
              <IconifyIcon 
                icon={
                  connectionStatus === 'connected' ? 'ic:baseline-rss-feed' :
                  connectionStatus === 'reconnecting' ? 'tabler:loader-2' :
                  connectionStatus === 'failed' ? 'tabler:alert-circle' : 'tabler:wifi-off'
                } 
                sx={{ 
                  animation: connectionStatus === 'reconnecting' ? 'spin 2s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
              <Typography variant="subtitle2" fontWeight={600}>
                {connectionStatus === 'connected' ? 'Live Connection Active' :
                 connectionStatus === 'reconnecting' ? 'Reconnecting...' :
                 connectionStatus === 'failed' ? 'Connection Failed' : 'Disconnected'}
              </Typography>
            </Paper>

            {connectionStatus === 'failed' && (
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<IconifyIcon icon="tabler:refresh" />}
                onClick={() => manualSocketRetry()}
                sx={{ fontWeight: 700 }}
              >
                Retry
              </Button>
            )}

            <Button 
              variant="contained" 
              startIcon={<IconifyIcon icon="tabler:plus" />}
              onClick={() => setIsDialogOpen(true)}
              sx={{ fontWeight: 700 }}
            >
              Add Point
            </Button>
          </Stack>
        </Stack>

        <MonitoringPointsTable 
          monitoringPoints={items}
          loading={status === 'loading'}
          total={total}
          page={page}
          onPaginationChange={setPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
          }}
        />

        <AddMonitoringPointDialog 
          open={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
        />
      </Container>
    </>
  );
};

export default MonitoringPoints;

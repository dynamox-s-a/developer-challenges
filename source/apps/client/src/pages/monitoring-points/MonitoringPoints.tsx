import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Stack, Box, Paper } from '@mui/material';
import { io, Socket } from 'socket.io-client';
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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting' | 'failed'>('disconnected');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  const connectSocket = () => {
    const socket: Socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnectionDelay: 3000,
      reconnectionAttempts: 5,
    });

    setSocketInstance(socket);

    socket.on('connect', () => {
      console.log('Connected to Telemetry WebSocket');
      setConnectionStatus('connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from Telemetry WebSocket:', reason);
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
         setConnectionStatus('disconnected');
      } else {
         setConnectionStatus('reconnecting');
      }
    });

    socket.on('connect_error', (data) => {
      console.warn('Failed to connect', data);
      // Socket.io will automatically try to reconnect if reconnection is true (default)
    });

    socket.io.on('reconnect_attempt', (attempt) => {
       setConnectionStatus('reconnecting');
    });

    socket.io.on('reconnect_failed', () => {
       setConnectionStatus('failed');
    });

    socket.on('telemetry_update', (data) => {
      dispatch(updateTelemetry({
        sensorId: data.sensorId,
        telemetry: {
          accelerationValue: data.accelerationValue,
          velocityValue: data.velocityValue,
          temperatureValue: data.temperatureValue,
          timestamp: data.timestamp,
        }
      }));
    });

    return socket;
  };

  const manualSocketRetry = () => {
    socketInstance?.connect();
    setConnectionStatus('reconnecting');
  }

  useEffect(() => {
    dispatch(fetchMonitoringPoints({ page }));
  }, [dispatch, page]);

  useEffect(() => {
    const socket = connectSocket();

    return () => {
      socket.disconnect();
    };
  }, []); // Only once on mount

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

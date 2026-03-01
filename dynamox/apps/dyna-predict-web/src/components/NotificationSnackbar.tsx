import { Alert, Slide, Snackbar } from '@mui/material';
import type { SlideProps } from '@mui/material';
import { useNotifications } from '../utils/notifications';

function SlideDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

function NotificationSnackbar() {
  const { message, severity, open, close } = useNotifications();

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={(_, reason) => reason !== 'clickaway' && close()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ top: { xs: 16, sm: 32 } }}
      TransitionComponent={SlideDown}
    >
      <Alert severity={severity} onClose={close} variant="standard" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default NotificationSnackbar;

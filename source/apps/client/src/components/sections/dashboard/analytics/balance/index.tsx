import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const Balance = () => {
  return (
    <Stack
      component={Paper}
      alignItems="center"
      justifyContent="space-between"
      p={2.5}
      height={100}
      direction="row"
    >
      <div>
        <Typography variant="body2" color="text.disabled">
          Critical Alerts
        </Typography>
        <Typography mt={0.25} variant="h3" color="error.main">
          3
        </Typography>
      </div>
      <Stack
        alignItems="center"
        justifyContent="center"
        height={48}
        width={48}
        bgcolor="error.lighter"
        borderRadius="50%"
      >
        <IconifyIcon icon="ic:round-warning" fontSize="h3.fontSize" color="error.main" />
      </Stack>
    </Stack>
  );
};

export default Balance;

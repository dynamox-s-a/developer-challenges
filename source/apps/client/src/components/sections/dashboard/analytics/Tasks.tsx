import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const Tasks = () => {
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
        <IconifyIcon icon="ic:round-location-on" fontSize="h2.fontSize" color="primary.main" />
      </Stack>
      <div>
        <Typography variant="body2" color="text.disabled" noWrap>
          Monitoring Points
        </Typography>
        <Typography mt={0.25} variant="h3">
          154
        </Typography>
      </div>
    </Stack>
  );
};

export default Tasks;

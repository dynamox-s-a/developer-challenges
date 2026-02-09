import Image from 'components/base/Image';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CardSecurity = () => {
  return (
    <Stack spacing={3} component={Paper} direction="column" sx={{ height: 350 }}>
      <Image src={'/images/fingerprint.png'} height={85} width={75} />

      <Typography variant="h4">Control card security in-app with a tap</Typography>

      <Typography variant="caption" color="text.disabled" fontWeight={400}>
        Discover our cards benefits, with one tap.
      </Typography>

      <Button variant="contained" color="primary" fullWidth sx={{ mt: 'auto' }}>
        Cards
      </Button>
    </Stack>
  );
};

export default CardSecurity;

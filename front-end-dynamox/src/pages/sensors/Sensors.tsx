import { Box, Typography} from '@mui/material';

export default function Sensors() {


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 6,
        gap: 4,
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Sensors Management
      </Typography>


    </Box>
  );
}

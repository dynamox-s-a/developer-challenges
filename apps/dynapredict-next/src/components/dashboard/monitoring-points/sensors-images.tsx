import { Box, Stack } from '@mui/material';

export default function SensorsImages() {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: 'center',
        mt: 3,
      }}
    >
      <Box
        component="img"
        src="/new_assets/sensor-af.png"
        alt="AF Sensor"
        sx={{
          width: 75,
          height: 75,
          borderRadius: 2,
          objectFit: 'contain',
        }}
      />
      <Box
        component="img"
        src="/new_assets/sensor-hf.png"
        alt="HF Sensor"
        sx={{
          width: 75,
          height: 75,
          borderRadius: 2,
          objectFit: 'contain',
        }}
      />
      <Box
        component="img"
        src="/new_assets/sensor-tca.png"
        alt="TCA Sensor"
        sx={{
          width: 75,
          height: 75,
          borderRadius: 2,
          objectFit: 'contain',
        }}
      />
    </Stack>
  );
}

import { Box, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export function TelemetryPage() {
  const { machineId } = useParams()

  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Telemetry
      </Typography>
      <Typography color='text.secondary'>Machine ID: {machineId}</Typography>
    </Box>
  )
}

import { Box, Paper, Typography } from "@mui/material";

interface StatsCardsProps {
  countMachines: number,
  countSensors: number,
  countMP: number
}

export default function StatsCards({countMachines, countSensors, countMP}: StatsCardsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Paper 
        elevation={1}
        sx={{ 
          p: 2, 
          minWidth: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Máquinas
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {countMachines}
        </Typography>
      </Paper>
      
      <Paper 
        elevation={1}
        sx={{ 
          p: 2, 
          minWidth: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Sensores
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {countSensors}
        </Typography>
      </Paper>
      
      <Paper 
        elevation={1}
        sx={{ 
          p: 2, 
          minWidth: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Pontos de Monitoramento
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {countMP}
        </Typography>
      </Paper>
    </Box>
  )
}
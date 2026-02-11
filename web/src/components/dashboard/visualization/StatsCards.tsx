import { Box, Paper, Typography } from "@mui/material";

interface StatsCardsProps {
  countMachines: number,
  countSensors: number,
  countMP: number
}

const commonStyles = {
  borderColor: 'lightgray',
  border: 1,
  p: 2, 
  minWidth: 300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: 'secondary',
  backgroundColor: 'secondary.light'
};


export default function StatsCards({countMachines, countSensors, countMP}: StatsCardsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Paper 
        elevation={1}
        sx={commonStyles}
      >
        <Typography variant="subtitle2" color="white">
          Máquinas
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="white">
          {countMachines}
        </Typography>
      </Paper>
      
      <Paper 
        elevation={1}
        sx={commonStyles}
      >
        <Typography variant="subtitle2" color="white">
          Sensores
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="white">
          {countSensors}
        </Typography>
      </Paper>
      
      <Paper
        elevation={1}
        sx={commonStyles}
      >
        <Typography variant="subtitle2" color="white">
          Pontos de Monitoramento
        </Typography>
        <Typography variant="h5" fontWeight="bold" color="white">
          {countMP}
        </Typography>
      </Paper>
    </Box>
  )
}
'use client'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { AuroraText } from '@/components/ui/aurora-text'

interface StatsCardsProps {
  countSensors: number
  countMachines: number
  countMP: number
}

export default function StatsCards({
  countSensors,
  countMachines,
  countMP,
}: StatsCardsProps) {
  const stats = [
    { label: 'Sensores', value: countSensors },
    { label: 'Máquinas', value: countMachines },
    { label: 'Pontos de Monitoramento', value: countMP },
  ]

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {stats.map(stat => (
        <Paper
          key={stat.label}
          elevation={3}
          sx={{
            minWidth: 300,
            px: 3,
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2.5,
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          <Typography
            variant="h4"
            component="span"
            sx={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            <AuroraText>{stat.value}</AuroraText>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, mt: 0.5 }}
          >
            {stat.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}

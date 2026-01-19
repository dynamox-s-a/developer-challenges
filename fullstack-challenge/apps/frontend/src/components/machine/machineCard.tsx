'use client';

import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Machine } from '@/store/machine/machine.types';

interface MachineCardProps {
  machine: Machine;
  onSettings: (machine: Machine) => void;
}

export function MachineCard({ machine, onSettings }: MachineCardProps) {
  return (
    <Card sx={{ minHeight: 160, maxWidth: 750, position: 'relative' }}>
      <IconButton
        size="small"
        onClick={() => onSettings(machine)}
        sx={{ position: 'absolute', top: 8, left: 8 }}
      >
        <SettingsIcon />
      </IconButton>

      <CardContent sx={{ pt: 5 }}>
        <Typography variant="h5" align="center" fontWeight={600}>
          {machine.name}
        </Typography>

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Tipo
          </Typography>
          <Typography>{machine.type}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

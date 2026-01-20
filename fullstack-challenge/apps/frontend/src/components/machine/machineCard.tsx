'use client';

import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { Machine } from '@/store/machine/machine.types';
import AddIcon from '@mui/icons-material/Add';

interface MachineCardProps {
  machine: Machine;
  onSettings: (machine: Machine) => void;
  onDelete: (id: string) => void;
  onAddPoint: (machine: Machine) => void;
}

export function MachineCard({
  machine,
  onSettings,
  onDelete,
  onAddPoint,
}: MachineCardProps) {
  return (
    <Card
      sx={{
        minHeight: 200,
        position: 'relative',
        flex: '1 1 300px',
        minWidth: 480,
        maxWidth: 760,
      }}
    >
      <IconButton
        size="small"
        onClick={() => onSettings(machine)}
        sx={{ position: 'absolute', top: 8, left: 8 }}
      >
        <SettingsIcon />
      </IconButton>

      <IconButton
        size="small"
        color="error"
        onClick={() => onDelete(machine.id)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <DeleteIcon />
      </IconButton>

      <CardContent sx={{ pt: 5 }}>
        <Typography variant="h5" align="center" fontWeight={700}>
          {machine.name}
        </Typography>

        <Box mt={2}>
          <Typography variant="body1" color="text.secondary">
            Tipo
          </Typography>
          <Typography>{machine.type}</Typography>
        </Box>

        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body2" color="black">
            Pontos de monitoramento
          </Typography>

          <IconButton size="small" onClick={() => onAddPoint(machine)}>
            <AddIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

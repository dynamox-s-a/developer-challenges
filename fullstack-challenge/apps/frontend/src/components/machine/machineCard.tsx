/**
 * Card responsável por exibir as informações da máquina e seus pontos de monitoramento.
 *
 * Permite ações de configuração, exclusão da máquina e adição de pontos,
 * respeitando o limite máximo de pontos de monitoramento por máquina (2).
 */

'use client';

import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { Machine } from '@/store/machine/machine.types';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';

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
  const monitoringPoints = useSelector((state: RootState) =>
    state.monitoring.items.filter((mp) => mp.machineId === machine.id)
  );
  const canAddPoint = monitoringPoints.length < 2;

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
            Pontos de monitoramento:
          </Typography>

          <IconButton
            size="small"
            onClick={() => onAddPoint(machine)}
            disabled={!canAddPoint}
            sx={{
              color: canAddPoint ? 'inherit' : 'rgba(0,0,0,0.3)',
              pointerEvents: canAddPoint ? 'auto' : 'none',
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <Box mt={1}>
          {monitoringPoints.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              Nenhum ponto cadastrado
            </Typography>
          ) : (
            <List dense disablePadding>
              {monitoringPoints.map((mp) => (
                <ListItem key={mp.id} disableGutters>
                  <ListItemText primary={mp.name} />
                </ListItem>
              ))}
            </List>
          )}

          {!canAddPoint && (
            <Typography variant="caption" color="text.secondary">
              Limite de 2 pontos atingido
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

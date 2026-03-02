import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { MachinesListResponse } from '@dynamox/types';

type Machine = MachinesListResponse['machines'][number];

interface MachineMonitoringPointsModalProps {
  open: boolean;
  onClose: () => void;
  machine: Machine | undefined;
}

function MachineMonitoringPointsModal({
  open,
  onClose,
  machine,
}: MachineMonitoringPointsModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="span">
          {machine?.name} — Pontos de Monitoramento
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ponto</TableCell>
              <TableCell>Sensor</TableCell>
              <TableCell>Criado em</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machine?.monitoringPoints.map((point) => (
              <TableRow key={point.uuid}>
                <TableCell>{point.name}</TableCell>
                <TableCell>
                  {point.sensor?.model ? (
                    <Chip label={point.sensor.model} size="small" variant="outlined" />
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{new Date(point.createdAt).toLocaleDateString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

export default MachineMonitoringPointsModal;

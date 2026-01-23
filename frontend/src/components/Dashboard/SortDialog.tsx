import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';

interface SortDialogProps {
  open: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
  onClose: () => void;
  onSortByChange: (sortBy: string) => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
}

export const SortDialog = ({
  open,
  sortBy,
  order,
  onClose,
  onSortByChange,
  onOrderChange
}: SortDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Ordenar Pontos</DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="dense"
          label="Campo"
          fullWidth
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          sx={{ mt: 2 }}
        >
          <MenuItem value="machine_name">Máquina</MenuItem>
          <MenuItem value="machine_type">Tipo</MenuItem>
          <MenuItem value="point_name">Ponto</MenuItem>
          <MenuItem value="sensor_model">Sensor</MenuItem>
        </TextField>
        <TextField
          select
          margin="dense"
          label="Ordem"
          fullWidth
          value={order}
          onChange={(e) => onOrderChange(e.target.value as 'asc' | 'desc')}
          sx={{ mt: 2 }}
        >
          <MenuItem value="asc">Crescente</MenuItem>
          <MenuItem value="desc">Decrescente</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ bgcolor: '#692746', '&:hover': { bgcolor: '#521e36' } }}
        >
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

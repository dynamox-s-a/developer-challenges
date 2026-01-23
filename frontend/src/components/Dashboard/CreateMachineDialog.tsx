import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';

interface CreateMachineDialogProps {
  open: boolean;
  name: string;
  type: string;
  onClose: () => void;
  onNameChange: (name: string) => void;
  onTypeChange: (type: string) => void;
  onCreate: () => void;
}

export const CreateMachineDialog = ({
  open,
  name,
  type,
  onClose,
  onNameChange,
  onTypeChange,
  onCreate
}: CreateMachineDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nova Máquina</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome da Máquina"
          fullWidth
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          select
          margin="dense"
          label="Tipo"
          fullWidth
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          sx={{ mt: 2 }}
        >
          <MenuItem value="Pump">Pump</MenuItem>
          <MenuItem value="Fan">Fan</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={onCreate} 
          variant="contained"
          sx={{ bgcolor: '#692746', '&:hover': { bgcolor: '#521e36' } }}
          disabled={!name.trim()}
        >
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

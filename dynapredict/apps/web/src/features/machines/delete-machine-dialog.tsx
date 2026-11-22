import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { deleteMachine, type Machine } from './machines.slice';

type DeleteMachineDialogProps = {
  machine: Machine;
  onClose: () => void;
  // Chamado depois de excluir, com a mensagem de sucesso
  onDeleted: (message: string) => void;
};

export function DeleteMachineDialog({
  machine,
  onClose,
  onDeleted,
}: DeleteMachineDialogProps) {
  const dispatch = useAppDispatch();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleConfirm() {
    setDeleteError(null);
    setDeleting(true);

    // Mesmo esquema do formulário: o unwrap() lança o erro para o catch
    try {
      await dispatch(deleteMachine(machine.id)).unwrap();
      onDeleted('Máquina excluída');
    } catch (error) {
      setDeleteError(typeof error === 'string' ? error : 'Erro inesperado');
    } finally {
      setDeleting(false);
    }
  }

  return (
    // Como o formulário: a página só desenha o diálogo enquanto ele está aberto
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Excluir máquina?</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {deleteError && <Alert severity="error">{deleteError}</Alert>}

          <DialogContentText>
            A máquina <strong>{machine.name}</strong> será excluída. Essa ação
            não pode ser desfeita.
          </DialogContentText>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={deleting}
        >
          {deleting ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

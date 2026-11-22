import { useState, type ReactNode } from 'react';
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

type ConfirmDeleteDialogProps = {
  title: string;
  // O texto que diz o que vai ser excluído
  children: ReactNode;
  // A exclusão em si. Se der errado, lança a mensagem de erro
  // (o unwrap() de um thunk já faz isso)
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
};

// O "tem certeza?" antes de excluir qualquer coisa: o texto e a exclusão
// vêm de fora; o diálogo cuida do "Excluindo..." e de mostrar o erro
export function ConfirmDeleteDialog({
  title,
  children,
  onConfirm,
  onClose,
}: ConfirmDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleConfirm() {
    setDeleteError(null);
    setDeleting(true);

    try {
      await onConfirm();
    } catch (error) {
      setDeleteError(typeof error === 'string' ? error : 'Erro inesperado');
    } finally {
      setDeleting(false);
    }
  }

  return (
    // Quem usa só desenha o diálogo enquanto ele está aberto
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {deleteError && <Alert severity="error">{deleteError}</Alert>}

          <DialogContentText>{children}</DialogContentText>
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

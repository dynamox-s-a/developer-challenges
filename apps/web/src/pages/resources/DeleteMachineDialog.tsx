import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { deleteMachine, selectMachines } from '../../features/machines/machinesSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import type { MachineDto } from '../../api/client';

/**
 * Confirmação de exclusão.
 *
 * Excluir é destrutivo e cascateia: o diálogo diz exatamente o que desaparece e o que
 * apenas se desassocia, com os números da máquina em questão — não um "tem certeza?"
 * genérico, que é o mesmo que não avisar. A regra de cascata é a do backend; a tela
 * apenas a torna visível antes do clique.
 */
export function DeleteMachineDialog({
  machine,
  pointCount,
  sensorCount,
  onClose,
  onDeleted,
}: {
  machine: MachineDto | null;
  pointCount: number;
  sensorCount: number;
  onClose: () => void;
  onDeleted: () => void;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const { deleteStatus, deleteError } = useAppSelector(selectMachines);
  const removing = deleteStatus === 'loading';

  const confirm = async () => {
    if (!machine || removing) return;
    const result = await dispatch(deleteMachine(machine.id));
    if (deleteMachine.fulfilled.match(result)) onDeleted();
  };

  return (
    <Dialog open={machine !== null} onClose={removing ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Excluir “{machine?.name}”?</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">
          {pointCount > 0 ? (
            <>
              Esta máquina tem <strong>{pointCount} ponto(s) de monitoramento</strong>, que serão
              excluídos junto com ela.
              {sensorCount > 0 ? (
                <>
                  {' '}
                  Os <strong>{sensorCount} sensor(es)</strong> associados são desassociados, não
                  apagados — voltam a ficar disponíveis para outro ponto.
                </>
              ) : null}
            </>
          ) : (
            'Esta máquina não tem pontos de monitoramento.'
          )}{' '}
          A exclusão não pode ser desfeita.
        </DialogContentText>
        {deleteStatus === 'failed' && deleteError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {deleteError}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={removing}>
          Cancelar
        </Button>
        <Button
          onClick={confirm}
          color="error"
          variant="contained"
          disabled={removing}
          startIcon={removing ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {removing ? 'Excluindo…' : 'Excluir máquina'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

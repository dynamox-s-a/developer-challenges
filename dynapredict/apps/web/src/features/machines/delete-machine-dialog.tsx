import { useAppDispatch } from '../../app/hooks';
import { ConfirmDeleteDialog } from '../../components/confirm-delete-dialog';
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

  // O unwrap() lança a mensagem de erro, e o diálogo de confirmação a mostra
  async function handleConfirm() {
    await dispatch(deleteMachine(machine.id)).unwrap();
    onDeleted('Máquina excluída');
  }

  return (
    <ConfirmDeleteDialog
      title="Excluir máquina?"
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      A máquina <strong>{machine.name}</strong> será excluída, junto com todos
      os pontos de monitoramento, sensores e séries temporais dela. Essa ação
      não pode ser desfeita.
    </ConfirmDeleteDialog>
  );
}

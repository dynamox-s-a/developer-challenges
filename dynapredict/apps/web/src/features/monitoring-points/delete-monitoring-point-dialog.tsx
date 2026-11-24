import { useAppDispatch } from '../../app/hooks';
import { ConfirmDeleteDialog } from '../../components/confirm-delete-dialog';
import {
  deleteMonitoringPoint,
  type MonitoringPoint,
} from './monitoring-points.slice';

type DeleteMonitoringPointDialogProps = {
  point: MonitoringPoint;
  onClose: () => void;
  // Chamado depois de excluir, com a mensagem de sucesso
  onDeleted: (message: string) => void;
};

export function DeleteMonitoringPointDialog({
  point,
  onClose,
  onDeleted,
}: DeleteMonitoringPointDialogProps) {
  const dispatch = useAppDispatch();

  async function handleConfirm() {
    await dispatch(deleteMonitoringPoint(point.id)).unwrap();
    onDeleted('Ponto excluído');
  }

  return (
    <ConfirmDeleteDialog
      title="Excluir ponto?"
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      O ponto <strong>{point.name}</strong> da máquina{' '}
      <strong>{point.machine.name}</strong> será excluído, junto com{' '}
      {/* Avisa o que vai junto (no banco, é apagado em cascata) */}
      {point.sensor && (
        <>
          o sensor <strong>{point.sensor.serialNumber}</strong> e{' '}
        </>
      )}
      as séries temporais dele. Essa ação não pode ser desfeita.
    </ConfirmDeleteDialog>
  );
}

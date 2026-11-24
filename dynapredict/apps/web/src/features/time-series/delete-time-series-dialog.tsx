import { useAppDispatch } from '../../app/hooks';
import { ConfirmDeleteDialog } from '../../components/confirm-delete-dialog';
import { deleteTimeSeries, type TimeSeriesSummary } from './time-series.slice';

type DeleteTimeSeriesDialogProps = {
  series: TimeSeriesSummary;
  onClose: () => void;
  // Chamado depois de excluir, com a mensagem de sucesso
  onDeleted: (message: string) => void;
};

export function DeleteTimeSeriesDialog({
  series,
  onClose,
  onDeleted,
}: DeleteTimeSeriesDialogProps) {
  const dispatch = useAppDispatch();

  async function handleConfirm() {
    await dispatch(deleteTimeSeries(series.id)).unwrap();
    onDeleted('Série excluída');
  }

  // "a medição dela" ou "as 96 medições dela"
  const samples =
    series.sampleCount === 1
      ? 'a medição dela'
      : `as ${series.sampleCount.toLocaleString('pt-BR')} medições dela`;

  return (
    <ConfirmDeleteDialog
      title="Excluir série?"
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      A série <strong>{series.name}</strong> será excluída, junto com {samples}.
      Essa ação não pode ser desfeita.
    </ConfirmDeleteDialog>
  );
}

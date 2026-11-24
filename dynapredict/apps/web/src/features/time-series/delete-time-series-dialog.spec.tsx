import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { DeleteTimeSeriesDialog } from './delete-time-series-dialog';
import type { TimeSeriesSummary } from './time-series.slice';

const series: TimeSeriesSummary = {
  id: 'series-1',
  name: 'Velocidade RMS',
  unit: 'mm/s',
  sensorSerialNumber: 'DyL4.01.A0001',
  monitoringPointId: 'point-1',
  sampleCount: 10000,
  startedAt: '2026-11-22T10:00:00.000Z',
  endedAt: '2026-11-22T12:46:39.000Z',
  createdAt: '2026-11-22T13:00:00.000Z',
};

// Abre o diálogo perguntando sobre uma série.
// Devolve o "espião" que faz o papel da página
function renderDialog(target: TimeSeriesSummary = series) {
  const onDeleted = vi.fn();

  render(
    <Provider store={setupStore()}>
      <DeleteTimeSeriesDialog
        series={target}
        onClose={vi.fn()}
        onDeleted={onDeleted}
      />
    </Provider>,
  );

  return { onDeleted };
}

describe('DeleteTimeSeriesDialog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should say that the samples go too and delete only after the confirmation', async () => {
    vi.spyOn(api, 'delete').mockResolvedValue({ data: '' });
    const { onDeleted } = renderDialog();

    const dialog = screen.getByRole('dialog', { name: 'Excluir série?' });
    expect(dialog.textContent).toContain(
      'A série Velocidade RMS será excluída, junto com as 10.000 medições dela.',
    );
    expect(api.delete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    await waitFor(() =>
      expect(onDeleted).toHaveBeenCalledWith('Série excluída'),
    );
    expect(api.delete).toHaveBeenCalledWith('/time-series/series-1');
  });

  it('should talk about a single sample in the singular', () => {
    renderDialog({ ...series, sampleCount: 1 });

    const dialog = screen.getByRole('dialog', { name: 'Excluir série?' });
    expect(dialog.textContent).toContain('junto com a medição dela.');
  });

  it('should show the api error and stay open', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 404,
      data: {
        error: { code: 'NOT_FOUND', message: 'Série temporal não encontrada' },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'delete').mockRejectedValue(error);
    const { onDeleted } = renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(
      await screen.findByText('Série temporal não encontrada'),
    ).toBeTruthy();
    expect(onDeleted).not.toHaveBeenCalled();
  });
});

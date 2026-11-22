import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { DeleteMonitoringPointDialog } from './delete-monitoring-point-dialog';
import type { MonitoringPoint } from './monitoring-points.slice';

const point: MonitoringPoint = {
  id: 'point-1',
  name: 'Mancal LA',
  machine: { id: 'machine-1', name: 'Bomba 01', type: 'Pump' },
  sensor: { id: 'sensor-1', model: 'HF+', serialNumber: 'DyL4.01.A0001' },
};

// Abre o diálogo perguntando sobre um ponto.
// Devolve o "espião" que faz o papel da página
function renderDialog(target: MonitoringPoint = point) {
  const onDeleted = vi.fn();

  render(
    <Provider store={setupStore()}>
      <DeleteMonitoringPointDialog
        point={target}
        onClose={vi.fn()}
        onDeleted={onDeleted}
      />
    </Provider>,
  );

  return { onDeleted };
}

describe('DeleteMonitoringPointDialog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should say that the sensor goes too and delete only after the confirmation', async () => {
    vi.spyOn(api, 'delete').mockResolvedValue({ data: '' });
    const { onDeleted } = renderDialog();

    const dialog = screen.getByRole('dialog', { name: 'Excluir ponto?' });
    expect(dialog.textContent).toContain(
      'O ponto Mancal LA da máquina Bomba 01 será excluído, junto com o sensor DyL4.01.A0001.',
    );
    expect(api.delete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    await waitFor(() =>
      expect(onDeleted).toHaveBeenCalledWith('Ponto excluído'),
    );
    expect(api.delete).toHaveBeenCalledWith('/monitoring-points/point-1');
  });

  it('should not talk about a sensor when the point has none', () => {
    renderDialog({ ...point, sensor: null });

    const dialog = screen.getByRole('dialog', { name: 'Excluir ponto?' });
    expect(dialog.textContent).toContain(
      'O ponto Mancal LA da máquina Bomba 01 será excluído. Essa ação',
    );
  });

  it('should show the api error and stay open', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 404,
      data: {
        error: {
          code: 'NOT_FOUND',
          message: 'Ponto de monitoramento não encontrado',
        },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'delete').mockRejectedValue(error);
    const { onDeleted } = renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(
      await screen.findByText('Ponto de monitoramento não encontrado'),
    ).toBeTruthy();
    expect(onDeleted).not.toHaveBeenCalled();
  });
});

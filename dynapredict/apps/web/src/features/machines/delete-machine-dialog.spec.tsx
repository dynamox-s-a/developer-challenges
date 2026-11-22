import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { DeleteMachineDialog } from './delete-machine-dialog';
import type { Machine } from './machines.slice';

const machine: Machine = {
  id: 'machine-1',
  name: 'Bomba 01',
  type: 'Pump',
  createdAt: '2026-11-21T12:00:00.000Z',
  updatedAt: '2026-11-21T12:00:00.000Z',
};

// Abre o diálogo perguntando sobre a "Bomba 01".
// Devolve os "espiões" que fazem o papel da página
function renderDialog() {
  const onClose = vi.fn();
  const onDeleted = vi.fn();

  render(
    <Provider store={setupStore()}>
      <DeleteMachineDialog
        machine={machine}
        onClose={onClose}
        onDeleted={onDeleted}
      />
    </Provider>,
  );

  return { onClose, onDeleted };
}

describe('DeleteMachineDialog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should ask first and delete only after the confirmation', async () => {
    vi.spyOn(api, 'delete').mockResolvedValue({ data: '' });
    const { onDeleted } = renderDialog();

    expect(
      screen.getByRole('dialog', { name: 'Excluir máquina?' }),
    ).toBeTruthy();
    expect(screen.getByText('Bomba 01')).toBeTruthy();
    expect(api.delete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    await waitFor(() =>
      expect(onDeleted).toHaveBeenCalledWith('Máquina excluída'),
    );
    expect(api.delete).toHaveBeenCalledWith('/machines/machine-1');
  });

  it('should warn that the points and sensors of the machine go too', () => {
    renderDialog();

    // No banco, excluir a máquina apaga os pontos e os sensores em cascata
    const dialog = screen.getByRole('dialog', { name: 'Excluir máquina?' });
    expect(dialog.textContent).toContain(
      'A máquina Bomba 01 será excluída, junto com todos os pontos de monitoramento e sensores dela.',
    );
  });

  it('should show the api error and stay open when deleting fails', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 404,
      data: {
        error: { code: 'NOT_FOUND', message: 'Máquina não encontrada' },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'delete').mockRejectedValue(error);
    const { onDeleted } = renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(await screen.findByText('Máquina não encontrada')).toBeTruthy();
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it('should close without deleting when cancelled', () => {
    const remove = vi.spyOn(api, 'delete');
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onClose).toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
});

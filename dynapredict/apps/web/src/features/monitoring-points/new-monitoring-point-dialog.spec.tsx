import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import type { Machine } from '../machines/machines.slice';
import { NewMonitoringPointDialog } from './new-monitoring-point-dialog';

// Fora de ordem alfabética de propósito: o diálogo é que ordena
const machines: Machine[] = [
  {
    id: 'machine-2',
    name: 'Ventilador 01',
    type: 'Fan',
    createdAt: '2026-11-22T12:00:00.000Z',
    updatedAt: '2026-11-22T12:00:00.000Z',
  },
  {
    id: 'machine-1',
    name: 'Bomba 01',
    type: 'Pump',
    createdAt: '2026-11-21T12:00:00.000Z',
    updatedAt: '2026-11-21T12:00:00.000Z',
  },
];

// Abre o diálogo com a lista de máquinas que a API "devolve" e espera essa
// lista chegar. Devolve os "espiões" que fazem o papel da página
async function renderDialog(machineList: Machine[] = machines) {
  vi.spyOn(api, 'get').mockResolvedValue({ data: machineList });
  const store = setupStore();
  const onClose = vi.fn();
  const onCreated = vi.fn();

  render(
    <Provider store={store}>
      <NewMonitoringPointDialog onClose={onClose} onCreated={onCreated} />
    </Provider>,
  );
  await waitFor(() =>
    expect(store.getState().machines.status).toBe('succeeded'),
  );

  return { onClose, onCreated };
}

// O "select" do MUI abre com mouseDown e mostra as opções numa lista
function openMachineOptions() {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Máquina' }));
}

describe('NewMonitoringPointDialog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should show the field errors and not call the api when the form is invalid', async () => {
    const post = vi.spyOn(api, 'post');
    await renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('Escolha a máquina')).toBeTruthy();
    expect(screen.getByText('Informe o nome do ponto')).toBeTruthy();
    expect(post).not.toHaveBeenCalled();
  });

  it('should list the machines in alphabetical order and create the point in the chosen one', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: { id: 'point-1', name: 'Motor', machineId: 'machine-2' },
    });
    const { onCreated } = await renderDialog();

    // Buscou as máquinas, porque ninguém tinha buscado ainda
    expect(api.get).toHaveBeenCalledWith('/machines');
    openMachineOptions();
    const options = screen.getAllByRole('option');
    expect(options[0]).toBe(
      screen.getByRole('option', { name: 'Bomba 01 (Pump)' }),
    );
    expect(options[1]).toBe(
      screen.getByRole('option', { name: 'Ventilador 01 (Fan)' }),
    );

    fireEvent.click(options[1]);
    fireEvent.change(screen.getByLabelText('Nome do ponto'), {
      target: { value: '  Motor  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith('Ponto criado'));
    // A máquina vai na URL; o nome, já sem os espaços, vai no corpo
    expect(api.post).toHaveBeenCalledWith(
      '/machines/machine-2/monitoring-points',
      { name: 'Motor' },
    );
  });

  it('should show the api error and stay open', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 404,
      data: { error: { code: 'NOT_FOUND', message: 'Máquina não encontrada' } },
    } as AxiosResponse;
    vi.spyOn(api, 'post').mockRejectedValue(error);
    const { onCreated } = await renderDialog();

    openMachineOptions();
    fireEvent.click(screen.getByRole('option', { name: 'Bomba 01 (Pump)' }));
    fireEvent.change(screen.getByLabelText('Nome do ponto'), {
      target: { value: 'Mancal LA' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Máquina não encontrada')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeTruthy();
    expect(onCreated).not.toHaveBeenCalled();
  });

  it('should ask for a machine first when there are none', async () => {
    await renderDialog([]);

    expect(screen.getByText('Cadastre uma máquina primeiro')).toBeTruthy();
  });
});

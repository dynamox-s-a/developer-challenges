import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { MachineFormDialog } from './machine-form-dialog';
import type { Machine } from './machines.slice';

const machine: Machine = {
  id: 'machine-1',
  name: 'Bomba 01',
  type: 'Pump',
  createdAt: '2026-11-21T12:00:00.000Z',
  updatedAt: '2026-11-21T12:00:00.000Z',
};

// Abre o diálogo para uma máquina nova (null) ou para editar uma.
// Devolve os "espiões" que fazem o papel da página
function renderDialog(editing: Machine | null = null) {
  const onClose = vi.fn();
  const onSaved = vi.fn();

  render(
    <Provider store={setupStore()}>
      <MachineFormDialog
        machine={editing}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Provider>,
  );

  return { onClose, onSaved };
}

// O "select" do MUI não é um <select> de verdade: abre com mouseDown
// e mostra as opções numa lista
function chooseType(type: string) {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Tipo' }));
  fireEvent.click(screen.getByRole('option', { name: type }));
}

describe('MachineFormDialog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should show the field errors and not call the api when the form is invalid', () => {
    const post = vi.spyOn(api, 'post');
    renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByText('Informe o nome da máquina')).toBeTruthy();
    expect(screen.getByText('Tipo de máquina inválido')).toBeTruthy();
    expect(post).not.toHaveBeenCalled();
  });

  it('should create a machine with the typed values', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({ data: machine });
    const { onSaved } = renderDialog();

    expect(screen.getByRole('dialog', { name: 'Nova máquina' })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: '  Bomba 01  ' },
    });
    chooseType('Pump');
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith('Máquina criada'));
    // O schema tira os espaços antes de enviar
    expect(api.post).toHaveBeenCalledWith('/machines', {
      name: 'Bomba 01',
      type: 'Pump',
    });
  });

  it('should start filled with the machine being edited and save the changes', async () => {
    vi.spyOn(api, 'put').mockResolvedValue({
      data: { ...machine, name: 'Bomba 01 revisada', type: 'Fan' },
    });
    const { onSaved } = renderDialog(machine);

    expect(screen.getByRole('dialog', { name: 'Editar máquina' })).toBeTruthy();
    expect(screen.getByDisplayValue('Bomba 01')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Bomba 01 revisada' },
    });
    chooseType('Fan');
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() =>
      expect(onSaved).toHaveBeenCalledWith('Máquina atualizada'),
    );
    expect(api.put).toHaveBeenCalledWith('/machines/machine-1', {
      name: 'Bomba 01 revisada',
      type: 'Fan',
    });
  });

  it('should show the api error and stay open when saving fails', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_RESPONSE');
    error.response = {
      status: 500,
      data: {
        error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'post').mockRejectedValue(error);
    const { onSaved } = renderDialog();

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Bomba 01' },
    });
    chooseType('Pump');
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Erro interno do servidor')).toBeTruthy();
    expect(onSaved).not.toHaveBeenCalled();
    // O botão volta a funcionar para tentar de novo
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeTruthy();
  });

  it('should close without saving when cancelled', () => {
    const post = vi.spyOn(api, 'post');
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onClose).toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });
});

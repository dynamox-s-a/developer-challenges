import { fireEvent, render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import { MachinesPage } from './machines-page';
import type { Machine } from './machines.slice';

const machines: Machine[] = [
  {
    id: 'machine-1',
    name: 'Bomba 01',
    type: 'Pump',
    createdAt: '2026-11-21T12:00:00.000Z',
    updatedAt: '2026-11-21T12:00:00.000Z',
  },
  {
    id: 'machine-2',
    name: 'Ventilador 01',
    type: 'Fan',
    createdAt: '2026-11-20T12:00:00.000Z',
    updatedAt: '2026-11-20T12:00:00.000Z',
  },
];

function renderPage() {
  render(
    <Provider store={setupStore()}>
      <MachinesPage />
    </Provider>,
  );
}

describe('MachinesPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should show a row for each machine', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: machines });
    renderPage();

    // Enquanto a API não responde, aparece o "carregando"
    expect(screen.getByLabelText('Carregando máquinas')).toBeTruthy();

    expect(await screen.findByText('Bomba 01')).toBeTruthy();
    expect(screen.getByText('Ventilador 01')).toBeTruthy();
    expect(screen.getByText('Fan')).toBeTruthy();
    // 1 linha de cabeçalho + 2 máquinas
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('should explain when there are no machines yet', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: [] });
    renderPage();

    expect(
      await screen.findByText('Nenhuma máquina cadastrada ainda.'),
    ).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('should show the error and try again when asked', async () => {
    vi.spyOn(api, 'get')
      .mockRejectedValueOnce(new Error('falhou'))
      .mockResolvedValueOnce({ data: machines });
    renderPage();

    expect(await screen.findByText('Erro inesperado')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));

    expect(await screen.findByText('Bomba 01')).toBeTruthy();
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('should add a new machine to the top of the list', async () => {
    const newMachine: Machine = {
      id: 'machine-3',
      name: 'Bomba 02',
      type: 'Pump',
      createdAt: '2026-11-22T12:00:00.000Z',
      updatedAt: '2026-11-22T12:00:00.000Z',
    };
    vi.spyOn(api, 'get').mockResolvedValue({ data: machines });
    vi.spyOn(api, 'post').mockResolvedValue({ data: newMachine });
    renderPage();
    await screen.findByText('Bomba 01');

    fireEvent.click(screen.getByRole('button', { name: 'Nova máquina' }));
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Bomba 02' },
    });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Tipo' }));
    fireEvent.click(screen.getByRole('option', { name: 'Pump' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Máquina criada')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
    // rows[0] é o cabeçalho: a nova máquina é a primeira linha de dados
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('Bomba 02')).toBeTruthy();
  });

  it('should open the machine in the form and show the changes', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: machines });
    vi.spyOn(api, 'put').mockResolvedValue({
      data: { ...machines[0], name: 'Bomba 01 revisada' },
    });
    renderPage();

    fireEvent.click(
      await screen.findByRole('button', { name: 'Editar Bomba 01' }),
    );
    expect(screen.getByDisplayValue('Bomba 01')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Bomba 01 revisada' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Máquina atualizada')).toBeTruthy();
    expect(screen.getByText('Bomba 01 revisada')).toBeTruthy();
    expect(screen.queryByText('Bomba 01')).toBeNull();
  });
});

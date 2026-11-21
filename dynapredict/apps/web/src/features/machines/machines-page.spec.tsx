import { fireEvent, render, screen } from '@testing-library/react';
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
});

import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { DEFAULT_MACHINES_QUERY } from '../features/machines/machinesSlice';
import * as machinesApi from '../services/machinesApi';
import { aMachine, aPage } from '../testing/fixtures';
import { httpError, renderWithProviders } from '../testing/renderWithProviders';
import { MachinesListPage } from './MachinesListPage';

vi.mock('../services/machinesApi');

const pump = aMachine({ id: 'm-1', name: 'Pump 01', monitoringPointsCount: 3 });
const fan = aMachine({
  id: 'm-2',
  name: 'Fan 02',
  type: 'Fan',
  monitoringPointsCount: 1,
});

function renderPage() {
  return renderWithProviders(<MachinesListPage />, { route: '/machines' });
}

async function findRow(name: string) {
  const link = await screen.findByRole('link', { name });
  return link.closest('tr') as HTMLElement;
}

describe('MachinesListPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(machinesApi.listMachines).mockResolvedValue(
      aPage([pump, fan], { total: 2 }),
    );
  });

  it('lists the machines of the first page', async () => {
    renderPage();
    const row = await findRow('Pump 01');
    expect(within(row).getByText('Pump')).toBeTruthy();
    expect(within(row).getByText('3')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Fan 02' }).getAttribute('href'),
    ).toBe('/machines/m-2');
    expect(machinesApi.listMachines).toHaveBeenCalledWith(
      DEFAULT_MACHINES_QUERY,
    );
  });

  it('asks the server for the sorted page', async () => {
    renderPage();
    await findRow('Pump 01');
    fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    await waitFor(() =>
      expect(machinesApi.listMachines).toHaveBeenLastCalledWith({
        ...DEFAULT_MACHINES_QUERY,
        sortBy: 'name',
        sortDir: 'asc',
      }),
    );
  });

  it('shows a load error with a retry', async () => {
    vi.mocked(machinesApi.listMachines).mockRejectedValueOnce(
      httpError(500, { error: { code: 'INTERNAL', message: 'Server down' } }),
    );
    renderPage();
    expect((await screen.findByRole('alert')).textContent).toContain(
      'Server down',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await findRow('Pump 01')).toBeTruthy();
  });

  describe('create', () => {
    it('validates the name before calling the API', async () => {
      renderPage();
      await findRow('Pump 01');
      fireEvent.click(screen.getByRole('button', { name: 'New machine' }));
      const dialog = await screen.findByRole('dialog', { name: 'New machine' });

      fireEvent.change(within(dialog).getByLabelText(/name/i), {
        target: { value: '   ' },
      });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Create' }));

      expect(await within(dialog).findByText('Name is required')).toBeTruthy();
      expect(machinesApi.createMachine).not.toHaveBeenCalled();
    });

    it('warns about the sensor rule for pumps only', async () => {
      renderPage();
      await findRow('Pump 01');
      fireEvent.click(screen.getByRole('button', { name: 'New machine' }));
      const dialog = await screen.findByRole('dialog', { name: 'New machine' });
      const type = within(dialog).getByLabelText(/type/i);

      expect(
        within(dialog).getByText(
          "Pump machines can't have TcAg or TcAs sensors.",
        ),
      ).toBeTruthy();
      fireEvent.change(type, { target: { value: 'Fan' } });
      await waitFor(() =>
        expect(within(dialog).queryByText(/can't have/)).toBeNull(),
      );
    });

    it('creates a machine, reloads the list and confirms', async () => {
      const created = aMachine({ id: 'm-3', name: 'Fan 03', type: 'Fan' });
      vi.mocked(machinesApi.createMachine).mockResolvedValue(created);
      renderPage();
      await findRow('Pump 01');
      vi.mocked(machinesApi.listMachines).mockResolvedValue(
        aPage([created, pump, fan], { total: 3 }),
      );

      fireEvent.click(screen.getByRole('button', { name: 'New machine' }));
      const dialog = await screen.findByRole('dialog', { name: 'New machine' });
      fireEvent.change(within(dialog).getByLabelText(/name/i), {
        target: { value: ' Fan 03 ' },
      });
      fireEvent.change(within(dialog).getByLabelText(/type/i), {
        target: { value: 'Fan' },
      });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Create' }));

      expect((await screen.findByRole('status')).textContent).toContain(
        'Machine "Fan 03" created.',
      );
      expect(machinesApi.createMachine).toHaveBeenCalledWith({
        name: 'Fan 03',
        type: 'Fan',
      });
      expect(await findRow('Fan 03')).toBeTruthy();
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
  });

  describe('edit', () => {
    it('opens with the machine values', async () => {
      renderPage();
      fireEvent.click(
        await screen.findByRole('button', { name: 'Edit Fan 02' }),
      );
      const dialog = await screen.findByRole('dialog', {
        name: 'Edit machine',
      });
      expect(
        (within(dialog).getByLabelText(/name/i) as HTMLInputElement).value,
      ).toBe('Fan 02');
      expect(
        (within(dialog).getByLabelText(/type/i) as HTMLSelectElement).value,
      ).toBe('Fan');
    });

    it('keeps the dialog open and explains a rejected type change', async () => {
      vi.mocked(machinesApi.updateMachine).mockRejectedValue(
        httpError(422, {
          error: {
            code: 'BUSINESS_RULE_VIOLATION',
            message: 'A Pump machine cannot have TcAg or TcAs sensors',
          },
        }),
      );
      renderPage();
      fireEvent.click(
        await screen.findByRole('button', { name: 'Edit Fan 02' }),
      );
      const dialog = await screen.findByRole('dialog', {
        name: 'Edit machine',
      });
      fireEvent.change(within(dialog).getByLabelText(/type/i), {
        target: { value: 'Pump' },
      });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

      expect((await within(dialog).findByRole('alert')).textContent).toContain(
        'A Pump machine cannot have TcAg or TcAs sensors',
      );
      expect(machinesApi.updateMachine).toHaveBeenCalledWith('m-2', {
        name: 'Fan 02',
        type: 'Pump',
      });
    });
  });

  describe('delete', () => {
    it('states what the cascade erases before deleting', async () => {
      vi.mocked(machinesApi.deleteMachine).mockResolvedValue();
      renderPage();
      fireEvent.click(
        await screen.findByRole('button', { name: 'Delete Pump 01' }),
      );
      const dialog = await screen.findByRole('dialog', {
        name: 'Delete machine?',
      });
      expect(dialog.textContent).toContain(
        'Pump 01 will be permanently deleted, together with its 3 monitoring points, their sensors and all of their readings',
      );
      expect(machinesApi.deleteMachine).not.toHaveBeenCalled();

      fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));

      expect((await screen.findByRole('status')).textContent).toContain(
        'Machine "Pump 01" deleted.',
      );
      expect(machinesApi.deleteMachine).toHaveBeenCalledWith('m-1');
    });

    it('says so when the machine has no points to cascade to', async () => {
      vi.mocked(machinesApi.listMachines).mockResolvedValue(
        aPage([aMachine({ name: 'Empty', monitoringPointsCount: 0 })]),
      );
      renderPage();
      fireEvent.click(
        await screen.findByRole('button', { name: 'Delete Empty' }),
      );
      const dialog = await screen.findByRole('dialog', {
        name: 'Delete machine?',
      });
      expect(dialog.textContent).toContain(
        'Empty will be permanently deleted. It has no monitoring points.',
      );
    });

    it('does nothing when cancelled', async () => {
      renderPage();
      fireEvent.click(
        await screen.findByRole('button', { name: 'Delete Fan 02' }),
      );
      const dialog = await screen.findByRole('dialog', {
        name: 'Delete machine?',
      });
      expect(dialog.textContent).toContain('its 1 monitoring point,');
      fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(machinesApi.deleteMachine).not.toHaveBeenCalled();
    });
  });
});

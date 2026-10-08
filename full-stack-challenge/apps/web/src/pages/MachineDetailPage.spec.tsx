import type { MachineDetailDto } from '@dynapredict/shared-types';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { sensorModelOptions } from '../features/machines/SensorFormDialog';
import * as machinesApi from '../services/machinesApi';
import * as monitoringPointsApi from '../services/monitoringPointsApi';
import * as readingsApi from '../services/readingsApi';
import * as sensorsApi from '../services/sensorsApi';
import { aMachineDetail, aSensor } from '../testing/fixtures';
import { httpError, renderWithProviders } from '../testing/renderWithProviders';
import { MachineDetailPage } from './MachineDetailPage';

vi.mock('../services/machinesApi');
vi.mock('../services/monitoringPointsApi');
vi.mock('../services/sensorsApi');
vi.mock('../services/readingsApi');

const timestamps = {
  createdAt: '2026-10-01T12:00:00.000Z',
  updatedAt: '2026-10-01T12:00:00.000Z',
};
const withSensor = {
  id: 'p-1',
  name: 'Bearing DE',
  sensor: aSensor({ id: 's-1', serialNumber: 'HFP-0001', model: 'HF+' }),
  ...timestamps,
};
const withoutSensor = {
  id: 'p-2',
  name: 'Casing',
  sensor: null,
  ...timestamps,
};

const pump = aMachineDetail({
  id: 'm-1',
  name: 'Pump 01',
  type: 'Pump',
  monitoringPoints: [withSensor, withoutSensor],
});

function renderPage(machine: MachineDetailDto = pump) {
  vi.mocked(machinesApi.getMachine).mockResolvedValue(machine);
  return renderWithProviders(
    <Routes>
      <Route path="/machines/:id" element={<MachineDetailPage />} />
    </Routes>,
    { route: `/machines/${machine.id}` },
  );
}

async function card(pointName: string) {
  const heading = await screen.findByRole('heading', {
    level: 3,
    name: pointName,
  });
  return heading.closest('article') as HTMLElement;
}

async function openDialog(buttonName: string, dialogName: string) {
  fireEvent.click(await screen.findByRole('button', { name: buttonName }));
  return screen.findByRole('dialog', { name: dialogName });
}

describe('MachineDetailPage', () => {
  beforeEach(() => vi.resetAllMocks());

  it('shows the machine and each point with its sensor', async () => {
    renderPage();
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Pump 01' }),
    ).toBeTruthy();
    expect(
      screen.getByText(/2 points · Pump machines can't have TcAg or TcAs/),
    ).toBeTruthy();

    const sensorCard = await card('Bearing DE');
    expect(within(sensorCard).getByText('HF+')).toBeTruthy();
    expect(within(sensorCard).getByText('HFP-0001')).toBeTruthy();
    expect(
      within(sensorCard)
        .getByRole('link', { name: 'Series of Bearing DE' })
        .getAttribute('href'),
    ).toBe('/monitoring-points/p-1/series');

    const emptyCard = await card('Casing');
    expect(within(emptyCard).getByText('No sensor attached')).toBeTruthy();
    expect(
      within(emptyCard).getByRole('button', { name: 'Add sensor to Casing' }),
    ).toBeTruthy();
  });

  it('says when the machine does not exist', async () => {
    vi.mocked(machinesApi.getMachine).mockRejectedValue(
      httpError(404, { error: { code: 'NOT_FOUND', message: 'Not found' } }),
    );
    renderWithProviders(
      <Routes>
        <Route path="/machines/:id" element={<MachineDetailPage />} />
      </Routes>,
      { route: '/machines/missing' },
    );
    expect(
      await screen.findByRole('heading', { name: 'Machine not found' }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Machines' })).toBeTruthy();
  });

  it('invites to add the first point', async () => {
    renderPage(aMachineDetail({ monitoringPoints: [] }));
    expect(
      await screen.findByText(/This machine has no monitoring points yet/),
    ).toBeTruthy();
  });

  describe('points', () => {
    it('adds a point and shows it after the reload', async () => {
      renderPage();
      await card('Bearing DE');
      vi.mocked(machinesApi.getMachine).mockResolvedValue({
        ...pump,
        monitoringPoints: [
          ...pump.monitoringPoints,
          { id: 'p-3', name: 'Motor DE', sensor: null, ...timestamps },
        ],
      });

      const dialog = await openDialog('Add point', 'New monitoring point');
      fireEvent.click(within(dialog).getByRole('button', { name: 'Create' }));
      expect(await within(dialog).findByText('Name is required')).toBeTruthy();

      fireEvent.change(within(dialog).getByLabelText(/name/i), {
        target: { value: ' Motor DE ' },
      });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Create' }));

      expect(await card('Motor DE')).toBeTruthy();
      expect(monitoringPointsApi.createMonitoringPoint).toHaveBeenCalledWith(
        'm-1',
        { name: 'Motor DE' },
      );
      expect((await screen.findByRole('status')).textContent).toContain(
        'Monitoring point "Motor DE" created.',
      );
    });

    it('renames a point from its current name', async () => {
      renderPage();
      const dialog = await openDialog(
        'Rename Casing',
        'Rename monitoring point',
      );
      const name = within(dialog).getByLabelText(/name/i) as HTMLInputElement;
      expect(name.value).toBe('Casing');

      fireEvent.change(name, { target: { value: 'Casing top' } });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

      await waitFor(() =>
        expect(monitoringPointsApi.renameMonitoringPoint).toHaveBeenCalledWith(
          'p-2',
          { name: 'Casing top' },
        ),
      );
    });

    it('deletes a point after stating the sensor and readings it erases', async () => {
      vi.mocked(readingsApi.countReadings).mockResolvedValue(288);
      renderPage();
      const dialog = await openDialog(
        'Delete Bearing DE',
        'Delete monitoring point?',
      );

      await waitFor(() =>
        expect(dialog.textContent).toContain(
          'Bearing DE will be permanently deleted, together with its sensor HFP-0001 and its 288 readings.',
        ),
      );
      expect(readingsApi.countReadings).toHaveBeenCalledWith('s-1');

      fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));
      await waitFor(() =>
        expect(monitoringPointsApi.deleteMonitoringPoint).toHaveBeenCalledWith(
          'p-1',
        ),
      );
      expect((await screen.findByRole('status')).textContent).toContain(
        'Monitoring point "Bearing DE" deleted.',
      );
    });

    it('still warns about readings if counting them fails', async () => {
      vi.mocked(readingsApi.countReadings).mockRejectedValue(new Error('down'));
      renderPage();
      const dialog = await openDialog(
        'Delete Bearing DE',
        'Delete monitoring point?',
      );
      await waitFor(() =>
        expect(dialog.textContent).toContain(
          'with its sensor HFP-0001 and all of its readings.',
        ),
      );
    });

    it('says when the sensor has no readings', async () => {
      vi.mocked(readingsApi.countReadings).mockResolvedValue(0);
      renderPage();
      const dialog = await openDialog(
        'Remove sensor from Bearing DE',
        'Remove sensor?',
      );
      await waitFor(() =>
        expect(dialog.textContent).toContain(
          'will be removed from Bearing DE. It has no readings stored.',
        ),
      );
    });

    it('keeps the dialog open with the error when deleting fails', async () => {
      vi.mocked(monitoringPointsApi.deleteMonitoringPoint).mockRejectedValue(
        httpError(500, { error: { code: 'INTERNAL', message: 'Try again' } }),
      );
      renderPage();
      const dialog = await openDialog(
        'Delete Casing',
        'Delete monitoring point?',
      );
      expect(dialog.textContent).toContain(
        'Casing will be permanently deleted. This',
      );
      fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));
      expect((await within(dialog).findByRole('alert')).textContent).toContain(
        'Try again',
      );
    });
  });

  describe('sensors', () => {
    it('disables the models a pump cannot take', async () => {
      renderPage();
      const dialog = await openDialog(
        'Add sensor to Casing',
        'Add sensor to Casing',
      );
      const model = within(dialog).getByLabelText(
        /model/i,
      ) as HTMLSelectElement;
      const options = Array.from(model.options).map((o) => [
        o.textContent,
        o.disabled,
      ]);
      expect(options).toEqual([
        ['TcAg (not allowed on Pump)', true],
        ['TcAs (not allowed on Pump)', true],
        ['HF+', false],
      ]);
      expect(model.value).toBe('HF+');
    });

    it('validates the serial number format', async () => {
      renderPage();
      const dialog = await openDialog(
        'Add sensor to Casing',
        'Add sensor to Casing',
      );
      fireEvent.change(within(dialog).getByLabelText(/serial number/i), {
        target: { value: 'HFP 01!' },
      });
      fireEvent.click(
        within(dialog).getByRole('button', { name: 'Add sensor' }),
      );
      expect(
        await within(dialog).findByText(
          'Use only letters, digits, dot, dash and underscore',
        ),
      ).toBeTruthy();
      expect(sensorsApi.attachSensor).not.toHaveBeenCalled();
    });

    it('attaches a sensor', async () => {
      renderPage();
      const dialog = await openDialog(
        'Add sensor to Casing',
        'Add sensor to Casing',
      );
      fireEvent.change(within(dialog).getByLabelText(/serial number/i), {
        target: { value: ' HFP-0009 ' },
      });
      fireEvent.click(
        within(dialog).getByRole('button', { name: 'Add sensor' }),
      );

      await waitFor(() =>
        expect(sensorsApi.attachSensor).toHaveBeenCalledWith('p-2', {
          serialNumber: 'HFP-0009',
          model: 'HF+',
        }),
      );
      expect((await screen.findByRole('status')).textContent).toContain(
        'Sensor HFP-0009 added to "Casing".',
      );
    });

    it('shows a duplicate serial number from the API in the dialog', async () => {
      vi.mocked(sensorsApi.attachSensor).mockRejectedValue(
        httpError(409, {
          error: { code: 'CONFLICT', message: 'Serial number already in use' },
        }),
      );
      renderPage();
      const dialog = await openDialog(
        'Add sensor to Casing',
        'Add sensor to Casing',
      );
      fireEvent.change(within(dialog).getByLabelText(/serial number/i), {
        target: { value: 'HFP-0001' },
      });
      fireEvent.click(
        within(dialog).getByRole('button', { name: 'Add sensor' }),
      );
      expect((await within(dialog).findByRole('alert')).textContent).toContain(
        'Serial number already in use',
      );
    });

    it('removes a sensor after stating the readings it erases', async () => {
      vi.mocked(readingsApi.countReadings).mockResolvedValue(1);
      renderPage();
      const dialog = await openDialog(
        'Remove sensor from Bearing DE',
        'Remove sensor?',
      );
      await waitFor(() =>
        expect(dialog.textContent).toContain(
          'Sensor HFP-0001 (HF+) will be removed from Bearing DE, and its 1 reading will be permanently deleted.',
        ),
      );
      fireEvent.click(within(dialog).getByRole('button', { name: 'Remove' }));
      await waitFor(() =>
        expect(sensorsApi.removeSensor).toHaveBeenCalledWith('s-1'),
      );
    });
  });

  describe('sensorModelOptions', () => {
    it('allows every model on a fan', () => {
      expect(sensorModelOptions('Fan').every((o) => !o.disabled)).toBe(true);
    });
  });
});

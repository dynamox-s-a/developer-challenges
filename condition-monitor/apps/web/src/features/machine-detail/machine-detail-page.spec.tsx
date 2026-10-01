import type { MachineDetail, MonitoringPoint, Sector } from '@condition-monitor/shared';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { mockApi, noContent, operator, problem } from '../../testing/mock-api';
import { renderApp, setScreen } from '../../testing/render-app';

const SECTOR_ID = '11111111-1111-4111-8111-111111111111';
const sector: Sector = { id: SECTOR_ID, code: 'DRY', name: 'Drying section', machineCount: 2 };
const machineRef = (type: 'Pump' | 'Fan') => ({
  id: type === 'Pump' ? 'm-pump' : 'm-fan',
  tag: type === 'Pump' ? 'DRY-PUMP-01' : 'DRY-FAN-01',
  name: type === 'Pump' ? 'Condensate pump' : 'Hood exhaust fan',
  type,
});

function point(
  id: string,
  type: 'Pump' | 'Fan',
  location: MonitoringPoint['location'],
  name: string,
  sensor: MonitoringPoint['sensor'] = null,
): MonitoringPoint {
  return { id, name, location, machine: machineRef(type), sensor };
}

function detail(type: 'Pump' | 'Fan', points: MonitoringPoint[]): MachineDetail {
  const ref = machineRef(type);
  return {
    ...ref,
    number: 1,
    sector: { id: sector.id, code: sector.code, name: sector.name },
    monitoringPoints: points,
    counts: {
      monitoringPoints: points.length,
      sensors: points.filter((item) => item.sensor).length,
    },
  };
}

const base = {
  'GET /api/auth/me': () => Response.json(operator),
  'GET /api/health': () => Response.json({ status: 'ok' }),
  'GET /api/sectors': () => Response.json([sector]),
};

function rows() {
  return within(screen.getByRole('table', { name: 'Monitoring points of the machine' }))
    .getAllByRole('row')
    .slice(1)
    .map((row) =>
      within(row)
        .getAllByRole('cell')
        .slice(0, 3)
        .map((cell) => cell.textContent),
    );
}

describe('machine page', () => {
  beforeEach(() => {
    setScreen('wide');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists the points in the order the API answers, with their sensors', async () => {
    mockApi({
      ...base,
      'GET /api/machines/m-pump': () =>
        Response.json(
          detail('Pump', [
            point('p1', 'Pump', 'PUMP_MOTOR_NDE', 'Motor, non-drive end bearing', {
              serialNumber: 'DX-0001',
              model: 'HF+',
            }),
            point('p2', 'Pump', 'OTHER', 'Base plate'),
          ]),
        ),
    });
    renderApp('/machines/m-pump');

    expect(await screen.findByRole('heading', { name: 'DRY-PUMP-01' })).toBeInTheDocument();
    expect(rows()).toEqual([
      ['Motor, non-drive end bearing', 'Motor, non-drive end bearing', 'DX-0001 HF+'],
      ['Other location', 'Base plate', 'No sensor'],
    ]);
  });

  it('offers only the positions of the machine type, the taken ones disabled', async () => {
    const { calls } = mockApi({
      ...base,
      'GET /api/machines/m-fan': () =>
        Response.json(detail('Fan', [point('f1', 'Fan', 'FAN_MOTOR_DE', 'Motor')])),
      'POST /api/machines/m-fan/monitoring-points': () =>
        Response.json({ items: [] }, { status: 201 }),
    });
    renderApp('/machines/m-fan');
    fireEvent.click(await screen.findByRole('button', { name: 'Add positions' }));

    const group = screen.getByRole('group', { name: 'Positions' });
    const labels = within(group)
      .getAllByRole('checkbox')
      .map((box) => box.closest('label')?.textContent);
    expect(labels).toEqual([
      'Motor, non-drive end bearing',
      'Motor, drive end bearing (already added)',
      'Fan shaft, drive end bearing',
      'Fan shaft, non-drive end bearing',
      'Other location',
    ]);
    expect(
      within(group).getByRole('checkbox', { name: /drive end bearing \(already/ }),
    ).toBeDisabled();

    fireEvent.click(within(group).getByRole('checkbox', { name: 'Fan shaft, drive end bearing' }));
    fireEvent.click(within(group).getByRole('checkbox', { name: 'Other location' }));
    fireEvent.change(screen.getByLabelText(/Name of the other location/), {
      target: { value: 'Casing' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add 2' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')?.body).toEqual({
        positions: [{ location: 'FAN_SHAFT_DE' }, { location: 'OTHER', name: 'Casing' }],
      }),
    );
  });

  it('offers only HF+ for a pump, the challenge rule, already selected', async () => {
    const { calls } = mockApi({
      ...base,
      'GET /api/machines/m-pump': () =>
        Response.json(detail('Pump', [point('p1', 'Pump', 'PUMP_MOTOR_DE', 'Motor')])),
      'PUT /api/monitoring-points/p1/sensor': () =>
        Response.json(
          point('p1', 'Pump', 'PUMP_MOTOR_DE', 'Motor', { serialNumber: 'DX-0002', model: 'HF+' }),
        ),
    });
    renderApp('/machines/m-pump');
    fireEvent.click(await screen.findByRole('button', { name: 'Install sensor at Motor' }));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Model' }));
    const options = (await screen.findAllByRole('option')).map((option) => option.textContent);
    expect(options).toEqual(['HF+']);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
    expect(screen.getByText('A pump accepts HF+ only.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Serial number/), { target: { value: 'dx-0002' } });
    fireEvent.click(screen.getByRole('button', { name: 'Install' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'PUT')?.body).toEqual({
        serialNumber: 'DX-0002',
        model: 'HF+',
      }),
    );
  });

  it('offers every model for a fan', async () => {
    mockApi({
      ...base,
      'GET /api/machines/m-fan': () =>
        Response.json(detail('Fan', [point('f1', 'Fan', 'FAN_MOTOR_DE', 'Motor')])),
    });
    renderApp('/machines/m-fan');
    fireEvent.click(await screen.findByRole('button', { name: 'Install sensor at Motor' }));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Model' }));

    expect((await screen.findAllByRole('option')).map((option) => option.textContent)).toEqual([
      'TcAg',
      'TcAs',
      'HF+',
    ]);
  });

  it('shows a serial number conflict on its field', async () => {
    mockApi({
      ...base,
      'GET /api/machines/m-fan': () =>
        Response.json(detail('Fan', [point('f1', 'Fan', 'FAN_MOTOR_DE', 'Motor')])),
      'PUT /api/monitoring-points/f1/sensor': () =>
        problem(409, 'Sensor DX-0003 is installed elsewhere.', [
          { field: 'serialNumber', message: 'DX-0003 is installed elsewhere.' },
        ]),
    });
    renderApp('/machines/m-fan');
    fireEvent.click(await screen.findByRole('button', { name: 'Install sensor at Motor' }));

    fireEvent.change(screen.getByLabelText(/Serial number/), { target: { value: 'DX-0003' } });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Model' }));
    fireEvent.click(await screen.findByRole('option', { name: 'TcAg' }));
    fireEvent.click(screen.getByRole('button', { name: 'Install' }));

    expect(await screen.findByText('DX-0003 is installed elsewhere.')).toBeInTheDocument();
  });

  it('lists every point that blocks a type change, from the API', async () => {
    mockApi({
      ...base,
      'GET /api/machines/m-fan': () =>
        Response.json(detail('Fan', [point('f1', 'Fan', 'FAN_MOTOR_DE', 'Motor')])),
      [`GET /api/machines/next-number?sectorId=${SECTOR_ID}&type=Pump`]: () =>
        Response.json({ number: 2, tag: 'DRY-PUMP-02' }),
      'PATCH /api/machines/m-fan': () =>
        problem(409, '1 monitoring point is not valid for Pump.', [
          {
            monitoringPointId: 'f1',
            name: 'Motor',
            reason: 'Position FAN_MOTOR_DE belongs to Fan.',
          },
        ]),
    });
    renderApp('/machines/m-fan');
    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Type' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Pump' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('1 monitoring point is not valid for Pump.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Motor: Position FAN_MOTOR_DE belongs to Fan.')).toBeInTheDocument();
  });

  it('deletes the machine after showing what goes with it, then returns to the list', async () => {
    mockApi({
      ...base,
      'GET /api/machines/m-pump': () =>
        Response.json(
          detail('Pump', [
            point('p1', 'Pump', 'PUMP_MOTOR_DE', 'Motor', { serialNumber: 'DX-9', model: 'HF+' }),
            point('p2', 'Pump', 'OTHER', 'Base plate'),
          ]),
        ),
      'DELETE /api/machines/m-pump': noContent,
      'GET /api/machines?page=1&pageSize=10&sort=tag&order=asc': () =>
        Response.json({ items: [], total: 0, page: 1, pageSize: 10 }),
    });
    const { router } = renderApp('/machines/m-pump');
    fireEvent.click(await screen.findByRole('button', { name: 'Delete' }));

    expect(screen.getByText(/removed with 2 monitoring points and 1 sensor/)).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/machines'));
  });

  it('opens a machine from its tag in the machines list', async () => {
    mockApi({
      ...base,
      'GET /api/machines?page=1&pageSize=10&sort=tag&order=asc': () =>
        Response.json({
          items: [
            {
              ...machineRef('Pump'),
              number: 1,
              sector: { id: SECTOR_ID, code: 'DRY', name: 'Drying section' },
            },
          ],
          total: 1,
          page: 1,
          pageSize: 10,
        }),
      'GET /api/machines/m-pump': () => Response.json(detail('Pump', [])),
    });
    renderApp('/machines');

    fireEvent.click(await screen.findByRole('link', { name: 'DRY-PUMP-01' }));

    expect(await screen.findByText(/No monitoring points yet/)).toBeInTheDocument();
  });
});

import type { IngestionReport } from '@condition-monitor/shared';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { mockApi, operator, problem } from '../../testing/mock-api';
import { renderApp, setScreen } from '../../testing/render-app';

const base = {
  'GET /api/auth/me': () => Response.json(operator),
  'GET /api/health': () => Response.json({ status: 'ok' }),
};

const CSV =
  'serial_number,timestamp,quantity,axis,value\nDX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2.31\n';

function report(inserted: number, repeated: number, created: number): IngestionReport {
  return {
    sensors: [
      {
        serialNumber: 'DX-0001',
        monitoringPointId: 'p1',
        seriesCreated: created,
        readingsInserted: inserted,
        readingsRepeated: repeated,
      },
    ],
    totals: { seriesCreated: created, readingsInserted: inserted, readingsRepeated: repeated },
  };
}

async function choose(file: File) {
  fireEvent.change(await screen.findByLabelText('Choose file'), { target: { files: [file] } });
}

describe('import page', () => {
  beforeEach(() => {
    setScreen('wide');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uploads the chosen file and shows what each sensor received', async () => {
    const { calls } = mockApi({
      ...base,
      'POST /api/imports': () => Response.json(report(1008, 0, 7)),
    });
    renderApp('/import');
    await choose(new File([CSV], 'readings.csv', { type: 'text/csv' }));

    expect(screen.getByText('readings.csv (0.0 MB)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));

    expect(
      await screen.findByText('1,008 readings stored, in 7 new time-series.'),
    ).toBeInTheDocument();
    const rows = within(screen.getByRole('table', { name: 'Import report' })).getAllByRole('row');
    expect(
      within(rows[1])
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['DX-0001', '7', '1,008', '0']);
    const sent = calls.find((call) => call.method === 'POST')?.body as FormData;
    expect((sent.get('file') as File).name).toBe('readings.csv');
  });

  it('says so when every reading was already stored', async () => {
    mockApi({ ...base, 'POST /api/imports': () => Response.json(report(0, 1008, 0)) });
    renderApp('/import');
    await choose(new File([CSV], 'readings.csv'));

    fireEvent.click(screen.getByRole('button', { name: 'Import' }));

    expect(
      await screen.findByText('Nothing new: all 1,008 readings were already stored.'),
    ).toBeInTheDocument();
  });

  it('lists every refused line with its column and reason', async () => {
    mockApi({
      ...base,
      'POST /api/imports': () =>
        new Response(
          JSON.stringify({
            type: 'urn:condition-monitor:error:import',
            title: 'Import rejected',
            status: 422,
            detail: '2 lines are invalid. Nothing was stored.',
            errors: [
              { line: 4, field: 'timestamp', message: 'Must be ISO 8601 with an offset.' },
              {
                line: 5,
                field: 'serial_number',
                message: 'No installed sensor with serial number DX-9.',
              },
            ],
          }),
          { status: 422, headers: { 'Content-Type': 'application/problem+json' } },
        ),
    });
    renderApp('/import');
    await choose(new File([CSV], 'readings.csv'));

    fireEvent.click(screen.getByRole('button', { name: 'Import' }));

    expect(await screen.findByText('2 lines are invalid. Nothing was stored.')).toBeInTheDocument();
    expect(
      screen.getByText('Line 4, timestamp: Must be ISO 8601 with an offset.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Line 5, serial_number: No installed sensor with serial number DX-9.'),
    ).toBeInTheDocument();
  });

  it('shows a refusal of the whole file, which has no line', async () => {
    mockApi({
      ...base,
      'POST /api/imports': () =>
        problem(422, 'The columns are separated by semicolons. Nothing was stored.', [
          { field: 'file', message: 'The columns are separated by semicolons.' },
        ]),
    });
    renderApp('/import');
    await choose(new File([CSV], 'readings.csv'));

    fireEvent.click(screen.getByRole('button', { name: 'Import' }));

    expect(
      await screen.findByText('file: The columns are separated by semicolons.'),
    ).toBeInTheDocument();
  });

  it('refuses a file over 2 MB before sending it', async () => {
    const { calls } = mockApi(base);
    renderApp('/import');

    await choose(new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'big.csv'));

    expect(screen.getByText(/at most 2.0 MB are accepted/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import' })).toBeDisabled();
    expect(calls.some((call) => call.method === 'POST')).toBe(false);
  });

  it('forgets the previous answer when another file is chosen', async () => {
    mockApi({ ...base, 'POST /api/imports': () => Response.json(report(1, 0, 1)) });
    renderApp('/import');
    await choose(new File([CSV], 'first.csv'));
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));
    await screen.findByRole('table', { name: 'Import report' });

    await choose(new File([CSV], 'second.csv'));

    await waitFor(() =>
      expect(screen.queryByRole('table', { name: 'Import report' })).not.toBeInTheDocument(),
    );
  });

  it('offers the example file for download', async () => {
    mockApi(base);
    renderApp('/import');

    expect(await screen.findByRole('link', { name: 'Download an example file' })).toHaveAttribute(
      'href',
      '/samples/readings-example.csv',
    );
  });
});

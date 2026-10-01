import type { IngestionReport, Machine, MonitoringPoint } from '@condition-monitor/shared';
import { resetDatabase } from '../../test/reset-database';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

interface ErrorBody {
  type: string;
  status: number;
  detail: string;
  errors: Record<string, unknown>[];
}

const HEADER = 'serial_number,timestamp,quantity,axis,value';

function form(content: string | Buffer, field = 'file'): FormData {
  const data = new FormData();
  data.append(field, new Blob([content], { type: 'text/csv' }), 'readings.csv');
  return data;
}

/** CSV upload (assumptions C3, C4, C11, C12, E2). */
describe('CSV import over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let point: MonitoringPoint;

  beforeAll(async () => {
    http = await startHttpApp();
  });

  beforeEach(async () => {
    await resetDatabase(http.prisma);
    operator = (await http.loginAs('operator@plant.test')).request;
    const sector = await readJson<{ id: string }>(
      await operator('POST', '/sectors', { code: 'DRY', name: 'Drying' }),
    );
    const fan = await readJson<Machine>(
      await operator('POST', '/machines', {
        sectorId: sector.id,
        type: 'Fan',
        number: 1,
        name: 'Fan',
      }),
    );
    [point] = (
      await readJson<{ items: MonitoringPoint[] }>(
        await operator('POST', `/machines/${fan.id}/monitoring-points`, {
          positions: [{ location: 'FAN_MOTOR_DE' }],
        }),
      )
    ).items;
    await operator('PUT', `/monitoring-points/${point.id}/sensor`, {
      serialNumber: 'DX-0001',
      model: 'TcAs',
    });
  });

  afterAll(async () => {
    await http.app.close();
  });

  const upload = (content: string | Buffer) => operator('POST', '/imports', form(content));

  it('stores a file and reports per sensor, like the JSON route', async () => {
    const response = await upload(
      [
        HEADER,
        'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2.31',
        'DX-0001,2026-09-29T10:00:00Z,temperature,,48.2',
      ].join('\n'),
    );

    expect(response.status).toBe(200);
    expect(await readJson<IngestionReport>(response)).toEqual({
      sensors: [
        {
          serialNumber: 'DX-0001',
          monitoringPointId: point.id,
          seriesCreated: 2,
          readingsInserted: 2,
          readingsRepeated: 0,
        },
      ],
      totals: { seriesCreated: 2, readingsInserted: 2, readingsRepeated: 0 },
    });
  });

  it('reports the same file uploaded twice as repeated (C5)', async () => {
    const file = [HEADER, 'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2.31'].join('\n');
    await upload(file);

    const again = await readJson<IngestionReport>(await upload(file));

    expect(again.totals).toEqual({ seriesCreated: 0, readingsInserted: 0, readingsRepeated: 1 });
  });

  it('names the line and the CSV column of every error, and stores nothing (C4)', async () => {
    const response = await upload(
      [
        HEADER,
        'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2.31',
        '',
        'DX-0001,2026-09-29T10:00:00,velocity_rms,H,2.4',
        'DX-0001,2026-09-29T10:10:00Z,velocity_rms,H,2,5',
      ].join('\n'),
    );

    expect(response.status).toBe(422);
    const body = await readJson<ErrorBody>(response);
    expect(body.type).toBe('urn:condition-monitor:error:import');
    expect(body.detail).toBe('2 lines are invalid. Nothing was stored.');
    expect(body.errors.map(({ line, field }) => [line, field])).toEqual([
      [4, 'timestamp'],
      [5, 'line'],
    ]);
    expect(await http.prisma.reading.count()).toBe(0);
  });

  it('names the line of an unknown sensor and of a conflicting stored value', async () => {
    await upload([HEADER, 'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2.31'].join('\n'));

    const response = await upload(
      [
        HEADER,
        'DX-9999,2026-09-29T10:00:00Z,velocity_rms,H,1',
        'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2.5',
      ].join('\n'),
    );
    const unknown = await readJson<ErrorBody>(response);
    expect(unknown.errors).toEqual([
      {
        line: 2,
        field: 'serial_number',
        message: 'No installed sensor with serial number DX-9999.',
      },
    ]);

    const conflict = await readJson<ErrorBody>(
      await upload(
        [
          HEADER,
          'DX-0001,2026-09-29T10:10:00Z,velocity_rms,H,1',
          'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2.5',
        ].join('\n'),
      ),
    );
    expect(conflict.errors).toEqual([
      {
        line: 3,
        field: 'value',
        message: 'Conflicts with the stored value 2.31 at the same timestamp.',
      },
    ]);
    expect(await http.prisma.reading.count()).toBe(1);
  });

  it('refuses a file saved with semicolons as a whole, saying why', async () => {
    const response = await upload(
      [
        'serial_number;timestamp;quantity;axis;value',
        'DX-0001;2026-09-29T10:00:00Z;velocity_rms;H;2,31',
      ].join('\n'),
    );

    expect(response.status).toBe(422);
    expect((await readJson<ErrorBody>(response)).errors).toEqual([
      { field: 'file', message: expect.stringMatching(/separated by semicolons/) },
    ]);
  });

  it('refuses a request without a file', async () => {
    const response = await operator('POST', '/imports', form('x', 'other'));
    const empty = await operator('POST', '/imports', new FormData());

    expect(response.status).toBe(400);
    expect(empty.status).toBe(422);
    expect((await readJson<ErrorBody>(empty)).errors).toEqual([
      { field: 'file', message: 'Attach a CSV file in the field "file".' },
    ]);
  });

  it('accepts a file of 2 MB and refuses one byte more with 413', async () => {
    const line = 'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2.31\n';
    // A valid header, then padding: the size is checked before the content is read.
    const exactly = Buffer.alloc(2 * 1024 * 1024, ' ');
    exactly.write(`${HEADER}\n${line}`);

    const atLimit = await upload(exactly);
    const over = await upload(Buffer.concat([exactly, Buffer.from(' ')]));

    expect(atLimit.status).not.toBe(413);
    expect(over.status).toBe(413);
    expect(over.headers.get('content-type')).toMatch(/application\/problem\+json/);
  });

  it('requires a session', async () => {
    expect((await http.anonymous('POST', '/imports', form(HEADER))).status).toBe(401);
  });
});

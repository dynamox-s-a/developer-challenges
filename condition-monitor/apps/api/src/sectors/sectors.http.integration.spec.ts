import { resetDatabase } from '../../test/reset-database';
import type { Sector } from '@condition-monitor/shared';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

interface ErrorBody {
  detail: string;
  errors: { field: string; message: string }[];
}

/** Sector routes over HTTP, against the test database (API contract, "Sectors"). */
describe('sectors over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let other: HttpClient;

  beforeAll(async () => {
    http = await startHttpApp();
  });

  beforeEach(async () => {
    await resetDatabase(http.prisma);
    operator = (await http.loginAs('operator@plant.test')).request;
    other = (await http.loginAs('other@plant.test')).request;
  });

  afterAll(async () => {
    await http.app.close();
  });

  async function create(client: HttpClient, code: string, name = `Sector ${code}`) {
    const response = await client('POST', '/sectors', { code, name });
    return { status: response.status, body: await readJson<Sector>(response) };
  }

  it('creates a sector with a normalized code, and lists it', async () => {
    const created = await create(operator, ' pm1 ', '  Paper machine 1 ');

    expect(created).toEqual({
      status: 201,
      body: { id: expect.any(String), code: 'PM1', name: 'Paper machine 1', machineCount: 0 },
    });
    const list = await operator('GET', '/sectors');
    expect(await readJson<Sector[]>(list)).toEqual([created.body]);
  });

  it('lists sectors ordered by code', async () => {
    for (const code of ['WET', 'DRY', 'PRS']) await create(operator, code);

    const list = await readJson<Sector[]>(await operator('GET', '/sectors'));

    expect(list.map((sector) => sector.code)).toEqual(['DRY', 'PRS', 'WET']);
  });

  it('answers 409 naming the field when the code is already in use', async () => {
    await create(operator, 'DRY');

    const duplicate = await create(operator, 'dry');

    expect(duplicate).toEqual({
      status: 409,
      body: {
        type: 'urn:condition-monitor:error:conflict',
        title: 'Sector code in use',
        status: 409,
        detail: 'Sector code DRY is already in use.',
        errors: [{ field: 'code', message: 'Code DRY is already in use.' }],
      },
    });
  });

  it('rejects an invalid body with 422 before any query', async () => {
    const response = await operator('POST', '/sectors', { code: 'D', name: '' });

    expect(response.status).toBe(422);
    expect((await readJson<ErrorBody>(response)).errors).toEqual([
      { field: 'code', message: 'Must be 2 to 10 letters or digits.' },
      { field: 'name', message: 'Required.' },
    ]);
  });

  it('updates the name alone, and rejects an empty change', async () => {
    const { body: sector } = await create(operator, 'DRY');

    const renamed = await operator('PATCH', `/sectors/${sector.id}`, { name: 'Drying section' });
    const empty = await operator('PATCH', `/sectors/${sector.id}`, {});

    expect(renamed.status).toBe(200);
    expect(await readJson<Sector>(renamed)).toEqual({ ...sector, name: 'Drying section' });
    expect(empty.status).toBe(422);
    expect((await readJson<ErrorBody>(empty)).errors).toEqual([
      { field: 'body', message: 'Send at least one field to change.' },
    ]);
  });

  it('answers 409 when a change of code clashes with another sector', async () => {
    await create(operator, 'DRY');
    const { body: press } = await create(operator, 'PRS');

    const response = await operator('PATCH', `/sectors/${press.id}`, { code: 'DRY' });

    expect(response.status).toBe(409);
  });

  it('deletes a sector', async () => {
    const { body: sector } = await create(operator, 'DRY');

    const response = await operator('DELETE', `/sectors/${sector.id}`);

    expect(response.status).toBe(204);
    expect(await readJson<Sector[]>(await operator('GET', '/sectors'))).toEqual([]);
  });

  it("hides another user's sectors: not listed, and 404 on change or delete", async () => {
    const { body: theirs } = await create(other, 'DRY');

    expect(await readJson<Sector[]>(await operator('GET', '/sectors'))).toEqual([]);
    const update = await operator('PATCH', `/sectors/${theirs.id}`, { name: 'Taken' });
    const remove = await operator('DELETE', `/sectors/${theirs.id}`);
    expect([update.status, remove.status]).toEqual([404, 404]);
    expect(await readJson<ErrorBody>(update)).toMatchObject({ detail: 'Sector not found.' });
    expect(await http.prisma.sector.count()).toBe(1);
  });

  it('answers 404 for an id that is not a UUID, without reaching the database', async () => {
    const response = await operator('DELETE', '/sectors/not-a-uuid');

    expect(response.status).toBe(404);
  });

  it('closes every sector route without a session', async () => {
    const statuses = await Promise.all([
      http.anonymous('GET', '/sectors'),
      http.anonymous('POST', '/sectors', { code: 'DRY', name: 'Drying' }),
    ]).then((responses) => responses.map((response) => response.status));

    expect(statuses).toEqual([401, 401]);
  });
});

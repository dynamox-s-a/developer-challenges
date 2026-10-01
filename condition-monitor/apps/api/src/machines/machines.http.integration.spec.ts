import type { Machine, NextNumber, Page, Sector } from '@condition-monitor/shared';
import { resetDatabase } from '../../test/reset-database';
import { readJson, startHttpApp, type HttpClient } from '../../test/http-app';

interface ErrorBody {
  detail: string;
  errors: Record<string, unknown>[];
}

/** Machine routes over HTTP, against the test database (API contract, "Machines"). */
describe('machines over HTTP', () => {
  let http: Awaited<ReturnType<typeof startHttpApp>>;
  let operator: HttpClient;
  let other: HttpClient;
  let dry: Sector;
  let prs: Sector;

  beforeAll(async () => {
    http = await startHttpApp();
  });

  beforeEach(async () => {
    await resetDatabase(http.prisma);
    operator = (await http.loginAs('operator@plant.test')).request;
    other = (await http.loginAs('other@plant.test')).request;
    dry = await readJson<Sector>(
      await operator('POST', '/sectors', { code: 'DRY', name: 'Drying' }),
    );
    prs = await readJson<Sector>(
      await operator('POST', '/sectors', { code: 'PRS', name: 'Press' }),
    );
  });

  afterAll(async () => {
    await http.app.close();
  });

  async function create(
    client: HttpClient,
    body: { sectorId: string; type: string; number: number; name?: string },
  ) {
    const response = await client('POST', '/machines', { name: 'Exhaust fan', ...body });
    return { status: response.status, body: await readJson<Machine & ErrorBody>(response) };
  }

  async function page(client: HttpClient, query = '') {
    return readJson<Page<Machine>>(await client('GET', `/machines${query}`));
  }

  it('creates a machine and answers it with its tag and sector', async () => {
    const { status, body } = await create(operator, {
      sectorId: dry.id,
      type: 'Fan',
      number: 1,
      name: '  Hood exhaust fan ',
    });

    expect(status).toBe(201);
    expect(body).toEqual({
      id: expect.any(String),
      tag: 'DRY-FAN-01',
      name: 'Hood exhaust fan',
      type: 'Fan',
      number: 1,
      sector: { id: dry.id, code: 'DRY', name: 'Drying' },
    });
  });

  it('accepts two machines with the same name (B2)', async () => {
    await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });
    const second = await create(operator, { sectorId: dry.id, type: 'Fan', number: 2 });

    expect(second.status).toBe(201);
  });

  it('answers 409 naming the tag when it is already in use', async () => {
    await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });

    const duplicate = await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });

    expect(duplicate.status).toBe(409);
    expect(duplicate.body).toMatchObject({
      detail: 'Tag DRY-FAN-01 is already in use.',
      errors: [{ field: 'number', message: 'DRY-FAN-01 already exists. Pick another number.' }],
    });
  });

  it("answers 404 when creating in another user's sector", async () => {
    const theirs = await readJson<Sector>(
      await other('POST', '/sectors', { code: 'WET', name: 'Wet end' }),
    );

    const { status } = await create(operator, { sectorId: theirs.id, type: 'Fan', number: 1 });

    expect(status).toBe(404);
  });

  it('suggests one above the highest number of that type in the sector', async () => {
    const first = await readJson<NextNumber>(
      await operator('GET', `/machines/next-number?sectorId=${dry.id}&type=Fan`),
    );
    await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });
    await create(operator, { sectorId: dry.id, type: 'Fan', number: 3 });

    const next = await readJson<NextNumber>(
      await operator('GET', `/machines/next-number?sectorId=${dry.id}&type=Fan`),
    );
    const pump = await readJson<NextNumber>(
      await operator('GET', `/machines/next-number?sectorId=${dry.id}&type=Pump`),
    );

    expect(first).toEqual({ number: 1, tag: 'DRY-FAN-01' });
    expect(next).toEqual({ number: 4, tag: 'DRY-FAN-04' });
    expect(pump).toEqual({ number: 1, tag: 'DRY-PUMP-01' });
  });

  it('pages the list with a total, and answers an empty page past the last', async () => {
    for (let number = 1; number <= 12; number++) {
      await create(operator, { sectorId: dry.id, type: 'Fan', number });
    }

    const first = await page(operator);
    const third = await page(operator, '?page=3');

    expect(first).toMatchObject({ total: 12, page: 1, pageSize: 10 });
    expect(first.items).toHaveLength(10);
    expect(first.items[0].tag).toBe('DRY-FAN-01');
    expect(third).toEqual({ items: [], total: 12, page: 3, pageSize: 10 });
  });

  it('never skips or repeats a machine between pages, even with equal names', async () => {
    for (let number = 1; number <= 12; number++) {
      await create(operator, { sectorId: dry.id, type: 'Fan', number, name: 'Same name' });
    }

    const pages = await Promise.all(
      [1, 2, 3].map((n) => page(operator, `?sort=name&pageSize=5&page=${n}`)),
    );

    const ids = pages.flatMap((p) => p.items.map((machine) => machine.id));
    expect(ids).toHaveLength(12);
    expect(new Set(ids).size).toBe(12);
  });

  it('sorts by each column, in both orders', async () => {
    await create(operator, { sectorId: prs.id, type: 'Pump', number: 1, name: 'Alpha' });
    await create(operator, { sectorId: dry.id, type: 'Fan', number: 2, name: 'Charlie' });
    await create(operator, { sectorId: dry.id, type: 'Pump', number: 1, name: 'Bravo' });
    const tags = async (query: string) => (await page(operator, query)).items.map((m) => m.tag);

    expect(await tags('')).toEqual(['DRY-FAN-02', 'DRY-PUMP-01', 'PRS-PUMP-01']);
    expect(await tags('?order=desc')).toEqual(['PRS-PUMP-01', 'DRY-PUMP-01', 'DRY-FAN-02']);
    expect(await tags('?sort=name')).toEqual(['PRS-PUMP-01', 'DRY-PUMP-01', 'DRY-FAN-02']);
    expect(await tags('?sort=type')).toEqual(['DRY-FAN-02', 'DRY-PUMP-01', 'PRS-PUMP-01']);
    expect(await tags('?sort=sector&order=desc')).toEqual([
      'PRS-PUMP-01',
      'DRY-PUMP-01',
      'DRY-FAN-02',
    ]);
  });

  it('filters by sector and never lists machines of another user', async () => {
    await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });
    await create(operator, { sectorId: prs.id, type: 'Fan', number: 1 });
    const theirs = await readJson<Sector>(
      await other('POST', '/sectors', { code: 'WET', name: 'Wet end' }),
    );
    await create(other, { sectorId: theirs.id, type: 'Fan', number: 1 });

    expect((await page(operator)).total).toBe(2);
    expect((await page(operator, `?sectorId=${prs.id}`)).items.map((m) => m.tag)).toEqual([
      'PRS-FAN-01',
    ]);
  });

  it('rejects invalid list parameters with 422 naming each one', async () => {
    const response = await operator('GET', '/machines?page=0&sort=number');

    expect(response.status).toBe(422);
    expect((await readJson<ErrorBody>(response)).errors.map((e) => e['field'])).toEqual([
      'page',
      'sort',
    ]);
  });

  it('reads one machine with its points and counts, and hides one of another user', async () => {
    const { body: mine } = await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });

    expect(await readJson<Machine>(await operator('GET', `/machines/${mine.id}`))).toEqual({
      ...mine,
      monitoringPoints: [],
      counts: { monitoringPoints: 0, sensors: 0 },
    });
    expect((await other('GET', `/machines/${mine.id}`)).status).toBe(404);
    expect((await operator('GET', '/machines/not-a-uuid')).status).toBe(404);
  });

  it('updates name, type, sector and number, rebuilding the tag', async () => {
    const { body: machine } = await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });

    const response = await operator('PATCH', `/machines/${machine.id}`, {
      sectorId: prs.id,
      type: 'Pump',
      number: 7,
      name: 'Condensate pump',
    });

    expect(response.status).toBe(200);
    expect(await readJson<Machine>(response)).toMatchObject({
      tag: 'PRS-PUMP-07',
      name: 'Condensate pump',
      type: 'Pump',
      number: 7,
      sector: { id: prs.id },
    });
  });

  it('answers 409 when an update would take a tag in use', async () => {
    await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });
    const { body: second } = await create(operator, { sectorId: dry.id, type: 'Fan', number: 2 });

    const response = await operator('PATCH', `/machines/${second.id}`, { number: 1 });

    expect(response.status).toBe(409);
  });

  it('deletes a machine, and not one of another user', async () => {
    const { body: machine } = await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });

    expect((await other('DELETE', `/machines/${machine.id}`)).status).toBe(404);
    expect((await operator('DELETE', `/machines/${machine.id}`)).status).toBe(204);
    expect((await page(operator)).total).toBe(0);
  });

  it('counts machines per sector and refuses to delete a sector that has them (B9)', async () => {
    await create(operator, { sectorId: dry.id, type: 'Fan', number: 1 });
    await create(operator, { sectorId: dry.id, type: 'Pump', number: 1 });

    const sectors = await readJson<Sector[]>(await operator('GET', '/sectors'));
    const refused = await operator('DELETE', `/sectors/${dry.id}`);

    expect(sectors.map((s) => [s.code, s.machineCount])).toEqual([
      ['DRY', 2],
      ['PRS', 0],
    ]);
    expect(refused.status).toBe(409);
    expect(await readJson<ErrorBody>(refused)).toMatchObject({
      detail: 'The sector still has 2 machines. Move or delete them first.',
      errors: [{ machineCount: 2 }],
    });
    expect((await operator('DELETE', `/sectors/${prs.id}`)).status).toBe(204);
  });
});

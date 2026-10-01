import type { Machine, Page, Sector } from '@condition-monitor/shared';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { mockApi, noContent, operator, problem } from '../../testing/mock-api';
import { renderApp, setScreen } from '../../testing/render-app';

const dry: Sector = {
  id: '11111111-1111-4111-8111-111111111111',
  code: 'DRY',
  name: 'Drying section',
  machineCount: 2,
};
const prs: Sector = {
  id: '22222222-2222-4222-8222-222222222222',
  code: 'PRS',
  name: 'Press section',
  machineCount: 0,
};

function machine(number: number, overrides: Partial<Machine> = {}): Machine {
  return {
    id: `33333333-3333-4333-8333-${String(number).padStart(12, '0')}`,
    tag: `DRY-FAN-${String(number).padStart(2, '0')}`,
    name: 'Hood exhaust fan',
    type: 'Fan',
    number,
    sector: { id: dry.id, code: dry.code, name: dry.name },
    ...overrides,
  };
}

function pageOf(items: Machine[], total = items.length, page = 1, pageSize = 10): Response {
  return Response.json({ items, total, page, pageSize } satisfies Page<Machine>);
}

const FIRST_PAGE = 'GET /api/machines?page=1&pageSize=10&sort=tag&order=asc';

const base = {
  'GET /api/auth/me': () => Response.json(operator),
  'GET /api/health': () => Response.json({ status: 'ok' }),
  'GET /api/sectors': () => Response.json([dry, prs]),
};

function tags() {
  return within(screen.getByRole('table', { name: 'Machines' }))
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);
}

describe('machines screen', () => {
  beforeEach(() => {
    setScreen('wide');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists the first page the API answers, by tag', async () => {
    mockApi({ ...base, [FIRST_PAGE]: () => pageOf([machine(1), machine(2)]) });
    renderApp('/machines');

    await screen.findByRole('table', { name: 'Machines' });

    expect(tags()).toEqual(['DRY-FAN-01', 'DRY-FAN-02']);
  });

  it('asks the API for another order when a column header is clicked', async () => {
    const { calls } = mockApi({
      ...base,
      [FIRST_PAGE]: () => pageOf([machine(1)]),
      'GET /api/machines?page=1&pageSize=10&sort=name&order=asc': () => pageOf([machine(1)]),
      'GET /api/machines?page=1&pageSize=10&sort=name&order=desc': () => pageOf([machine(1)]),
    });
    renderApp('/machines');
    await screen.findByRole('table', { name: 'Machines' });

    fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    await waitFor(() => expect(calls.at(-1)?.path).toContain('sort=name&order=asc'));
    fireEvent.click(screen.getByRole('button', { name: 'Name' }));

    await waitFor(() => expect(calls.at(-1)?.path).toContain('sort=name&order=desc'));
  });

  it('asks the API for the next page', async () => {
    const { calls } = mockApi({
      ...base,
      [FIRST_PAGE]: () => pageOf([machine(1)], 11),
      'GET /api/machines?page=2&pageSize=10&sort=tag&order=asc': () => pageOf([machine(11)], 11, 2),
    });
    renderApp('/machines');
    await screen.findByRole('table', { name: 'Machines' });

    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));

    await waitFor(() => expect(tags()).toEqual(['DRY-FAN-11']));
    expect(calls.at(-1)?.path).toContain('page=2');
  });

  it('says so when there are no machines, and guides to sectors when there are none', async () => {
    mockApi({
      ...base,
      'GET /api/sectors': () => Response.json([]),
      [FIRST_PAGE]: () => pageOf([]),
    });
    renderApp('/machines');

    expect(await screen.findByRole('link', { name: 'Create a sector' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New machine' })).toBeDisabled();
  });

  it('creates a machine from a name and a type, with sector and number filled in', async () => {
    let created = false;
    const { calls } = mockApi({
      ...base,
      [FIRST_PAGE]: () => pageOf(created ? [machine(1), machine(3)] : [machine(1)]),
      [`GET /api/machines/next-number?sectorId=${dry.id}&type=Fan`]: () =>
        Response.json({ number: 3, tag: 'DRY-FAN-03' }),
      'POST /api/machines': () => {
        created = true;
        return Response.json(machine(3), { status: 201 });
      },
    });
    renderApp('/machines');
    fireEvent.click(await screen.findByRole('button', { name: 'New machine' }));

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Hood exhaust fan' } });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Type' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Fan' }));

    expect(await screen.findByText('DRY-FAN-03')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => expect(tags()).toEqual(['DRY-FAN-01', 'DRY-FAN-03']));
    expect(calls.find((call) => call.method === 'POST')?.body).toEqual({
      sectorId: dry.id,
      type: 'Fan',
      number: 3,
      name: 'Hood exhaust fan',
    });
  });

  it('keeps the number the user typed instead of the suggestion', async () => {
    const { calls } = mockApi({
      ...base,
      [FIRST_PAGE]: () => pageOf([]),
      [`GET /api/machines/next-number?sectorId=${dry.id}&type=Pump`]: () =>
        Response.json({ number: 1, tag: 'DRY-PUMP-01' }),
      'POST /api/machines': () => Response.json(machine(7), { status: 201 }),
    });
    renderApp('/machines');
    fireEvent.click(await screen.findByRole('button', { name: 'New machine' }));

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Condensate pump' } });
    fireEvent.change(screen.getByLabelText(/Number/), { target: { value: '7' } });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Type' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Pump' }));

    expect(await screen.findByText('DRY-PUMP-07')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    await waitFor(() => expect(calls.some((call) => call.method === 'POST')).toBe(true));
    expect(calls.find((call) => call.method === 'POST')?.body).toMatchObject({ number: 7 });
  });

  it('shows a tag conflict on the number field, keeping the dialog open', async () => {
    const page = [machine(1), machine(2)];
    mockApi({
      ...base,
      [FIRST_PAGE]: () => pageOf(page),
      [`PATCH /api/machines/${machine(2).id}`]: () =>
        problem(409, 'Tag DRY-FAN-01 is already in use.', [
          { field: 'number', message: 'DRY-FAN-01 already exists. Pick another number.' },
        ]),
    });
    renderApp('/machines');
    fireEvent.click(await screen.findByRole('button', { name: 'Edit machine DRY-FAN-02' }));

    fireEvent.change(screen.getByLabelText(/Number/), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('DRY-FAN-01 already exists. Pick another number.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('deletes a machine only after confirmation, and reloads the page', async () => {
    let deleted = false;
    mockApi({
      ...base,
      [FIRST_PAGE]: () => pageOf(deleted ? [machine(2)] : [machine(1), machine(2)]),
      [`DELETE /api/machines/${machine(1).id}`]: () => {
        deleted = true;
        return noContent();
      },
    });
    renderApp('/machines');
    fireEvent.click(await screen.findByRole('button', { name: 'Delete machine DRY-FAN-01' }));

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(tags()).toEqual(['DRY-FAN-02']));
  });
});

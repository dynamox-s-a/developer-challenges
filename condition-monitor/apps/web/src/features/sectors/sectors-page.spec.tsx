import type { Sector } from '@condition-monitor/shared';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { mockApi, noContent, operator, problem } from '../../testing/mock-api';
import { renderApp, setScreen } from '../../testing/render-app';

const dry: Sector = {
  id: '11111111-1111-4111-8111-111111111111',
  code: 'DRY',
  name: 'Drying section',
  machineCount: 0,
};
const prs: Sector = {
  id: '22222222-2222-4222-8222-222222222222',
  code: 'PRS',
  name: 'Press section',
  machineCount: 0,
};

const session = {
  'GET /api/auth/me': () => Response.json(operator),
  'GET /api/health': () => Response.json({ status: 'ok' }),
};

function rows() {
  return within(screen.getByRole('table', { name: 'Sectors' }))
    .getAllByRole('row')
    .slice(1)
    .map((row) =>
      within(row)
        .getAllByRole('cell')
        .slice(0, 2)
        .map((cell) => cell.textContent),
    );
}

describe('sectors screen', () => {
  beforeEach(() => {
    setScreen('wide');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists the sectors the API answers, in its order', async () => {
    mockApi({ ...session, 'GET /api/sectors': () => Response.json([dry, prs]) });
    renderApp('/sectors');

    await screen.findByRole('table', { name: 'Sectors' });

    expect(rows()).toEqual([
      ['DRY', 'Drying section'],
      ['PRS', 'Press section'],
    ]);
  });

  it('says so when there are no sectors yet, instead of an empty table', async () => {
    mockApi({ ...session, 'GET /api/sectors': () => Response.json([]) });
    renderApp('/sectors');

    expect(await screen.findByText(/No sectors yet/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('offers a retry when the list cannot be loaded', async () => {
    mockApi({ ...session, 'GET /api/sectors': () => new Response('Bad Gateway', { status: 502 }) });
    renderApp('/sectors');

    expect(await screen.findByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('creates a sector and shows it in order', async () => {
    const { calls } = mockApi({
      ...session,
      'GET /api/sectors': () => Response.json([prs]),
      'POST /api/sectors': () => Response.json(dry, { status: 201 }),
    });
    renderApp('/sectors');
    fireEvent.click(await screen.findByRole('button', { name: 'New sector' }));

    fireEvent.change(screen.getByLabelText(/Code/), { target: { value: ' dry ' } });
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Drying section' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => expect(rows()).toHaveLength(2));
    expect(rows()[0]).toEqual(['DRY', 'Drying section']);
    expect(calls.find((call) => call.method === 'POST')?.body).toEqual({
      code: 'DRY',
      name: 'Drying section',
    });
  });

  it('shows the conflict the API answers on the code field, keeping the dialog open', async () => {
    mockApi({
      ...session,
      'GET /api/sectors': () => Response.json([dry]),
      'POST /api/sectors': () =>
        problem(409, 'Sector code DRY is already in use.', [
          { field: 'code', message: 'Code DRY is already in use.' },
        ]),
    });
    renderApp('/sectors');
    fireEvent.click(await screen.findByRole('button', { name: 'New sector' }));

    fireEvent.change(screen.getByLabelText(/Code/), { target: { value: 'DRY' } });
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Another' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Code DRY is already in use.')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('edits a sector', async () => {
    const renamed = { ...dry, name: 'Paper machine 1 drying' };
    const { calls } = mockApi({
      ...session,
      'GET /api/sectors': () => Response.json([dry]),
      [`PATCH /api/sectors/${dry.id}`]: () => Response.json(renamed),
    });
    renderApp('/sectors');
    fireEvent.click(await screen.findByRole('button', { name: 'Edit sector DRY' }));

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: renamed.name } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(rows()).toEqual([['DRY', 'Paper machine 1 drying']]));
    expect(calls.find((call) => call.method === 'PATCH')?.body).toEqual({
      code: 'DRY',
      name: renamed.name,
    });
  });

  it('deletes a sector only after confirmation', async () => {
    mockApi({
      ...session,
      'GET /api/sectors': () => Response.json([dry, prs]),
      [`DELETE /api/sectors/${dry.id}`]: noContent,
    });
    renderApp('/sectors');
    fireEvent.click(await screen.findByRole('button', { name: 'Delete sector DRY' }));

    expect(screen.getByRole('dialog', { name: 'Delete sector DRY?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(rows()).toEqual([['PRS', 'Press section']]));
  });

  it('keeps the confirmation open with the reason when the API refuses the deletion', async () => {
    mockApi({
      ...session,
      'GET /api/sectors': () => Response.json([dry]),
      [`DELETE /api/sectors/${dry.id}`]: () => problem(409, 'The sector still has 2 machines.'),
    });
    renderApp('/sectors');
    fireEvent.click(await screen.findByRole('button', { name: 'Delete sector DRY' }));

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(await screen.findByText('The sector still has 2 machines.')).toBeInTheDocument();
    // A modal hides the page from assistive technology, so the table is checked after closing.
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(rows()).toEqual([['DRY', 'Drying section']]);
  });
});

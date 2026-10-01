import { createStore } from '../../store/store';
import { checkApiHealth } from './health-slice';

function answerWith(response: Response) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

describe('API health', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts as unknown, not offline', () => {
    expect(createStore().getState().health).toEqual({ status: 'unknown', checking: false });
  });

  it('is online when the health route answers', async () => {
    answerWith(Response.json({ status: 'ok' }));
    const store = createStore();

    await store.dispatch(checkApiHealth());

    expect(store.getState().health).toEqual({ status: 'online', checking: false });
    expect(fetch).toHaveBeenCalledWith('/api/health', expect.anything());
  });

  it('is offline when the API answers with an error', async () => {
    answerWith(new Response('Bad Gateway', { status: 502 }));
    const store = createStore();

    await store.dispatch(checkApiHealth());

    expect(store.getState().health).toEqual({ status: 'offline', checking: false });
  });

  it('is offline when the API cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const store = createStore();

    await store.dispatch(checkApiHealth());

    expect(store.getState().health.status).toBe('offline');
  });
});

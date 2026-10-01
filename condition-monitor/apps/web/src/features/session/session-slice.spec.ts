import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError } from '../../api/http';
import { mockApi, noContent, operator, problem } from '../../testing/mock-api';
import { createStore } from '../../store/store';
import { fetchSession, login, logout } from './session-slice';

describe('session', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts as unknown, not logged out', () => {
    expect(createStore().getState().session.status).toBe('unknown');
  });

  it('is authenticated when the API answers who the session belongs to', async () => {
    mockApi({ 'GET /api/auth/me': () => Response.json(operator) });
    const store = createStore();

    await store.dispatch(fetchSession());

    expect(store.getState().session).toMatchObject({ status: 'authenticated', user: operator });
  });

  it('is anonymous on 401, without treating it as an error', async () => {
    mockApi({ 'GET /api/auth/me': () => problem(401, 'Authentication required.') });
    const store = createStore();

    await store.dispatch(fetchSession());

    expect(store.getState().session).toMatchObject({ status: 'anonymous', error: null });
  });

  it('stays unknown with an error when the API cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const store = createStore();

    await store.dispatch(fetchSession());

    expect(store.getState().session).toMatchObject({
      status: 'unknown',
      error: 'Could not reach the API to check the session.',
    });
  });

  it('keeps the message and field errors of a failed login', async () => {
    mockApi({
      'POST /api/auth/login': () =>
        problem(422, '1 field is invalid.', [{ field: 'email', message: 'Bad.' }]),
    });
    const store = createStore();

    const result = await store.dispatch(login({ email: 'a@b.co', password: 'x' }));

    expect(result.payload).toEqual({
      status: 422,
      message: '1 field is invalid.',
      fieldErrors: [{ field: 'email', message: 'Bad.' }],
      reasons: [],
    });
    expect(store.getState().session.status).toBe('unknown');
  });

  it('ends the session on logout even if the API cannot be told', async () => {
    mockApi({ 'GET /api/auth/me': () => Response.json(operator) });
    const store = createStore();
    await store.dispatch(fetchSession());
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await store.dispatch(logout());

    expect(store.getState().session).toMatchObject({ status: 'anonymous', user: null });
  });

  it('ends the session when any other request is answered 401', async () => {
    mockApi({
      'GET /api/auth/me': () => Response.json(operator),
      'POST /api/auth/logout': noContent,
    });
    const store = createStore();
    await store.dispatch(fetchSession());
    const anyRequest = createAsyncThunk('machines/load', () => {
      throw new ApiError(401, null);
    });

    await store.dispatch(anyRequest());

    expect(store.getState().session.status).toBe('anonymous');
  });

  it('ends the session when a request rejects with a 401 failure value', async () => {
    mockApi({ 'GET /api/auth/me': () => Response.json(operator) });
    const store = createStore();
    await store.dispatch(fetchSession());
    const anyRequest = createAsyncThunk('sectors/load', (_: void, { rejectWithValue }) =>
      rejectWithValue({
        status: 401,
        message: 'Authentication required.',
        fieldErrors: [],
        reasons: [],
      }),
    );

    await store.dispatch(anyRequest());

    expect(store.getState().session.status).toBe('anonymous');
  });

  it('keeps the session when another request fails for another reason', async () => {
    mockApi({ 'GET /api/auth/me': () => Response.json(operator) });
    const store = createStore();
    await store.dispatch(fetchSession());
    const anyRequest = createAsyncThunk('machines/load', () => {
      throw new ApiError(500, null);
    });

    await store.dispatch(anyRequest());

    expect(store.getState().session.status).toBe('authenticated');
  });
});

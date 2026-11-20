import { fetchHealth, healthReducer } from './health.slice';

describe('healthReducer', () => {
  it('should start empty', () => {
    const state = healthReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({ data: null, status: 'idle', error: null });
  });

  it('should be loading while the request is pending', () => {
    const state = healthReducer(
      undefined,
      fetchHealth.pending('req-1', undefined),
    );
    expect(state.status).toBe('loading');
  });

  it('should store the data when the api responds', () => {
    const data = { api: 'ok', database: 'ok' };
    const state = healthReducer(
      undefined,
      fetchHealth.fulfilled(data, 'req-1', undefined),
    );
    expect(state.status).toBe('succeeded');
    expect(state.data).toEqual(data);
  });

  it('should store an error message when the request fails', () => {
    const state = healthReducer(
      undefined,
      fetchHealth.rejected(new Error('falhou'), 'req-1', undefined),
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Não foi possível falar com a API');
  });
});

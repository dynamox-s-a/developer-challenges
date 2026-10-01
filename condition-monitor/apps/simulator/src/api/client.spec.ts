import { API_URL, fakeApi, fan } from '../testing/fake-api';
import { ApiClient, ApiRequestError } from './client';

describe('ApiClient', () => {
  it('logs in once and sends the session cookie with every request', async () => {
    const api = fakeApi([fan]);
    const client = new ApiClient({
      apiUrl: API_URL,
      email: 'op@test',
      password: 'secret',
      fetch: api.fetch,
    });

    await client.listSensors([]);
    await client.listSensors(['DX-0001']);

    expect(api.state.logins).toBe(1);
  });

  it('logs in again once when the session expired, then retries', async () => {
    const api = fakeApi([fan]);
    const client = new ApiClient({
      apiUrl: API_URL,
      email: 'op@test',
      password: 'secret',
      fetch: api.fetch,
    });
    await client.listSensors([]);

    api.state.session = 'session=expired-by-the-api';
    const sensors = await client.listSensors([]);

    expect(sensors).toHaveLength(1);
    expect(api.state.logins).toBe(2);
  });

  it('reports a refused login with the API message', async () => {
    const api = fakeApi([fan]);
    const client = new ApiClient({
      apiUrl: API_URL,
      email: 'op@test',
      password: 'wrong',
      fetch: api.fetch,
    });

    await expect(client.listSensors([])).rejects.toThrow('Login refused. Wrong email or password.');
  });

  it('says where it tried when the API cannot be reached', async () => {
    const api = fakeApi([fan]);
    api.state.reachable = false;
    const client = new ApiClient({
      apiUrl: API_URL,
      email: 'op@test',
      password: 'secret',
      fetch: api.fetch,
    });

    const failure = client.listSensors([]);

    await expect(failure).rejects.toBeInstanceOf(ApiRequestError);
    await expect(failure).rejects.toThrow(`Could not reach the API at ${API_URL}`);
  });
});

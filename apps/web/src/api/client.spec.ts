import { afterEach, describe, expect, it, vi } from 'vitest';

import { api, assertLocalApiBaseUrl, setToken } from './client';

describe('assertLocalApiBaseUrl', () => {
  it('aceita a API local do projeto', () => {
    expect(assertLocalApiBaseUrl('http://localhost:3000/api')).toBe('http://localhost:3000/api');
    expect(assertLocalApiBaseUrl('http://127.0.0.1:3000/api/')).toBe('http://127.0.0.1:3000/api');
  });

  it('recusa qualquer domínio da Dynamox', () => {
    expect(() => assertLocalApiBaseUrl('https://api.dynamox.solutions')).toThrow(/Dynamox/);
    expect(() => assertLocalApiBaseUrl('https://dynamox.net/v1')).toThrow(/Dynamox/);
  });

  it('recusa URL inválida', () => {
    expect(() => assertLocalApiBaseUrl('nao-e-uma-url')).toThrow(/inválida/);
  });
});

describe('api.updateMachine / api.deleteMachine', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setToken(null);
  });

  it('4. PATCH /machines/:id envia Bearer e somente os campos alterados', async () => {
    setToken('jwt-abc');
    const updated = {
      id: '1',
      name: 'P-101-B',
      type: 'Pump',
      createdAt: 'x',
      updatedAt: 'x',
    };
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(updated), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.updateMachine('1', { name: 'P-101-B' });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/machines\/1$/);
    expect(init.method).toBe('PATCH');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer jwt-abc');
    expect(JSON.parse(init.body as string)).toEqual({ name: 'P-101-B' });
    expect(result).toEqual(updated);
  });

  it('5. DELETE /machines/:id trata o 204 sem corpo sem estourar', async () => {
    setToken('jwt-abc');
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(api.deleteMachine('1')).resolves.toBeUndefined();

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/machines\/1$/);
    expect(init.method).toBe('DELETE');
  });

  it('6. erro 404 no DELETE preserva a mensagem da API', async () => {
    setToken('jwt-abc');
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({ code: 'MACHINE_NOT_FOUND', message: 'Máquina "x" não encontrada.' }),
            { status: 404 },
          ),
      ),
    );

    await expect(api.deleteMachine('x')).rejects.toThrow('Máquina "x" não encontrada.');
  });
});

describe('api.machines / api.createMachine', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setToken(null);
  });

  it('1. GET /machines envia o Bearer', async () => {
    setToken('jwt-abc');
    const fetchMock = vi.fn(async () => new Response('[]', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await api.machines();

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/machines$/);
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer jwt-abc');
  });

  it('2. POST /machines envia Bearer e o JSON correto', async () => {
    setToken('jwt-abc');
    const created = {
      id: '1',
      name: 'P-102',
      type: 'Pump',
      createdAt: 'x',
      updatedAt: 'x',
    };
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify(created), { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.createMachine('P-102', 'Pump');

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/machines$/);
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer jwt-abc');
    expect(JSON.parse(init.body as string)).toEqual({ name: 'P-102', type: 'Pump' });
    expect(result).toEqual(created);
  });

  it('3. erro 409 preserva a mensagem devolvida pela API', async () => {
    setToken('jwt-abc');
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              code: 'MACHINE_NAME_CONFLICT',
              message: 'Já existe uma máquina com o nome "P-101".',
            }),
            { status: 409 },
          ),
      ),
    );

    await expect(api.createMachine('P-101', 'Fan')).rejects.toThrow(
      'Já existe uma máquina com o nome "P-101".',
    );
  });
});

describe('paginação completa usada pelo dashboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setToken(null);
  });

  it('percorre todas as páginas de pontos sem alterar o contrato da API', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      const page = Number(url.searchParams.get('page'));
      return new Response(
        JSON.stringify({
          items: [{ id: `p${page}` }],
          total: 51,
          page,
          pageSize: 50,
          sortBy: 'machineName',
          sortDir: 'asc',
        }),
        { status: 200 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.allMonitoringPoints();

    expect(result.map((point) => point.id)).toEqual(['p1', 'p2']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1][0])).toContain('page=2');
    expect(String(fetchMock.mock.calls[0][0])).toContain('pageSize=50');
  });

  it('recupera todas as páginas de amostras e respeita o offset real', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      const offset = Number(url.searchParams.get('offset'));
      const item = { timestamp: `2026-08-29T00:00:0${offset}.000Z`, value: offset + 1 };
      return new Response(
        JSON.stringify({ items: [item], total: 2, limit: 5000, offset }),
        { status: 200 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.allSamples('series-1');

    expect(result.map((sample) => sample.value)).toEqual([1, 2]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1][0])).toContain('offset=1');
  });
});

import { ApiError, getJson } from './http';

describe('getJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads a Problem Details error body', async () => {
    const problem = {
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Cannot GET /api/nothing',
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(problem), {
          status: 404,
          headers: { 'Content-Type': 'application/problem+json' },
        }),
      ),
    );

    const error = await getJson('/nothing').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, problem, message: 'Cannot GET /api/nothing' });
  });

  it('keeps the status when the error body is not Problem Details', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Bad Gateway', { status: 502 })));

    const error = await getJson('/health').catch((caught: unknown) => caught);

    expect(error).toMatchObject({ status: 502, problem: null });
  });
});

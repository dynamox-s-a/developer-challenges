/**
 * A fake API for tests: each route answers what the test declares, and a request to an
 * undeclared route fails the test instead of passing silently.
 */
export type MockRoutes = Record<string, () => Response>;

export function mockApi(routes: MockRoutes) {
  const calls: { method: string; path: string; body: unknown }[] = [];
  const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const method = init?.method ?? 'GET';
    const path = String(input);
    const body = init?.body;
    calls.push({
      method,
      path,
      // A form is kept as sent, so a test can read the file in it.
      body: body instanceof FormData ? body : body ? JSON.parse(String(body)) : undefined,
    });
    const answer = routes[`${method} ${path}`];
    if (!answer) {
      throw new Error(`Unexpected request in test: ${method} ${path}`);
    }
    return answer();
  });
  vi.stubGlobal('fetch', fetchMock);
  return { calls, fetchMock };
}

export function problem(status: number, detail: string, errors?: unknown[]): Response {
  return new Response(
    JSON.stringify({ type: 'about:blank', title: 'Error', status, detail, errors }),
    { status, headers: { 'Content-Type': 'application/problem+json' } },
  );
}

export const noContent = () => new Response(null, { status: 204 });

export const operator = {
  id: '0b8c5b7e-8a8b-4b7e-9d2a-1f1e2d3c4b5a',
  email: 'operator@plant.test',
};

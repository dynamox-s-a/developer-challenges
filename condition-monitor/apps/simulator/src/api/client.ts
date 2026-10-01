import type { IngestionReport, Reading, SensorInstallation } from '@condition-monitor/shared';

/** An answer of the API that is not a success, with what the API said about it. */
export class ApiRequestError extends Error {
  override readonly name = 'ApiRequestError';

  constructor(
    readonly status: number | null,
    message: string,
  ) {
    super(message);
  }
}

interface ProblemBody {
  detail?: string;
  errors?: { index?: number; field?: string; message?: string }[];
}

/** The API's own words: its detail and the first errors it listed. */
async function describe(response: Response): Promise<string> {
  const fallback = `The API answered ${response.status}.`;
  if (!response.headers.get('content-type')?.includes('json')) return fallback;
  const body = (await response.json()) as ProblemBody;
  const errors = (body.errors ?? [])
    .slice(0, 5)
    .map((error) =>
      [error.index === undefined ? '' : `reading ${error.index}`, error.field, error.message]
        .filter(Boolean)
        .join(', '),
    );
  return [body.detail ?? fallback, ...errors.map((error) => `  ${error}`)].join('\n');
}

export interface ClientOptions {
  apiUrl: string;
  email: string;
  password: string;
  fetch?: typeof fetch;
}

/**
 * The simulator talks to the API as the web app does: it logs in and sends the session
 * cookie (ADR 0008). A session lasts one hour and the live mode runs longer, so a 401
 * leads to one new login and one retry.
 */
export class ApiClient {
  private cookie: string | null = null;
  private readonly fetch: typeof fetch;

  constructor(private readonly options: ClientOptions) {
    this.fetch = options.fetch ?? globalThis.fetch;
  }

  async login(): Promise<void> {
    const response = await this.send('POST', '/auth/login', {
      email: this.options.email,
      password: this.options.password,
    });
    if (response.status !== 204) {
      throw new ApiRequestError(response.status, `Login refused. ${await describe(response)}`);
    }
    const cookie = response.headers.getSetCookie?.()[0]?.split(';')[0];
    if (!cookie) throw new ApiRequestError(response.status, 'Login gave no session cookie.');
    this.cookie = cookie;
  }

  /** Installed sensors of the user, all of them or the given serial numbers. */
  listSensors(serialNumbers: string[]): Promise<SensorInstallation[]> {
    const query = new URLSearchParams(
      serialNumbers.map((serial): [string, string] => ['serialNumber', serial]),
    );
    const suffix = serialNumbers.length > 0 ? `?${query.toString()}` : '';
    return this.json<SensorInstallation[]>('GET', `/sensors${suffix}`);
  }

  /** One submission, all or nothing (C4). */
  sendReadings(readings: Reading[]): Promise<IngestionReport> {
    return this.json<IngestionReport>('POST', '/readings', { readings });
  }

  private async json<T>(method: string, path: string, body?: unknown): Promise<T> {
    if (!this.cookie) await this.login();
    let response = await this.send(method, path, body);
    if (response.status === 401) {
      await this.login();
      response = await this.send(method, path, body);
    }
    if (!response.ok) throw new ApiRequestError(response.status, await describe(response));
    return (await response.json()) as T;
  }

  private async send(method: string, path: string, body?: unknown): Promise<Response> {
    try {
      return await this.fetch(`${this.options.apiUrl}${path}`, {
        method,
        headers: {
          Accept: 'application/json',
          ...(this.cookie ? { Cookie: this.cookie } : {}),
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new ApiRequestError(
        null,
        `Could not reach the API at ${this.options.apiUrl}: ${reason}`,
      );
    }
  }
}

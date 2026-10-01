import { ArgumentsHost, Logger, NotFoundException } from '@nestjs/common';
import { ProblemDetailsFilter } from './problem-details.filter';
import { ProblemException } from './problem.exception';

function captureResponse() {
  const sent: { status?: number; type?: string; body?: unknown } = {};
  const response = {
    status(code: number) {
      sent.status = code;
      return response;
    },
    type(contentType: string) {
      sent.type = contentType;
      return response;
    },
    json(body: unknown) {
      sent.body = body;
      return response;
    },
  };
  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;
  return { host, sent };
}

describe('ProblemDetailsFilter', () => {
  const filter = new ProblemDetailsFilter();

  it('writes a ProblemException exactly as raised', () => {
    const problem = {
      type: 'urn:condition-monitor:error:conflict',
      title: 'Machine type cannot change',
      status: 409,
      detail: '1 monitoring point is not valid for Pump.',
      errors: [{ monitoringPointId: 'p1', reason: 'Sensor model TcAg is not allowed on Pump.' }],
    };
    const { host, sent } = captureResponse();

    filter.catch(new ProblemException(problem), host);

    expect(sent).toEqual({ status: 409, type: 'application/problem+json', body: problem });
  });

  it('turns a framework HTTP error into a generic problem with its status', () => {
    const { host, sent } = captureResponse();

    filter.catch(new NotFoundException('Cannot GET /api/nothing'), host);

    expect(sent.status).toBe(404);
    expect(sent.body).toEqual({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Cannot GET /api/nothing',
    });
  });

  it('keeps the status of a client error raised by Express middleware, such as 413', () => {
    const { host, sent } = captureResponse();
    // The shape body-parser raises for a body over its limit (http-errors).
    const tooLarge = Object.assign(new Error('request entity too large'), {
      status: 413,
      expose: true,
      limit: 2 * 1024 * 1024,
      type: 'entity.too.large',
    });

    filter.catch(tooLarge, host);

    expect(sent.status).toBe(413);
    expect(sent.body).toEqual({
      type: 'about:blank',
      title: 'Payload Too Large',
      status: 413,
      detail: 'The request body is larger than the limit of 2 MB.',
    });
  });

  it('hides an error with a 4xx status that is not marked safe to show', () => {
    const log = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const { host, sent } = captureResponse();

    filter.catch(Object.assign(new Error('internal detail'), { status: 400 }), host);

    expect(sent.status).toBe(500);
    log.mockRestore();
  });

  it('hides the cause of an unexpected error from the client and logs it', () => {
    const log = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const { host, sent } = captureResponse();

    filter.catch(new Error('connection string with a password'), host);

    expect(sent.status).toBe(500);
    expect(sent.body).toEqual({
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred.',
    });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('connection string'));
    log.mockRestore();
  });
});

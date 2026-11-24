import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { app } from '../../app.ts';
import { AppError } from '../../errors/app-error.ts';
import { signToken } from '../../lib/jwt.ts';
import * as service from './machines.service.ts';

// Nada de .env nem de banco: o env é falso e o service inteiro também
// (o vi.mock sem "fábrica" troca cada função exportada por um vi.fn())
vi.mock('../../config/env.ts', () => ({
  env: {
    JWT_SECRET: 'segredo-de-teste-com-mais-de-32-caracteres',
    JWT_EXPIRES_IN: 3600,
  },
}));
vi.mock('../../lib/prisma.ts', () => ({ prisma: {} }));
vi.mock('./machines.service.ts');

const machine = {
  id: 'machine-1',
  name: 'Bomba 01',
  type: 'Pump' as const,
  createdAt: new Date('2026-11-21T10:00:00Z'),
  updatedAt: new Date('2026-11-21T10:00:00Z'),
};
const token = signToken({ sub: 'user-1', email: 'admin@dynamox.com' });

// Formato dos erros da nossa API (o response.json() não sabe disso sozinho)
type ErrorBody = { error: { code: string; message: string } };

let server: Server;
let baseUrl: string;

// Sobe a API de verdade numa porta livre (porta 0 = o sistema escolhe)
beforeAll(async () => {
  server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}/api/machines`;
});

afterAll(() => {
  server.close();
});

// Faz uma requisição HTTP de verdade para a API, logado por padrão
function request(path: string, init: RequestInit = {}, { auth = true } = {}) {
  return fetch(baseUrl + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

describe('machines routes', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should reject requests without a token', async () => {
    const response = await request('', {}, { auth: false });

    expect(response.status).toBe(401);
    expect(service.listMachines).not.toHaveBeenCalled();
  });

  it('should list the machines', async () => {
    vi.mocked(service.listMachines).mockResolvedValue([machine]);

    const response = await request('');

    expect(response.status).toBe(200);
    // No JSON, as datas viram texto (formato ISO)
    expect(await response.json()).toEqual([
      {
        id: 'machine-1',
        name: 'Bomba 01',
        type: 'Pump',
        createdAt: '2026-11-21T10:00:00.000Z',
        updatedAt: '2026-11-21T10:00:00.000Z',
      },
    ]);
  });

  it('should create a machine and answer 201', async () => {
    vi.mocked(service.createMachine).mockResolvedValue(machine);

    const response = await request('', {
      method: 'POST',
      body: JSON.stringify({ name: '  Bomba 01  ', type: 'Pump' }),
    });

    expect(response.status).toBe(201);
    // O validateBody já tirou os espaços das pontas do nome
    expect(service.createMachine).toHaveBeenCalledWith({
      name: 'Bomba 01',
      type: 'Pump',
    });
  });

  it('should answer 400 and not create anything when the body is invalid', async () => {
    const response = await request('', {
      method: 'POST',
      body: JSON.stringify({ name: '', type: 'Compressor' }),
    });
    const body = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(service.createMachine).not.toHaveBeenCalled();
  });

  it('should update a machine', async () => {
    vi.mocked(service.updateMachine).mockResolvedValue(machine);

    const response = await request('/machine-1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Bomba 01', type: 'Fan' }),
    });

    expect(response.status).toBe(200);
    expect(service.updateMachine).toHaveBeenCalledWith('machine-1', {
      name: 'Bomba 01',
      type: 'Fan',
    });
  });

  it('should answer 404 when the machine does not exist', async () => {
    vi.mocked(service.getMachine).mockRejectedValue(
      new AppError(404, 'NOT_FOUND', 'Máquina não encontrada'),
    );

    const response = await request('/nao-existe');
    const body = (await response.json()) as ErrorBody;

    expect(response.status).toBe(404);
    expect(body.error.message).toBe('Máquina não encontrada');
  });

  it('should delete a machine and answer 204', async () => {
    const response = await request('/machine-1', { method: 'DELETE' });

    expect(response.status).toBe(204);
    expect(service.deleteMachine).toHaveBeenCalledWith('machine-1');
  });
});

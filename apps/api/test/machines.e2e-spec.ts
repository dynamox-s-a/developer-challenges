/**
 * MAC-01 — CRUD autenticado de máquinas. Exige o PostgreSQL local com migrações
 * aplicadas: `npm run db:up && npm run prisma:deploy`.
 *
 * Isolamento: todas as fixtures usam o prefixo MAC01- e a limpeza apaga apenas esse
 * prefixo, preservando o seed e as fixtures das outras suítes.
 */
import { randomBytes, scryptSync } from 'node:crypto';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const PREFIX = 'MAC01-';
const USER_EMAIL = 'machines-e2e@dynamox.local';
const USER_PASSWORD = 'Senha-E2E@2026';

const name = (suffix: string) => `${PREFIX}${suffix}`;

describe('MAC-01 — CRUD autenticado de máquinas', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let bearer = '';

  const http = () => request(app.getHttpServer());
  const authed = {
    get: (url: string) => http().get(url).set('Authorization', bearer),
    post: (url: string) => http().post(url).set('Authorization', bearer),
    patch: (url: string) => http().patch(url).set('Authorization', bearer),
    delete: (url: string) => http().delete(url).set('Authorization', bearer),
  };

  async function removeFixtures(): Promise<void> {
    await prisma.machine.deleteMany({ where: { name: { startsWith: PREFIX } } });
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get(PrismaService);
    await removeFixtures();

    const salt = randomBytes(16).toString('hex');
    await prisma.user.upsert({
      where: { email: USER_EMAIL },
      update: {},
      create: {
        email: USER_EMAIL,
        name: 'Máquinas E2E',
        passwordHash: `scrypt$${salt}$${scryptSync(USER_PASSWORD, salt, 64).toString('hex')}`,
        // Estas suítes exercitam mutações: o usuário de fixture precisa do perfil que as permite.
        role: 'ADMIN',
      },
    });

    const login = await http()
      .post('/api/auth/login')
      .send({ email: USER_EMAIL, password: USER_PASSWORD })
      .expect(201);
    bearer = `Bearer ${login.body.token}`;
  });

  afterAll(async () => {
    await removeFixtures();
    await prisma.user.deleteMany({ where: { email: USER_EMAIL } });
    await app.close();
  });

  it('1. rota de máquinas sem token retorna 401', async () => {
    await http().get('/api/machines').expect(401);
    await http().post('/api/machines').send({ name: name('X'), type: 'Pump' }).expect(401);
  });

  it('2. cria uma máquina Pump autenticada', async () => {
    const response = await authed
      .post('/api/machines')
      .send({ name: name('Bomba'), type: 'Pump' })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({ name: name('Bomba'), type: 'Pump' }),
    );
    expect(typeof response.body.id).toBe('string');
    // O enum interno do Prisma nunca vaza para a resposta.
    expect(response.body.type).not.toBe('PUMP');
  });

  it('3. cria uma máquina Fan autenticada', async () => {
    const response = await authed
      .post('/api/machines')
      .send({ name: name('Ventilador'), type: 'Fan' })
      .expect(201);

    expect(response.body.type).toBe('Fan');
  });

  it('4. lista as máquinas persistidas em ordem determinística', async () => {
    // Cria as próprias pré-condições, com sub-prefixo exclusivo: o teste não depende
    // dos casos anteriores nem do que outras suítes tenham deixado na tabela.
    const listPrefix = name('List-');
    await authed.post('/api/machines').send({ name: `${listPrefix}B`, type: 'Fan' }).expect(201);
    await authed.post('/api/machines').send({ name: `${listPrefix}A`, type: 'Pump' }).expect(201);

    const response = await authed.get('/api/machines').expect(200);

    const ours = (response.body as Array<{ name: string; type: string }>).filter((m) =>
      m.name.startsWith(listPrefix),
    );
    // Inseridos fora de ordem de propósito: a listagem precisa devolvê-los ordenados.
    expect(ours.map((m) => m.name)).toEqual([`${listPrefix}A`, `${listPrefix}B`]);
    expect(ours.map((m) => m.type)).toEqual(['Pump', 'Fan']);
  });

  it('5. tipo inválido retorna 400', async () => {
    const response = await authed
      .post('/api/machines')
      .send({ name: name('Invalida'), type: 'Compressor' })
      .expect(400);

    expect(response.body.code).toBe('INVALID_MACHINE_TYPE');
  });

  it('6. nome vazio ou só espaços retorna 400', async () => {
    await authed.post('/api/machines').send({ name: '', type: 'Pump' }).expect(400);
    const response = await authed
      .post('/api/machines')
      .send({ name: '   ', type: 'Pump' })
      .expect(400);

    expect(response.body.code).toBe('INVALID_MACHINE_PAYLOAD');
  });

  it('6b. nome longo demais retorna 400 em vez de estourar o índice único', async () => {
    // O limite de 120 caracteres é uma decisão defensiva da API, não um número derivado
    // do PostgreSQL. Como `name` participa de um índice único, entradas de índice B-tree
    // têm um limite físico que depende do tamanho da página e da representação do valor;
    // aceitar nomes arbitrariamente grandes transferiria ao banco uma falha que deveria
    // ser validação. A API responde 400 de forma determinística antes da persistência.
    const response = await authed
      .post('/api/machines')
      .send({ name: 'x'.repeat(121), type: 'Pump' })
      .expect(400);

    expect(response.body.code).toBe('INVALID_MACHINE_PAYLOAD');
  });

  it('7. campo desconhecido no payload retorna 400', async () => {
    const response = await authed
      .post('/api/machines')
      .send({ name: name('Extra'), type: 'Pump', rpm: 1750 })
      .expect(400);

    expect(response.body.code).toBe('INVALID_MACHINE_PAYLOAD');
    expect(response.body.message).toMatch(/rpm/);
  });

  it('8. nome duplicado no POST retorna 409', async () => {
    const duplicated = name('DuplicadoPost');
    await authed.post('/api/machines').send({ name: duplicated, type: 'Pump' }).expect(201);

    const response = await authed
      .post('/api/machines')
      .send({ name: duplicated, type: 'Fan' })
      .expect(409);

    expect(response.body.code).toBe('MACHINE_NAME_CONFLICT');
  });

  it('9. PATCH altera o nome', async () => {
    const created = await authed
      .post('/api/machines')
      .send({ name: name('Renomear'), type: 'Pump' })
      .expect(201);

    const response = await authed
      .patch(`/api/machines/${created.body.id}`)
      .send({ name: name('Renomeada') })
      .expect(200);

    expect(response.body.name).toBe(name('Renomeada'));
    expect(response.body.type).toBe('Pump');
  });

  it('10. PATCH altera o tipo', async () => {
    const created = await authed
      .post('/api/machines')
      .send({ name: name('TrocaTipo'), type: 'Pump' })
      .expect(201);

    const response = await authed
      .patch(`/api/machines/${created.body.id}`)
      .send({ type: 'Fan' })
      .expect(200);

    expect(response.body.type).toBe('Fan');
    expect(response.body.name).toBe(name('TrocaTipo'));
  });

  it('11. PATCH vazio retorna 400', async () => {
    const created = await authed
      .post('/api/machines')
      .send({ name: name('PatchVazio'), type: 'Pump' })
      .expect(201);

    const response = await authed.patch(`/api/machines/${created.body.id}`).send({}).expect(400);
    expect(response.body.code).toBe('INVALID_MACHINE_PAYLOAD');
  });

  it('12. tipo inválido no PATCH retorna 400', async () => {
    const created = await authed
      .post('/api/machines')
      .send({ name: name('PatchTipo'), type: 'Pump' })
      .expect(201);

    const response = await authed
      .patch(`/api/machines/${created.body.id}`)
      .send({ type: 'Turbina' })
      .expect(400);

    expect(response.body.code).toBe('INVALID_MACHINE_TYPE');
  });

  it('13. nome duplicado no PATCH retorna 409', async () => {
    const ocupado = name('ConflitoPatchAlvo');
    await authed.post('/api/machines').send({ name: ocupado, type: 'Fan' }).expect(201);

    const created = await authed
      .post('/api/machines')
      .send({ name: name('ConflitoPatch'), type: 'Pump' })
      .expect(201);

    const response = await authed
      .patch(`/api/machines/${created.body.id}`)
      .send({ name: ocupado })
      .expect(409);

    expect(response.body.code).toBe('MACHINE_NAME_CONFLICT');
  });

  it('14. PATCH de ID inexistente retorna 404', async () => {
    const response = await authed
      .patch('/api/machines/00000000-0000-0000-0000-000000000000')
      .send({ name: name('Fantasma') })
      .expect(404);

    expect(response.body.code).toBe('MACHINE_NOT_FOUND');
  });

  it('15. DELETE remove e retorna 204 sem body', async () => {
    const created = await authed
      .post('/api/machines')
      .send({ name: name('Excluir'), type: 'Fan' })
      .expect(201);

    const response = await authed.delete(`/api/machines/${created.body.id}`).expect(204);
    expect(response.body).toEqual({});
  });

  it('16. DELETE de ID inexistente retorna 404', async () => {
    const response = await authed
      .delete('/api/machines/00000000-0000-0000-0000-000000000000')
      .expect(404);

    expect(response.body.code).toBe('MACHINE_NOT_FOUND');
  });

  it('17. após a exclusão, a máquina não aparece mais na listagem', async () => {
    const created = await authed
      .post('/api/machines')
      .send({ name: name('Sumico'), type: 'Pump' })
      .expect(201);

    await authed.delete(`/api/machines/${created.body.id}`).expect(204);

    const list = await authed.get('/api/machines').expect(200);
    const names = (list.body as Array<{ name: string }>).map((m) => m.name);
    expect(names).not.toContain(name('Sumico'));

    await authed.get(`/api/machines/${created.body.id}`).expect(404);
  });
});

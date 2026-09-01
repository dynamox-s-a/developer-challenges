/**
 * AUT-01. Exige o PostgreSQL local com migrações aplicadas (npm run db:up && npm run prisma:deploy).
 */
import { randomBytes, scryptSync } from 'node:crypto';

import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const EMAIL = 'auth-e2e@dynamox.local';
const PASSWORD = 'Senha-E2E@2026';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`;
}

describe('AUT-01 — login fixo, JWT e proteção de rotas', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let token: string;

  const http = () => request(app.getHttpServer());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);

    await prisma.user.upsert({
      where: { email: EMAIL },
      update: { passwordHash: hashPassword(PASSWORD) },
      create: { email: EMAIL, name: 'Usuário E2E', passwordHash: hashPassword(PASSWORD) },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    await app.close();
  });

  it('health continua público', async () => {
    await http().get('/api/health').expect(200);
  });

  it('login válido devolve JWT e usuário sem senha/hash', async () => {
    const res = await http()
      .post('/api/auth/login')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);

    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toEqual(
      expect.objectContaining({ email: EMAIL, name: 'Usuário E2E' }),
    );
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.user.password).toBeUndefined();
    token = res.body.token;
  });

  it('login inválido devolve 401 genérico (senha errada e e-mail inexistente iguais)', async () => {
    const wrongPassword = await http()
      .post('/api/auth/login')
      .send({ email: EMAIL, password: 'errada' })
      .expect(401);
    const unknownEmail = await http()
      .post('/api/auth/login')
      .send({ email: 'nao-existe@dynamox.local', password: PASSWORD })
      .expect(401);

    expect(wrongPassword.body.message).toBe(unknownEmail.body.message);
  });

  it('payload malformado devolve 400', async () => {
    await http().post('/api/auth/login').send({ email: EMAIL }).expect(400);
    await http()
      .post('/api/auth/login')
      .send({ email: 'sem-formato-de-email', password: PASSWORD })
      .expect(400);
  });

  it('GET /auth/me devolve o usuário autenticado sem campos sensíveis', async () => {
    const res = await http()
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toEqual(expect.objectContaining({ email: EMAIL }));
    expect(res.body.passwordHash).toBeUndefined();
  });

  it('rota privada sem token devolve 401', async () => {
    await http().get('/api/time-series').expect(401);
  });

  it('rota privada com token válido responde', async () => {
    await http().get('/api/time-series').set('Authorization', `Bearer ${token}`).expect(200);
  });

  it('token inválido devolve 401', async () => {
    await http().get('/api/time-series').set('Authorization', 'Bearer nao-e-um-jwt').expect(401);
  });

  it('token adulterado devolve 401', async () => {
    const [h, p] = token.split('.');
    const tampered = `${h}.${p}.assinatura-falsa`;
    await http().get('/api/time-series').set('Authorization', `Bearer ${tampered}`).expect(401);
  });

  it('token expirado devolve 401', async () => {
    const expired = await jwt.signAsync(
      { sub: 'qualquer', email: EMAIL },
      { expiresIn: '-1s' },
    );
    await http().get('/api/time-series').set('Authorization', `Bearer ${expired}`).expect(401);
  });
});

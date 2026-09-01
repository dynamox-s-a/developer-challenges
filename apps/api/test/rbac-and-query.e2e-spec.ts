/**
 * RBAC (ADMIN × VIEWER) e contratos de consulta da listagem de pontos.
 * Exige PostgreSQL local com migrações: `npm run db:up && npm run prisma:deploy`.
 *
 * Isolamento: fixtures com prefixo RBQ- e limpeza só desse prefixo. As asserções de
 * paginação/ordenação/busca usam um termo exclusivo das fixtures, de modo que o conteúdo
 * do banco (seed, outras suítes) não influencie os totais verificados.
 */
import { randomBytes, scryptSync } from 'node:crypto';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const PREFIX = 'RBQ-';
const ADMIN_EMAIL = 'rbq-admin@dynamox.local';
const VIEWER_EMAIL = 'rbq-viewer@dynamox.local';
const PASSWORD = 'Senha-E2E@2026';

interface PointItem {
  id: string;
  name: string;
  machine: { id: string; name: string; type: string };
  sensor: { serialNumber: string; model: string } | null;
}

function hash(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`;
}

describe('RBAC e contratos de consulta', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminBearer = '';
  let viewerBearer = '';
  let pumpId = '';
  let fanId = '';
  let pointWithoutSensorId = '';

  const http = () => request(app.getHttpServer());
  const asAdmin = (m: 'get' | 'post' | 'patch' | 'delete', url: string) =>
    http()[m](url).set('Authorization', adminBearer);
  const asViewer = (m: 'get' | 'post' | 'patch' | 'delete', url: string) =>
    http()[m](url).set('Authorization', viewerBearer);

  async function removeFixtures(): Promise<void> {
    await prisma.sensor.deleteMany({ where: { serialNumber: { startsWith: PREFIX } } });
    await prisma.machine.deleteMany({ where: { name: { startsWith: PREFIX } } });
  }

  async function login(email: string): Promise<string> {
    const response = await http()
      .post('/api/auth/login')
      .send({ email, password: PASSWORD })
      .expect(201);
    return `Bearer ${response.body.token as string}`;
  }

  /** Só as fixtures deste arquivo, varrendo todas as páginas do recorte. */
  async function listOurs(queryString: string): Promise<{ items: PointItem[]; body: Record<string, unknown> }> {
    const response = await asAdmin('get', `/api/monitoring-points?search=${PREFIX}&${queryString}`).expect(200);
    return { items: response.body.items as PointItem[], body: response.body as Record<string, unknown> };
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get(PrismaService);
    await removeFixtures();

    for (const [email, role, name] of [
      [ADMIN_EMAIL, 'ADMIN', 'RBQ Admin'],
      [VIEWER_EMAIL, 'VIEWER', 'RBQ Viewer'],
    ] as const) {
      await prisma.user.upsert({
        where: { email },
        update: { passwordHash: hash(PASSWORD), role },
        create: { email, name, passwordHash: hash(PASSWORD), role },
      });
    }
    adminBearer = await login(ADMIN_EMAIL);
    viewerBearer = await login(VIEWER_EMAIL);

    // 6 pontos: 4 numa Pump (3 com HF+, 1 sem sensor) e 2 numa Fan (TcAg e TcAs).
    pumpId = (await asAdmin('post', '/api/machines').send({ name: `${PREFIX}Bomba`, type: 'Pump' }).expect(201)).body.id;
    fanId = (await asAdmin('post', '/api/machines').send({ name: `${PREFIX}Ventilador`, type: 'Fan' }).expect(201)).body.id;

    const mk = async (machineId: string, suffix: string) =>
      (await asAdmin('post', '/api/monitoring-points').send({ machineId, name: `${PREFIX}${suffix}` }).expect(201))
        .body.id as string;

    const p1 = await mk(pumpId, 'Alfa');
    const p2 = await mk(pumpId, 'Bravo');
    const p3 = await mk(pumpId, 'Charlie');
    pointWithoutSensorId = await mk(pumpId, 'Delta');
    const f1 = await mk(fanId, 'Echo');
    const f2 = await mk(fanId, 'Foxtrot');

    await asAdmin('post', `/api/monitoring-points/${p1}/sensor`).send({ serialNumber: `${PREFIX}S1`, model: 'HF+' }).expect(201);
    await asAdmin('post', `/api/monitoring-points/${p2}/sensor`).send({ serialNumber: `${PREFIX}S2`, model: 'HF+' }).expect(201);
    await asAdmin('post', `/api/monitoring-points/${p3}/sensor`).send({ serialNumber: `${PREFIX}S3`, model: 'HF+' }).expect(201);
    await asAdmin('post', `/api/monitoring-points/${f1}/sensor`).send({ serialNumber: `${PREFIX}S4`, model: 'TcAg' }).expect(201);
    await asAdmin('post', `/api/monitoring-points/${f2}/sensor`).send({ serialNumber: `${PREFIX}S5`, model: 'TcAs' }).expect(201);
  }, 60000);

  afterAll(async () => {
    await removeFixtures();
    await prisma.user.deleteMany({ where: { email: { in: [ADMIN_EMAIL, VIEWER_EMAIL] } } });
    await app.close();
  });

  describe('perfis', () => {
    it('o token e /auth/me carregam o perfil de cada credencial', async () => {
      const admin = await asAdmin('get', '/api/auth/me').expect(200);
      const viewer = await asViewer('get', '/api/auth/me').expect(200);
      expect(admin.body.role).toBe('ADMIN');
      expect(viewer.body.role).toBe('VIEWER');
    });

    it('VIEWER lê todos os recursos de consulta', async () => {
      await asViewer('get', '/api/machines').expect(200);
      await asViewer('get', '/api/monitoring-points').expect(200);
      await asViewer('get', '/api/time-series').expect(200);
    });

    it('VIEWER recebe 403 (autenticado, sem permissão) em toda mutação', async () => {
      await asViewer('post', '/api/machines').send({ name: `${PREFIX}Proibida`, type: 'Fan' }).expect(403);
      await asViewer('patch', `/api/machines/${fanId}`).send({ name: `${PREFIX}Renomeada` }).expect(403);
      await asViewer('delete', `/api/machines/${fanId}`).expect(403);
      await asViewer('post', '/api/monitoring-points').send({ machineId: pumpId, name: `${PREFIX}X` }).expect(403);
      await asViewer('post', `/api/monitoring-points/${pointWithoutSensorId}/sensor`)
        .send({ serialNumber: `${PREFIX}S9`, model: 'HF+' })
        .expect(403);
      await asViewer('post', '/api/telemetry-cycles').send({}).expect(403);
    });

    it('a recusa ao VIEWER não altera o estado persistido', async () => {
      const before = await asAdmin('get', '/api/machines').expect(200);
      await asViewer('post', '/api/machines').send({ name: `${PREFIX}Fantasma`, type: 'Fan' }).expect(403);
      const after = await asAdmin('get', '/api/machines').expect(200);
      expect(after.body).toHaveLength(before.body.length);
      expect((after.body as Array<{ name: string }>).some((m) => m.name === `${PREFIX}Fantasma`)).toBe(false);
    });

    it('ADMIN continua podendo criar e excluir', async () => {
      const created = await asAdmin('post', '/api/machines').send({ name: `${PREFIX}Temp`, type: 'Fan' }).expect(201);
      await asAdmin('delete', `/api/machines/${created.body.id as string}`).expect(204);
    });

    it('sem token é 401 — distinto do 403 de quem está autenticado', async () => {
      await http().get('/api/machines').expect(401);
      await http().post('/api/machines').send({ name: 'x', type: 'Fan' }).expect(401);
      await http().get('/api/monitoring-points').expect(401);
    });

    it('token sem perfil reconhecível é recusado como sessão inválida', async () => {
      await http().get('/api/machines').set('Authorization', 'Bearer nao.e.um.jwt').expect(401);
    });
  });

  describe('paginação', () => {
    it('devolve no máximo o tamanho pedido e metadados coerentes', async () => {
      const { items, body } = await listOurs('page=1&pageSize=5');
      expect(items).toHaveLength(5);
      expect(body.total).toBe(6);
      expect(body.totalPages).toBe(2);
      expect(body.page).toBe(1);
      expect(body.pageSize).toBe(5);
    });

    it('a última página vem incompleta e sem repetir itens da primeira', async () => {
      const first = await listOurs('page=1&pageSize=5&sortBy=pointName&sortDir=asc');
      const last = await listOurs('page=2&pageSize=5&sortBy=pointName&sortDir=asc');
      expect(last.items).toHaveLength(1);
      const ids = new Set([...first.items, ...last.items].map((i) => i.id));
      expect(ids.size).toBe(6);
    });

    it('página além do fim devolve lista vazia mantendo o total', async () => {
      const { items, body } = await listOurs('page=99&pageSize=5');
      expect(items).toHaveLength(0);
      expect(body.total).toBe(6);
      expect(body.totalPages).toBe(2);
    });

    it('recorte sem resultado zera itens, total e páginas', async () => {
      const response = await asAdmin('get', '/api/monitoring-points?search=NAO-EXISTE-XYZ').expect(200);
      expect(response.body.items).toHaveLength(0);
      expect(response.body.total).toBe(0);
      expect(response.body.totalPages).toBe(0);
    });

    it('parâmetros de paginação inválidos são recusados', async () => {
      await asAdmin('get', '/api/monitoring-points?page=0').expect(400);
      await asAdmin('get', '/api/monitoring-points?page=-1').expect(400);
      await asAdmin('get', '/api/monitoring-points?pageSize=0').expect(400);
      await asAdmin('get', '/api/monitoring-points?page=abc').expect(400);
      await asAdmin('get', '/api/monitoring-points?parametroInventado=1').expect(400);
    });
  });

  describe('ordenação', () => {
    const value = (item: PointItem, column: string): string =>
      ({
        machineName: item.machine.name,
        machineType: item.machine.type,
        pointName: item.name,
        sensorModel: item.sensor?.model ?? '',
      })[column] ?? '';

    for (const column of ['machineName', 'machineType', 'pointName', 'sensorModel']) {
      for (const direction of ['asc', 'desc']) {
        it(`ordena por ${column} ${direction} de ponta a ponta`, async () => {
          const { items } = await listOurs(`pageSize=50&sortBy=${column}&sortDir=${direction}`);
          expect(items).toHaveLength(6);
          // Pontos sem sensor ficam por último nos dois sentidos: ausência de dado não
          // compete na ordenação alfabética.
          const values = items.map((i) => value(i, column)).filter((v) => v !== '');
          const sorted = [...values].sort((a, b) => a.localeCompare(b, 'pt-BR'));
          if (direction === 'desc') sorted.reverse();
          expect(values).toEqual(sorted);
        });
      }
    }

    it('empates têm ordem estável entre requisições', async () => {
      const first = await listOurs('pageSize=50&sortBy=machineType&sortDir=asc');
      const second = await listOurs('pageSize=50&sortBy=machineType&sortDir=asc');
      expect(second.items.map((i) => i.id)).toEqual(first.items.map((i) => i.id));
    });

    it('coluna fora da whitelist é recusada', async () => {
      await asAdmin('get', '/api/monitoring-points?sortBy=passwordHash').expect(400);
      await asAdmin('get', '/api/monitoring-points?sortDir=aleatorio').expect(400);
    });
  });

  describe('busca', () => {
    it('encontra pelo nome da máquina', async () => {
      const response = await asAdmin('get', `/api/monitoring-points?search=${PREFIX}Ventilador`).expect(200);
      expect(response.body.total).toBe(2);
      expect((response.body.items as PointItem[]).every((i) => i.machine.name === `${PREFIX}Ventilador`)).toBe(true);
    });

    it('encontra pelo nome do ponto', async () => {
      const response = await asAdmin('get', `/api/monitoring-points?search=${PREFIX}Charlie`).expect(200);
      expect(response.body.total).toBe(1);
      expect((response.body.items as PointItem[])[0].name).toBe(`${PREFIX}Charlie`);
    });

    it('encontra pela série do sensor', async () => {
      const response = await asAdmin('get', `/api/monitoring-points?search=${PREFIX}S4`).expect(200);
      expect(response.body.total).toBe(1);
      expect((response.body.items as PointItem[])[0].sensor?.serialNumber).toBe(`${PREFIX}S4`);
    });

    it('ignora diferença de caixa', async () => {
      const upper = await asAdmin('get', `/api/monitoring-points?search=${PREFIX}charlie`).expect(200);
      expect(upper.body.total).toBe(1);
    });

    it('sem correspondência devolve vazio em vez da lista inteira', async () => {
      const response = await asAdmin('get', '/api/monitoring-points?search=zzz-nada-zzz').expect(200);
      expect(response.body.items).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('trata curingas do LIKE como texto literal', async () => {
      const response = await asAdmin('get', '/api/monitoring-points?search=%25').expect(200);
      expect(response.body.total).toBe(0);
    });

    it('busca longa demais é recusada', async () => {
      await asAdmin('get', `/api/monitoring-points?search=${'x'.repeat(200)}`).expect(400);
    });
  });

  describe('filtros', () => {
    it('filtra por tipo de máquina', async () => {
      const pump = await listOurs('pageSize=50&machineType=Pump');
      const fan = await listOurs('pageSize=50&machineType=Fan');
      expect(pump.body.total).toBe(4);
      expect(fan.body.total).toBe(2);
      expect(pump.items.every((i) => i.machine.type === 'Pump')).toBe(true);
    });

    it('filtra por modelo de sensor', async () => {
      // "HF+" precisa viajar codificado: '+' cru numa query string significa espaço.
      const { items, body } = await listOurs(`pageSize=50&sensorModel=${encodeURIComponent('HF+')}`);
      expect(body.total).toBe(3);
      expect(items.every((i) => i.sensor?.model === 'HF+')).toBe(true);
    });

    it('separa pontos com e sem sensor', async () => {
      const withSensor = await listOurs('pageSize=50&hasSensor=true');
      const without = await listOurs('pageSize=50&hasSensor=false');
      expect(withSensor.body.total).toBe(5);
      expect(without.body.total).toBe(1);
      expect(without.items[0].sensor).toBeNull();
    });

    it('valor de filtro inválido é recusado em vez de ignorado', async () => {
      await asAdmin('get', '/api/monitoring-points?machineType=Motor').expect(400);
      await asAdmin('get', '/api/monitoring-points?sensorModel=XYZ').expect(400);
      // '+' não codificado chega como espaço e não corresponde a nenhum modelo.
      await asAdmin('get', '/api/monitoring-points?sensorModel=HF+').expect(400);
      await asAdmin('get', '/api/monitoring-points?hasSensor=talvez').expect(400);
    });

    it('a resposta ecoa o recorte aplicado', async () => {
      const response = await asAdmin('get', `/api/monitoring-points?search=${PREFIX}&machineType=Pump&hasSensor=true`).expect(200);
      expect(response.body.search).toBe(PREFIX);
      expect(response.body.machineType).toBe('Pump');
      expect(response.body.hasSensor).toBe(true);
      expect(response.body.sensorModel).toBeNull();
    });
  });

  describe('composição de consulta', () => {
    it('busca + filtro + ordenação + página convivem com total coerente', async () => {
      const query = `search=${PREFIX}&machineType=Pump&hasSensor=true&sortBy=pointName&sortDir=desc`;
      const page1 = await asAdmin('get', `/api/monitoring-points?${query}&page=1&pageSize=2`).expect(200);
      const page2 = await asAdmin('get', `/api/monitoring-points?${query}&page=2&pageSize=2`).expect(200);

      expect(page1.body.total).toBe(3);
      expect(page1.body.totalPages).toBe(2);
      expect(page1.body.items).toHaveLength(2);
      expect(page2.body.items).toHaveLength(1);

      const names = [...(page1.body.items as PointItem[]), ...(page2.body.items as PointItem[])].map((i) => i.name);
      expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a, 'pt-BR')));
      expect(new Set(names).size).toBe(3);
    });

    it('o total do recorte não é o total da tabela', async () => {
      const all = await asAdmin('get', '/api/monitoring-points?pageSize=1').expect(200);
      const scoped = await asAdmin('get', `/api/monitoring-points?search=${PREFIX}&pageSize=1`).expect(200);
      expect(scoped.body.total).toBe(6);
      expect(all.body.total).toBeGreaterThan(scoped.body.total);
    });

    it('VIEWER consulta com o mesmo contrato de recorte', async () => {
      const response = await asViewer('get', `/api/monitoring-points?search=${PREFIX}&machineType=Fan&pageSize=50`).expect(200);
      expect(response.body.total).toBe(2);
    });
  });
});

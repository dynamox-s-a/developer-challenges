/**
 * MON-01…06 — Pontos de monitoramento e sensores. Exige o PostgreSQL local com
 * migrações aplicadas: `npm run db:up && npm run prisma:deploy`.
 *
 * Isolamento: fixtures com prefixo MON- e limpeza apenas desse prefixo, preservando o
 * seed e as fixtures das outras suítes. Como a listagem é global e paginada, os testes
 * de paginação/ordenação afirmam sobre o conjunto filtrado pelas próprias fixtures,
 * usando pageSize alto o bastante para enxergar todas.
 */
import { randomBytes, scryptSync } from 'node:crypto';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const PREFIX = 'MON-';
const USER_EMAIL = 'monitoring-e2e@dynamox.local';
const USER_PASSWORD = 'Senha-E2E@2026';

const name = (suffix: string) => `${PREFIX}${suffix}`;

interface PointItem {
  id: string;
  name: string;
  machine: { id: string; name: string; type: string };
  sensor: { id: string; serialNumber: string; model: string } | null;
}

describe('MON-01…06 — pontos de monitoramento e sensores', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let bearer = '';

  const http = () => request(app.getHttpServer());
  const authed = {
    get: (url: string) => http().get(url).set('Authorization', bearer),
    post: (url: string) => http().post(url).set('Authorization', bearer),
    patch: (url: string) => http().patch(url).set('Authorization', bearer),
  };

  async function removeFixtures(): Promise<void> {
    await prisma.sensor.deleteMany({ where: { serialNumber: { startsWith: PREFIX } } });
    await prisma.machine.deleteMany({ where: { name: { startsWith: PREFIX } } });
  }

  async function createMachine(suffix: string, type: 'Pump' | 'Fan'): Promise<string> {
    const response = await authed
      .post('/api/machines')
      .send({ name: name(suffix), type })
      .expect(201);
    return response.body.id as string;
  }

  async function createPoint(machineId: string, suffix: string): Promise<string> {
    const response = await authed
      .post('/api/monitoring-points')
      .send({ machineId, name: name(suffix) })
      .expect(201);
    return response.body.id as string;
  }

  /**
   * Lista completa filtrada pelas fixtures deste arquivo. Percorre TODAS as páginas:
   * num banco com muitos pontos alheios, olhar só a primeira página deixaria o teste
   * cego (vetor vazio passa em asserção de ordenação por vacuidade).
   */
  async function listOurs(sortBy: string, sortDir: string): Promise<PointItem[]> {
    const all: PointItem[] = [];
    for (let page = 1; ; page += 1) {
      const response = await authed
        .get(`/api/monitoring-points?page=${page}&pageSize=50&sortBy=${sortBy}&sortDir=${sortDir}`)
        .expect(200);
      const items = response.body.items as PointItem[];
      all.push(...items);
      if (items.length === 0 || page * response.body.pageSize >= response.body.total) break;
    }
    return all.filter((item) => item.machine.name.startsWith(PREFIX));
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
        name: 'Monitoramento E2E',
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

  it('1. rotas de pontos sem token retornam 401', async () => {
    await http().get('/api/monitoring-points').expect(401);
    await http().post('/api/monitoring-points').send({ machineId: 'x', name: 'y' }).expect(401);
    await http()
      .post('/api/monitoring-points/qualquer/sensor')
      .send({ serialNumber: 'x', model: 'HF+' })
      .expect(401);
  });

  it('2. cria um ponto para uma máquina existente', async () => {
    const machineId = await createMachine('Criar', 'Fan');

    const response = await authed
      .post('/api/monitoring-points')
      .send({ machineId, name: name('Mancal LA') })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: name('Mancal LA'),
        machine: expect.objectContaining({ id: machineId, type: 'Fan' }),
        sensor: null,
      }),
    );
  });

  it('3. máquina inexistente retorna 404', async () => {
    const response = await authed
      .post('/api/monitoring-points')
      .send({ machineId: '00000000-0000-0000-0000-000000000000', name: name('Orfao') })
      .expect(404);

    expect(response.body.code).toBe('MACHINE_NOT_FOUND');
  });

  it('4. payload inválido retorna 400 (vazio, longo, chave desconhecida)', async () => {
    const machineId = await createMachine('Payload', 'Fan');

    await authed.post('/api/monitoring-points').send({ machineId, name: '   ' }).expect(400);
    await authed
      .post('/api/monitoring-points')
      .send({ machineId, name: 'x'.repeat(121) })
      .expect(400);

    const response = await authed
      .post('/api/monitoring-points')
      .send({ machineId, name: name('Extra'), rpm: 1750 })
      .expect(400);
    expect(response.body.code).toBe('INVALID_MONITORING_POINT_PAYLOAD');
    expect(response.body.message).toMatch(/rpm/);
  });

  it('5. nome duplicado na mesma máquina retorna 409; em outra máquina, é aceito', async () => {
    const first = await createMachine('DupA', 'Fan');
    const second = await createMachine('DupB', 'Fan');
    await createPoint(first, 'Mancal Dup');

    const conflict = await authed
      .post('/api/monitoring-points')
      .send({ machineId: first, name: name('Mancal Dup') })
      .expect(409);
    expect(conflict.body.code).toBe('MONITORING_POINT_NAME_CONFLICT');

    await authed
      .post('/api/monitoring-points')
      .send({ machineId: second, name: name('Mancal Dup') })
      .expect(201);
  });

  it('6. associa sensores compatíveis (Fan aceita TcAg; Pump aceita HF+)', async () => {
    const fanId = await createMachine('FanOk', 'Fan');
    const pumpId = await createMachine('PumpOk', 'Pump');
    const fanPoint = await createPoint(fanId, 'P Fan');
    const pumpPoint = await createPoint(pumpId, 'P Pump');

    const fanResponse = await authed
      .post(`/api/monitoring-points/${fanPoint}/sensor`)
      .send({ serialNumber: name('TCAG-1'), model: 'TcAg' })
      .expect(201);
    expect(fanResponse.body.sensor).toEqual(
      expect.objectContaining({ serialNumber: name('TCAG-1'), model: 'TcAg' }),
    );

    const pumpResponse = await authed
      .post(`/api/monitoring-points/${pumpPoint}/sensor`)
      .send({ serialNumber: name('HF-1'), model: 'HF+' })
      .expect(201);
    // O enum interno do Prisma nunca vaza para a resposta.
    expect(pumpResponse.body.sensor.model).toBe('HF+');
  });

  it('7. Pump rejeita TcAg e TcAs com 409', async () => {
    const pumpId = await createMachine('PumpProibe', 'Pump');
    const point = await createPoint(pumpId, 'P Proibido');

    for (const model of ['TcAg', 'TcAs']) {
      const response = await authed
        .post(`/api/monitoring-points/${point}/sensor`)
        .send({ serialNumber: name(`Proibido-${model}`), model })
        .expect(409);
      expect(response.body.code).toBe('SENSOR_MODEL_NOT_ALLOWED');
    }

    // A recusa não deixa sensor órfão para trás.
    const orphans = await prisma.sensor.count({
      where: { serialNumber: { startsWith: name('Proibido-') } },
    });
    expect(orphans).toBe(0);
  });

  it('8. modelo inválido retorna 400', async () => {
    const fanId = await createMachine('ModeloRuim', 'Fan');
    const point = await createPoint(fanId, 'P Modelo');

    const response = await authed
      .post(`/api/monitoring-points/${point}/sensor`)
      .send({ serialNumber: name('Ruim-1'), model: 'HF' })
      .expect(400);
    expect(response.body.code).toBe('INVALID_SENSOR_MODEL');
  });

  it('9. ponto inexistente retorna 404 na associação', async () => {
    const response = await authed
      .post('/api/monitoring-points/00000000-0000-0000-0000-000000000000/sensor')
      .send({ serialNumber: name('Fantasma'), model: 'HF+' })
      .expect(404);
    expect(response.body.code).toBe('MONITORING_POINT_NOT_FOUND');
  });

  it('10. identificador de sensor é único entre todos os pontos', async () => {
    const fanId = await createMachine('SerialDup', 'Fan');
    const pointA = await createPoint(fanId, 'P Serial A');
    const pointB = await createPoint(fanId, 'P Serial B');
    const serial = name('SERIAL-UNICO');

    await authed
      .post(`/api/monitoring-points/${pointA}/sensor`)
      .send({ serialNumber: serial, model: 'TcAs' })
      .expect(201);

    const response = await authed
      .post(`/api/monitoring-points/${pointB}/sensor`)
      .send({ serialNumber: serial, model: 'TcAs' })
      .expect(409);
    expect(response.body.code).toBe('SENSOR_SERIAL_CONFLICT');
  });

  it('11. um ponto aceita no máximo um sensor', async () => {
    const fanId = await createMachine('UmSensor', 'Fan');
    const point = await createPoint(fanId, 'P Um Sensor');

    await authed
      .post(`/api/monitoring-points/${point}/sensor`)
      .send({ serialNumber: name('UNICO-1'), model: 'TcAg' })
      .expect(201);

    const response = await authed
      .post(`/api/monitoring-points/${point}/sensor`)
      .send({ serialNumber: name('UNICO-2'), model: 'TcAg' })
      .expect(409);
    expect(response.body.code).toBe('MONITORING_POINT_SENSOR_CONFLICT');
  });

  it('12. PATCH que tornaria a máquina Pump com TcAg/TcAs é recusado com 409', async () => {
    const fanId = await createMachine('ViraPump', 'Fan');
    const point = await createPoint(fanId, 'P Vira Pump');
    await authed
      .post(`/api/monitoring-points/${point}/sensor`)
      .send({ serialNumber: name('VIRA-TCAG'), model: 'TcAg' })
      .expect(201);

    const response = await authed
      .patch(`/api/machines/${fanId}`)
      .send({ type: 'Pump' })
      .expect(409);
    expect(response.body.code).toBe('MACHINE_TYPE_SENSOR_CONFLICT');
    expect(response.body.message).toMatch(name('VIRA-TCAG'));

    // O rollback preserva o tipo original.
    const machine = await authed.get(`/api/machines/${fanId}`).expect(200);
    expect(machine.body.type).toBe('Fan');
  });

  it('13. PATCH para Pump é aceito quando os sensores são compatíveis', async () => {
    const fanId = await createMachine('ViraPumpOk', 'Fan');
    const point = await createPoint(fanId, 'P Vira Pump Ok');
    await authed
      .post(`/api/monitoring-points/${point}/sensor`)
      .send({ serialNumber: name('VIRA-HF'), model: 'HF+' })
      .expect(201);

    const response = await authed
      .patch(`/api/machines/${fanId}`)
      .send({ type: 'Pump' })
      .expect(200);
    expect(response.body.type).toBe('Pump');
  });

  describe('listagem paginada e ordenável (fixtures próprias)', () => {
    /**
     * 7 pontos em 3 máquinas, montados para as ordenações serem discriminantes:
     *   MON-Lista Alfa   (Fan)  → pontos A1 (TcAs), A2 (HF+)
     *   MON-Lista Beta   (Pump) → pontos B1 (HF+), B2 (sem sensor)
     *   MON-Lista Gama   (Fan)  → pontos C1 (TcAg), C2, C3 (sem sensor)
     */
    let listReady = false;

    async function ensureListFixtures(): Promise<void> {
      if (listReady) return;
      const alfa = await createMachine('Lista Alfa', 'Fan');
      const beta = await createMachine('Lista Beta', 'Pump');
      const gama = await createMachine('Lista Gama', 'Fan');

      const a1 = await createPoint(alfa, 'Ponto A1');
      await createPoint(alfa, 'Ponto A2').then(async (a2) => {
        await authed
          .post(`/api/monitoring-points/${a2}/sensor`)
          .send({ serialNumber: name('LST-A2'), model: 'HF+' })
          .expect(201);
      });
      await authed
        .post(`/api/monitoring-points/${a1}/sensor`)
        .send({ serialNumber: name('LST-A1'), model: 'TcAs' })
        .expect(201);

      const b1 = await createPoint(beta, 'Ponto B1');
      await createPoint(beta, 'Ponto B2');
      await authed
        .post(`/api/monitoring-points/${b1}/sensor`)
        .send({ serialNumber: name('LST-B1'), model: 'HF+' })
        .expect(201);

      const c1 = await createPoint(gama, 'Ponto C1');
      await createPoint(gama, 'Ponto C2');
      await createPoint(gama, 'Ponto C3');
      await authed
        .post(`/api/monitoring-points/${c1}/sensor`)
        .send({ serialNumber: name('LST-C1'), model: 'TcAg' })
        .expect(201);

      listReady = true;
    }

    it('14. pagina de 5 em 5 por padrão, com total e página corretos', async () => {
      await ensureListFixtures();

      const first = await authed.get('/api/monitoring-points').expect(200);
      expect(first.body.pageSize).toBe(5);
      expect(first.body.page).toBe(1);
      expect(first.body.items.length).toBeLessThanOrEqual(5);
      expect(first.body.total).toBeGreaterThanOrEqual(7);

      // Percorrendo todas as páginas, cada ponto aparece exatamente uma vez.
      const seen: string[] = [];
      const totalPages = Math.ceil(first.body.total / 5);
      for (let page = 1; page <= totalPages; page += 1) {
        const response = await authed.get(`/api/monitoring-points?page=${page}`).expect(200);
        seen.push(...(response.body.items as PointItem[]).map((item) => item.id));
      }
      expect(seen.length).toBe(first.body.total);
      expect(new Set(seen).size).toBe(seen.length);
    });

    it('15. ordena por nome da máquina nos dois sentidos', async () => {
      await ensureListFixtures();

      const asc = (await listOurs('machineName', 'asc')).map((i) => i.machine.name);
      expect(asc).toEqual([...asc].sort((a, b) => a.localeCompare(b, 'en')));

      const desc = (await listOurs('machineName', 'desc')).map((i) => i.machine.name);
      expect(desc).toEqual([...asc].reverse());
    });

    it('16. ordena por tipo de máquina pelo vocabulário público (Fan < Pump)', async () => {
      await ensureListFixtures();

      const asc = (await listOurs('machineType', 'asc')).map((i) => i.machine.type);
      const firstPump = asc.indexOf('Pump');
      // Nenhum Fan pode aparecer depois do primeiro Pump.
      expect(firstPump).toBeGreaterThan(0);
      expect(asc.slice(firstPump)).toEqual(Array(asc.length - firstPump).fill('Pump'));

      const desc = (await listOurs('machineType', 'desc')).map((i) => i.machine.type);
      expect(desc[0]).toBe('Pump');
      expect(desc[desc.length - 1]).toBe('Fan');
    });

    it('17. ordena por nome do ponto nos dois sentidos', async () => {
      await ensureListFixtures();

      const asc = (await listOurs('pointName', 'asc')).map((i) => i.name);
      expect(asc).toEqual([...asc].sort((a, b) => a.localeCompare(b, 'en')));

      const desc = (await listOurs('pointName', 'desc')).map((i) => i.name);
      expect(desc).toEqual([...asc].reverse());
    });

    it('18. ordena por modelo de sensor pelo rótulo público, nulos por último', async () => {
      await ensureListFixtures();

      const asc = await listOurs('sensorModel', 'asc');
      const models = asc.map((i) => i.sensor?.model ?? null);
      const withSensor = models.filter((m): m is string => m !== null);

      // Rótulo público: HF+ < TcAg < TcAs (e não a ordem do enum interno do banco).
      expect(withSensor).toEqual([...withSensor].sort((a, b) => a.localeCompare(b, 'en')));
      expect(withSensor[0]).toBe('HF+');
      // Pontos sem sensor sempre no fim, independentemente da direção.
      expect(models.slice(withSensor.length)).toEqual(
        Array(models.length - withSensor.length).fill(null),
      );

      const descModels = (await listOurs('sensorModel', 'desc')).map(
        (i) => i.sensor?.model ?? null,
      );
      const descWithSensor = descModels.filter((m): m is string => m !== null);
      expect(descWithSensor[0]).toBe('TcAs');
      expect(descModels.slice(descWithSensor.length)).toEqual(
        Array(descModels.length - descWithSensor.length).fill(null),
      );
    });

    it('19. parâmetros de listagem inválidos retornam 400', async () => {
      for (const query of ['page=0', 'page=abc', 'pageSize=51', 'sortBy=id', 'sortDir=up']) {
        const response = await authed.get(`/api/monitoring-points?${query}`).expect(400);
        expect(response.body.code).toBe('INVALID_MONITORING_POINT_QUERY');
      }
    });

    it('20. parâmetro desconhecido na query retorna 400, não é ignorado', async () => {
      const response = await authed
        .get('/api/monitoring-points?sortBy=machineName&injetado=x')
        .expect(400);
      expect(response.body.code).toBe('INVALID_MONITORING_POINT_QUERY');
      expect(response.body.message).toMatch(/injetado/);
    });

    it('21. page gigante (fora do inteiro seguro) retorna 400, nunca 500', async () => {
      // A regex aceita, mas Number() viraria Infinity/imprecisão e estouraria no OFFSET.
      const huge = '9'.repeat(400);
      for (const query of [`page=${huge}`, `page=${Number.MAX_SAFE_INTEGER + 1}`, 'page=100001']) {
        const response = await authed.get(`/api/monitoring-points?${query}`).expect(400);
        expect(response.body.code).toBe('INVALID_MONITORING_POINT_QUERY');
      }
    });
  });

  describe('concorrência: PATCH → Pump versus associação de TcAg', () => {
    /**
     * Dispara as duas operações em paralelo, sem sleeps: o lock na linha da máquina
     * serializa os fluxos, então só existem dois desfechos legais —
     *   (a) a associação venceu: sensor 201 e PATCH 409 (MACHINE_TYPE_SENSOR_CONFLICT);
     *   (b) o PATCH venceu: máquina 200 e sensor 409 (SENSOR_MODEL_NOT_ALLOWED).
     * Qualquer outra combinação (em especial ambos 2xx) violaria a regra do enunciado.
     * O invariante final é verificado direto no banco, iterando para dar chance às duas
     * intercalações.
     */
    const ITERATIONS = 5;

    it('22. nunca deixa uma Pump com sensor TcAg, qualquer que seja a intercalação', async () => {
      for (let round = 0; round < ITERATIONS; round += 1) {
        const machineId = await createMachine(`Corrida-${round}`, 'Fan');
        const pointId = await createPoint(machineId, `P Corrida ${round}`);

        const [patchResult, assignResult] = await Promise.all([
          authed.patch(`/api/machines/${machineId}`).send({ type: 'Pump' }),
          authed
            .post(`/api/monitoring-points/${pointId}/sensor`)
            .send({ serialNumber: name(`CORRIDA-${round}`), model: 'TcAg' }),
        ]);

        const outcome = `patch=${patchResult.status},assign=${assignResult.status}`;
        expect(['patch=200,assign=409', 'patch=409,assign=201']).toContain(outcome);
        if (patchResult.status === 409) {
          expect(patchResult.body.code).toBe('MACHINE_TYPE_SENSOR_CONFLICT');
        }
        if (assignResult.status === 409) {
          expect(assignResult.body.code).toBe('SENSOR_MODEL_NOT_ALLOWED');
        }

        // Invariante no banco: se a máquina terminou Pump, nenhum TcAg/TcAs ligado a ela.
        const machine = await prisma.machine.findUniqueOrThrow({ where: { id: machineId } });
        const blocked = await prisma.sensor.count({
          where: {
            monitoringPoint: { machineId },
            model: { in: ['TC_AG', 'TC_AS'] },
          },
        });
        if (machine.type === 'PUMP') expect(blocked).toBe(0);
        else expect(blocked).toBe(1);
      }
    });
  });
});

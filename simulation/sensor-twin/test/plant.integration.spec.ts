/**
 * Integração do bootstrap da planta (F2, testes 12–17): a instalação sintética nasce e
 * é reconciliada EXCLUSIVAMENTE pelas APIs reais. Exige db + API no ar; roda somente
 * via `npm run twin:integration`.
 *
 * Idempotente por design: a 1ª execução em banco seedado cria 5 máquinas + 10 pontos +
 * 10 sensores (P-101 e seus 2 pontos/sensores já vêm do seed); as seguintes não criam
 * nada. Nenhuma limpeza: a planta É o artefato de demonstração.
 */
import {
  createMachineApi,
  fetchAllMonitoringPoints,
  ingestCycle,
  listMachines,
  loadTwinConfig,
  login,
  type TwinApiConfig,
} from '../src/ingest';
import { ensurePlant, type PlantBootstrapResult } from '../src/bootstrap';
import { identityFor } from '../src/fleet';
import { buildCycle } from '../src/payload';
import { PLANT, plantSensors, type PlantManifest } from '../src/plant';

const clonePlant = (): PlantManifest => JSON.parse(JSON.stringify(PLANT)) as PlantManifest;

describe('F2 — bootstrap idempotente da planta pelas APIs reais', () => {
  let config: TwinApiConfig;
  let token: string;
  let firstRun: PlantBootstrapResult;

  beforeAll(async () => {
    config = loadTwinConfig();
    token = await login(config);
  });

  it('12. primeira execução materializa a planta (6 máquinas, 12 pontos, 12 sensores)', async () => {
    firstRun = await ensurePlant(config, token, PLANT);

    for (const category of [firstRun.machines, firstRun.points, firstRun.sensors]) {
      expect(category.created + category.existing).toBeGreaterThan(0);
    }
    expect(firstRun.machines.created + firstRun.machines.existing).toBe(6);
    expect(firstRun.points.created + firstRun.points.existing).toBe(12);
    expect(firstRun.sensors.created + firstRun.sensors.existing).toBe(12);

    // Prova pela API, nunca por suposição: as 6 máquinas e os 12 pontos/sensores
    // esperados existem com as identidades exatas do manifest.
    const machines = await listMachines(config, token);
    for (const asset of PLANT.assets) {
      const machine = machines.find((m) => m.name === asset.machineName);
      expect(machine).toBeDefined();
      expect(machine!.type).toBe(asset.machineType);
    }

    const points = await fetchAllMonitoringPoints(config, token);
    for (const sensor of plantSensors()) {
      const point = points.find(
        (p) => p.machine.name === sensor.machineName && p.name === sensor.pointName,
      );
      expect(point).toBeDefined();
      expect(point!.sensor).toMatchObject({
        serialNumber: sensor.sensorSerial,
        model: sensor.sensorModel,
      });
    }
  });

  it('13. segunda execução não duplica nada: created=0, existing=6/12/12', async () => {
    const secondRun = await ensurePlant(config, token, PLANT);
    expect(secondRun.machines).toEqual({ created: 0, existing: 6 });
    expect(secondRun.points).toEqual({ created: 0, existing: 12 });
    expect(secondRun.sensors).toEqual({ created: 0, existing: 12 });
    // resourceIds resolvidos são estáveis entre execuções.
    expect([...secondRun.resourceIds.entries()].sort()).toEqual(
      [...firstRun.resourceIds.entries()].sort(),
    );
  });

  it('14. a reconciliação enxerga TODAS as páginas de pontos (paginação completa)', async () => {
    const all = await fetchAllMonitoringPoints(config, token);
    expect(all.length).toBeGreaterThanOrEqual(12);
    const plantPoints = all.filter((p) =>
      plantSensors().some(
        (s) => s.machineName === p.machine.name && s.pointName === p.name,
      ),
    );
    expect(plantPoints).toHaveLength(12);
    // Nenhuma identidade duplicada veio da varredura.
    expect(new Set(all.map((p) => p.id)).size).toBe(all.length);
  });

  it('15. 409 reconciliável: criar máquina já existente conflita, e o ensure aceita o estado', async () => {
    const attempt = await createMachineApi(config, token, PLANT.assets[1].machineName, 'Pump');
    expect(attempt.status).toBe(409);

    const after = await ensurePlant(config, token, PLANT);
    expect(after.machines.created).toBe(0);
  });

  it('16. divergência REAL falha alto: tipo de máquina e sensor divergentes são drift', async () => {
    const wrongType = clonePlant();
    wrongType.assets[0].machineType = 'Fan';
    // A validação do manifest recusa antes (Pump→HF+ ok em Fan), então o drift certo é
    // detectado pela comparação com a API: P-101 existe como Pump.
    await expect(ensurePlant(config, token, wrongType)).rejects.toThrow(/existe como Pump/);

    const wrongSensor = clonePlant();
    wrongSensor.assets[0].points[0].sensorSerial = 'SIM-HF-999';
    await expect(ensurePlant(config, token, wrongSensor)).rejects.toThrow(
      /já tem o sensor SIM-HF-001/,
    );
  });

  it('17. resourceId pós-bootstrap é ingerível; resourceId errado é recusado pela API', async () => {
    const sensor = plantSensors().find((s) => s.resourceIdStrategy === 'api-machine-id')!;
    const overrides = {
      seed: sensor.seed,
      rpm: sensor.rpm,
      loadPercent: sensor.loadPercent,
      baseTimestamp: PLANT.windows.baseline,
    };

    const good = buildCycle('normal', overrides, identityFor(sensor, firstRun.resourceIds));
    const result = await ingestCycle(config, token, good);
    expect([200, 201]).toContain(result.status);
    expect(result.body.payloadFingerprint).toBe(good.fingerprint);

    // Contra-prova: um resourceId inventado é 422 RESOURCE_ID_MISMATCH — a checagem
    // do backend está viva e o twin depende dela, não a contorna.
    const bad = buildCycle('normal', overrides, {
      ...identityFor(sensor, firstRun.resourceIds),
      resourceId: 'a'.repeat(24),
    });
    await expect(ingestCycle(config, token, bad)).rejects.toThrow(/RESOURCE_ID_MISMATCH/);
  });
});

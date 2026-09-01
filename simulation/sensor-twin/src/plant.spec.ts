/**
 * Invariantes do plant manifest (testes 1–8 do ciclo F1–F3): a fonte única da planta
 * precisa ser internamente coerente ANTES de qualquer bootstrap ou geração.
 */
import { PLANT, plantSensors, validatePlantManifest, type PlantManifest } from './plant';

/** Clone mutável para testes de invariante. */
const clonePlant = (): PlantManifest => JSON.parse(JSON.stringify(PLANT)) as PlantManifest;

describe('plant manifest — topologia canônica', () => {
  it('1. o manifest padrão é válido', () => {
    expect(() => validatePlantManifest(PLANT)).not.toThrow();
  });

  it('2–4. exatamente 6 máquinas, 12 pontos e 12 sensores', () => {
    expect(PLANT.assets).toHaveLength(6);
    const sensors = plantSensors();
    expect(sensors).toHaveLength(12);
    expect(new Set(sensors.map((s) => `${s.machineName}::${s.pointName}`)).size).toBe(12);
  });

  it('5. exatamente 2 pontos por máquina (DE e NDE)', () => {
    for (const asset of PLANT.assets) {
      expect(asset.points).toHaveLength(2);
      expect(asset.points.map((p) => p.shortLabel).sort()).toEqual(['DE', 'NDE']);
    }
  });

  it('6. serials únicos e seeds únicas/determinísticas', () => {
    const sensors = plantSensors();
    expect(new Set(sensors.map((s) => s.sensorSerial)).size).toBe(12);
    expect(new Set(sensors.map((s) => s.seed)).size).toBe(12);
    // Canônico do single-sensor preservado: SIM-HF-001 continua com seed 42.
    expect(sensors.find((s) => s.sensorSerial === 'SIM-HF-001')?.seed).toBe(42);
  });

  it('7. Pumps recebem exclusivamente HF+; Fans exibem os três modelos', () => {
    const sensors = plantSensors();
    for (const s of sensors.filter((x) => x.machineType === 'Pump')) {
      expect(s.sensorModel).toBe('HF+');
    }
    const fanModels = new Set(
      sensors.filter((x) => x.machineType === 'Fan').map((s) => s.sensorModel),
    );
    expect([...fanModels].sort()).toEqual(['HF+', 'TcAg', 'TcAs']);
  });

  it('8. exatamente um condition target, e é P-101/NDE (SIM-HF-002, HF+)', () => {
    const sensors = plantSensors();
    const targets = sensors.filter(
      (s) => s.sensorSerial === PLANT.conditionTarget.sensorSerial,
    );
    expect(targets).toHaveLength(1);
    expect(targets[0]).toMatchObject({
      machineName: 'P-101',
      shortLabel: 'NDE',
      sensorModel: 'HF+',
    });
  });
});

describe('plant manifest — resourceId e janelas', () => {
  it('os 2 pontos do seed usam hexes fixos; os 10 novos usam derivação por machine.id', () => {
    const sensors = plantSensors();
    const seedPoints = sensors.filter((s) => s.resourceIdStrategy === 'seed-name');
    expect(seedPoints.map((s) => s.fixedResourceId).sort()).toEqual([
      '42d726ba50f8645df08dba9f',
      '8c7f0433523f53a860d7b17f',
    ]);
    expect(sensors.filter((s) => s.resourceIdStrategy === 'api-machine-id')).toHaveLength(10);
  });

  it('janelas canônicas, crescentes, no passado e dentro das últimas 24 h', () => {
    const { baseline, condition, confirm } = PLANT.windows;
    for (const ts of [baseline, condition, confirm]) {
      expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    }
    expect(baseline < condition && condition < confirm).toBe(true);

    // O painel classifica recência contra o relógio: janela no futuro vira "relógio
    // divergente" e janela antiga demais some da tendência. As duas coisas quebraram
    // quando as janelas eram datas fixas.
    const now = Date.now();
    const starts = [baseline, condition, confirm].map((ts) => Date.parse(ts));
    for (const at of starts) {
      expect(at).toBeLessThanOrEqual(now);
      expect(now - at).toBeLessThan(24 * 60 * 60 * 1000);
    }
    // Aquisições de 60 s não podem se sobrepor.
    expect(starts[1] - starts[0]).toBeGreaterThanOrEqual(60_000);
    expect(starts[2] - starts[1]).toBeGreaterThanOrEqual(60_000);
  });

  it('fans a 1180 rpm mantêm 2×f_rot bem abaixo do Nyquist do stream', () => {
    for (const s of plantSensors().filter((x) => x.machineType === 'Fan')) {
      expect((s.rpm / 60) * 2).toBeLessThan(64);
    }
  });
});

describe('plant manifest — validação recusa manifests quebrados', () => {
  it('serial duplicado, ponto triplo, Pump com TcAg e dois targets são recusados', () => {
    const dupSerial = clonePlant();
    dupSerial.assets[1].points[0].sensorSerial = 'SIM-HF-001';
    expect(() => validatePlantManifest(dupSerial)).toThrow(/serials/);

    const pumpTcAg = clonePlant();
    pumpTcAg.assets[1].points[0].sensorModel = 'TcAg';
    expect(() => validatePlantManifest(pumpTcAg)).toThrow(/não é permitido em Pump/);

    const noTarget = clonePlant();
    noTarget.conditionTarget.sensorSerial = 'SIM-INEXISTENTE';
    expect(() => validatePlantManifest(noTarget)).toThrow(/exatamente um sensor/);

    const badWindows = clonePlant();
    badWindows.windows.condition = badWindows.windows.baseline;
    expect(() => validatePlantManifest(badWindows)).toThrow(/crescentes/);
  });

  it('estratégias de resourceId malformadas são recusadas', () => {
    const missingFixed = clonePlant();
    delete missingFixed.assets[0].points[0].fixedResourceId;
    expect(() => validatePlantManifest(missingFixed)).toThrow(/24 hex/);

    const extraFixed = clonePlant();
    extraFixed.assets[1].points[0].fixedResourceId = 'a'.repeat(24);
    expect(() => validatePlantManifest(extraFixed)).toThrow(/não aceita fixedResourceId/);
  });
});

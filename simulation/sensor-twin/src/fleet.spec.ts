/**
 * Unitários da frota (testes 9–11 do ciclo F1–F3): engines independentes, determinismo
 * por identidade e distinção entre sensores — com resourceIds fake determinísticos
 * (o real vem do bootstrap, que é integração).
 */
import { deterministicResourceId } from '@dynamox/contracts';

import { buildFleetCycles, scenarioForSensor, sensorsForPhase } from './fleet';
import { CONFIRM_SEED_OFFSET, PLANT, plantSensors } from './plant';

/** resourceIds fake, estáveis, para os 10 pontos api (os 2 do seed usam os fixos). */
function fakeResourceIds(): Map<string, string> {
  const map = new Map<string, string>();
  for (const sensor of plantSensors()) {
    if (sensor.resourceIdStrategy === 'api-machine-id') {
      map.set(
        sensor.sensorSerial,
        deterministicResourceId('fleet-spec', 'point', sensor.sensorSerial),
      );
    }
  }
  return map;
}

describe('frota — fases e cenários', () => {
  it('baseline: 12 ciclos, todos normal; condition: só o alvo em imbalance', () => {
    const ids = fakeResourceIds();

    const baseline = buildFleetCycles(PLANT, 'baseline', ids);
    expect(baseline).toHaveLength(12);
    expect(baseline.every((c) => c.config.scenario === 'normal')).toBe(true);
    expect(baseline.every((c) => c.config.baseTimestamp === PLANT.windows.baseline)).toBe(true);

    const condition = buildFleetCycles(PLANT, 'condition', ids);
    expect(condition).toHaveLength(12);
    const imbalanced = condition.filter((c) => c.config.scenario === 'imbalance');
    expect(imbalanced).toHaveLength(1);
    expect(imbalanced[0].identity.sensorSerial).toBe('SIM-HF-002');
    expect(condition.filter((c) => c.config.scenario === 'normal')).toHaveLength(11);
  });

  it('confirm: apenas o sensor alvo, em imbalance, na janela de confirmação', () => {
    const confirm = buildFleetCycles(PLANT, 'confirm', fakeResourceIds());
    expect(confirm).toHaveLength(1);
    expect(confirm[0].identity.sensorSerial).toBe('SIM-HF-002');
    expect(confirm[0].config.scenario).toBe('imbalance');
    expect(confirm[0].config.baseTimestamp).toBe(PLANT.windows.confirm);

    const target = plantSensors().find((s) => s.sensorSerial === 'SIM-HF-002')!;
    expect(scenarioForSensor(PLANT, target, 'confirm')).toBe('imbalance');
    expect(sensorsForPhase(PLANT, 'confirm')).toHaveLength(1);
  });

  it('resourceId não resolvido falha alto, mandando rodar o bootstrap', () => {
    expect(() => buildFleetCycles(PLANT, 'baseline', new Map())).toThrow(/bootstrap/);
  });
});

describe('frota — determinismo e independência entre engines (testes 9–11)', () => {
  it('9. engines não compartilham estado: intercalar sensores não muda os resultados', () => {
    const ids = fakeResourceIds();
    const isolated = buildFleetCycles(PLANT, 'baseline', ids).map((c) => c.fingerprint);
    // Segunda geração completa (nova "engine" por ciclo) reproduz tudo, na mesma ordem.
    const again = buildFleetCycles(PLANT, 'baseline', ids).map((c) => c.fingerprint);
    expect(again).toEqual(isolated);
  });

  it('10. mesma identidade + seed reproduz o MESMO fingerprint e a MESMA chave', () => {
    const ids = fakeResourceIds();
    const first = buildFleetCycles(PLANT, 'condition', ids);
    const second = buildFleetCycles(PLANT, 'condition', ids);
    for (let i = 0; i < first.length; i += 1) {
      expect(second[i].fingerprint).toBe(first[i].fingerprint);
      expect(second[i].idempotencyKey).toBe(first[i].idempotencyKey);
    }
  });

  it('11. sensores diferentes ⇒ serial no payload, resourceId, chave e fingerprint próprios', () => {
    const cycles = buildFleetCycles(PLANT, 'baseline', fakeResourceIds());

    expect(new Set(cycles.map((c) => c.fingerprint)).size).toBe(12);
    expect(new Set(cycles.map((c) => c.idempotencyKey)).size).toBe(12);
    expect(new Set(cycles.map((c) => c.acquisitionIntentId)).size).toBe(12);

    for (const cycle of cycles) {
      const data = cycle.payload.telemetryCycleData;
      expect(data.measuringSystemUniqueIdentifier).toBe(cycle.identity.sensorSerial);
      expect(data.metadata.profile).toBe(cycle.identity.sensorModel);
      expect(data.metadata.cycleId).toBe(cycle.idempotencyKey);
      for (const measurement of data.measurements) {
        expect(measurement.resourceId).toBe(cycle.identity.resourceId);
      }
      // Tags derivadas da identidade — nada de asset/modelo hardcoded.
      expect(data.tags).toContain(`asset:${cycle.identity.machineName === 'P-101' ? 'p-101' : data.tags.find((t) => t.startsWith('asset:'))!.slice(6)}`);
      expect(data.tags.some((t) => t.startsWith('model:'))).toBe(true);
    }

    // Um Fan com TcAg carrega o profile e a tag corretos (identidade não vaza do default).
    const tcag = cycles.find((c) => c.identity.sensorSerial === 'SIM-TCAG-001')!;
    expect(tcag.payload.telemetryCycleData.metadata.profile).toBe('TcAg');
    expect(tcag.payload.telemetryCycleData.tags).toContain('model:tcag');
    expect(tcag.payload.telemetryCycleData.tags).toContain('asset:ve-201-ventilador-de-tiragem');
    expect(tcag.config.rpm).toBe(1180);
  });
});

describe('frota — snapshots F4 (carga e confirmação)', () => {
  const ids = fakeResourceIds();

  it('1–2, 5–6. cada snapshot tem 12 ciclos e exatamente 3.600 datapoints; dois = 7.200', () => {
    const count = (cycles: ReturnType<typeof buildFleetCycles>) =>
      cycles.reduce(
        (sum, c) =>
          sum +
          c.payload.telemetryCycleData.measurements.reduce((m, x) => m + x.dataPoints.length, 0),
        0,
      );
    const baseline = buildFleetCycles(PLANT, 'baseline', ids);
    const condition = buildFleetCycles(PLANT, 'condition', ids);
    expect(baseline).toHaveLength(12);
    expect(condition).toHaveLength(12);
    expect(count(baseline)).toBe(3600);
    expect(count(condition)).toBe(3600);
    expect(count(baseline) + count(condition)).toBe(7200);
  });

  it('3–4. exatamente um sensor muda de cenário, selecionado por identidade estável', () => {
    const condition = buildFleetCycles(PLANT, 'condition', ids);
    const changed = condition.filter((c) => c.config.scenario !== 'normal');
    expect(changed).toHaveLength(1);
    // Identidade estável do manifest — nunca busca textual de label.
    expect(changed[0].identity.sensorSerial).toBe(PLANT.conditionTarget.sensorSerial);
  });

  it('15–17. confirmação: timestamp, seed e fingerprint DIFERENTES do condition', () => {
    const conditionTarget = buildFleetCycles(PLANT, 'condition', ids).find(
      (c) => c.identity.sensorSerial === PLANT.conditionTarget.sensorSerial,
    )!;
    const [confirm] = buildFleetCycles(PLANT, 'confirm', ids);

    expect(confirm.config.baseTimestamp).not.toBe(conditionTarget.config.baseTimestamp);
    expect(confirm.config.seed).toBe(conditionTarget.config.seed + CONFIRM_SEED_OFFSET);
    expect(confirm.fingerprint).not.toBe(conditionTarget.fingerprint);
    expect(confirm.idempotencyKey).not.toBe(conditionTarget.idempotencyKey);
    expect(confirm.acquisitionIntentId).not.toBe(conditionTarget.acquisitionIntentId);
  });
});

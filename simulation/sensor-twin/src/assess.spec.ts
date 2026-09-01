/**
 * Unitários do assessment e da deliberação (testes 7–14, 18–21 do ciclo F4–F6).
 *
 * As observações são construídas a partir dos CICLOS REAIS da engine (valores que
 * estariam no banco), mas o núcleo de decisão recebe SOMENTE números — o tipo de
 * entrada nem possui campo de cenário, provando que o ranking não usa labels.
 */
import { deterministicResourceId } from '@dynamox/contracts';

import {
  SYNTHETIC_ATTENTION_RATIO,
  computeAssessment,
  meanOf,
  radialRms,
  windowRadialSeries,
  type ObservedWindows,
} from './assess';
import { buildRecommendation, confirmTransition } from './deliberate';
import { buildFleetCycles } from './fleet';
import { PLANT, plantSensors } from './plant';
import type { BuiltCycle } from './payload';

function fakeResourceIds(): Map<string, string> {
  const map = new Map<string, string>();
  for (const sensor of plantSensors()) {
    if (sensor.resourceIdStrategy === 'api-machine-id') {
      map.set(sensor.sensorSerial, deterministicResourceId('assess-spec', sensor.sensorSerial));
    }
  }
  return map;
}

/** Extrai os RMS radiais por janela do payload — exatamente o que o banco devolveria. */
function radialFromCycle(cycle: BuiltCycle): number[] {
  const y = cycle.payload.telemetryCycleData.measurements[1].dataPoints;
  const z = cycle.payload.telemetryCycleData.measurements[2].dataPoints;
  return y.map((point, index) => radialRms(point.value, z[index].value));
}

/** Observações "como persistidas": números por sensor, SEM rótulo de cenário. */
function observationsFromEngine(): ObservedWindows[] {
  const ids = fakeResourceIds();
  const baseline = buildFleetCycles(PLANT, 'baseline', ids);
  const condition = buildFleetCycles(PLANT, 'condition', ids);

  return baseline.map((baselineCycle, index) => {
    const conditionCycle = condition[index];
    return {
      sensorSerial: baselineCycle.identity.sensorSerial,
      machineName: baselineCycle.identity.machineName,
      monitoringPointName: baselineCycle.identity.monitoringPointName,
      shortLabel: plantSensors()[index].shortLabel,
      baselineRadial: radialFromCycle(baselineCycle),
      conditionRadial: radialFromCycle(conditionCycle),
      baselineTemperatureMeanC: meanOf(
        baselineCycle.payload.telemetryCycleData.measurements[3].dataPoints.map((p) => p.value),
      ),
      conditionTemperatureMeanC: meanOf(
        conditionCycle.payload.telemetryCycleData.measurements[3].dataPoints.map((p) => p.value),
      ),
    };
  });
}

const OPTIONS = {
  evaluatedAt: '2026-08-31T12:00:00.000Z',
  baselineWindow: PLANT.windows.baseline,
  conditionWindow: PLANT.windows.condition,
};

describe('F5 — métrica radial e janelas (testes 7–8)', () => {
  it('7. radialRms segue a fórmula explícita sqrt((y²+z²)/2)', () => {
    expect(radialRms(3, 4)).toBeCloseTo(Math.sqrt((9 + 16) / 2), 12);
    expect(radialRms(0.02, 0.02)).toBeCloseTo(0.02, 12);
  });

  it('8. o assessment carrega exatamente as janelas canônicas da planta', () => {
    const assessment = computeAssessment(observationsFromEngine(), OPTIONS);
    expect(assessment.baselineWindow).toBe(PLANT.windows.baseline);
    expect(assessment.conditionWindow).toBe(PLANT.windows.condition);
    expect(assessment.thresholdRatio).toBe(SYNTHETIC_ATTENTION_RATIO);
  });
});

describe('F5 — ranking cego a rótulos (testes 9–14)', () => {
  const assessment = computeAssessment(observationsFromEngine(), OPTIONS);

  it('9–10. onze sensores com ratio ≈ 1; o alvo com ratio > 2 (≈ 3,5)', () => {
    const normals = assessment.sensors.filter(
      (s) => s.sensorSerial !== PLANT.conditionTarget.sensorSerial,
    );
    expect(normals).toHaveLength(11);
    for (const sensor of normals) {
      expect(sensor.deviationRatio).toBeGreaterThan(0.9);
      expect(sensor.deviationRatio).toBeLessThan(1.1);
    }

    const target = assessment.sensors.find(
      (s) => s.sensorSerial === PLANT.conditionTarget.sensorSerial,
    )!;
    expect(target.deviationRatio).toBeGreaterThan(2);
    expect(target.deviationRatio).toBeGreaterThan(3);
    expect(target.deviationRatio).toBeLessThan(4);
  });

  it('11–12. o alvo emerge como rank #1 SEM o algoritmo conhecer cenários', () => {
    // O tipo ObservedWindows não possui campo de cenário — só números observados.
    expect(assessment.ranked[0].sensorSerial).toBe('SIM-HF-002');
    expect(assessment.ranked[0].machineName).toBe('P-101');
    expect(assessment.ranked[1].deviationRatio).toBeLessThan(1.1);
  });

  it('13. sem sensor acima do limiar ⇒ selectedAction NONE e nenhuma confirmação', () => {
    const ids = fakeResourceIds();
    const baseline = buildFleetCycles(PLANT, 'baseline', ids);
    const calm = baseline.map((cycle, index) => ({
      sensorSerial: cycle.identity.sensorSerial,
      machineName: cycle.identity.machineName,
      monitoringPointName: cycle.identity.monitoringPointName,
      shortLabel: plantSensors()[index].shortLabel,
      baselineRadial: radialFromCycle(cycle),
      conditionRadial: radialFromCycle(cycle),
      baselineTemperatureMeanC: null,
      conditionTemperatureMeanC: null,
    }));
    const calmAssessment = computeAssessment(calm, OPTIONS);
    expect(calmAssessment.selected).toBeNull();
    expect(calmAssessment.selectedAction).toBe('NONE');
    expect(calmAssessment.sensors.every((s) => s.state === 'STABLE')).toBe(true);
  });

  it('14. acima do limiar ⇒ SUSPECT; 11 STABLE + 1 SUSPECT no cenário canônico', () => {
    expect(assessment.sensors.filter((s) => s.state === 'STABLE')).toHaveLength(11);
    expect(assessment.sensors.filter((s) => s.state === 'SUSPECT')).toHaveLength(1);
    expect(assessment.selected?.state).toBe('SUSPECT');
    expect(assessment.selectedAction).toBe('CONFIRM_ACQUISITION');
  });

  it('observação incompleta nunca é ranqueada: janela ≠ 60 falha alto', () => {
    const broken = observationsFromEngine();
    broken[0] = { ...broken[0], baselineRadial: broken[0].baselineRadial.slice(0, 59) };
    expect(() => computeAssessment(broken, OPTIONS)).toThrow(/59 valores/);
  });
});

describe('F6 — transição por re-observação e recomendação (testes 18–21)', () => {
  it('18–19. confirmação acima do limiar mantém a evidência e transiciona para CONFIRMED_ATTENTION', () => {
    const ids = fakeResourceIds();
    const [confirmCycle] = buildFleetCycles(PLANT, 'confirm', ids);
    const baselineTarget = buildFleetCycles(PLANT, 'baseline', ids).find(
      (c) => c.identity.sensorSerial === PLANT.conditionTarget.sensorSerial,
    )!;

    const confirmRatio =
      meanOf(radialFromCycle(confirmCycle)) / meanOf(radialFromCycle(baselineTarget));
    expect(confirmRatio).toBeGreaterThan(2);

    expect(confirmTransition(3.49, confirmRatio)).toBe('CONFIRMED_ATTENTION');
    // Confirmação abaixo do limiar NÃO confirma (permanece SUSPECT).
    expect(confirmTransition(3.49, 1.2)).toBe('SUSPECT');
    expect(confirmTransition(1.1, 1.2)).toBe('STABLE');
  });

  it('20. a recomendação prioriza inspeção e não contém claim diagnóstico proibido', () => {
    const assessment = computeAssessment(observationsFromEngine(), OPTIONS);
    const recommendation = buildRecommendation(assessment.selected!, {
      sensorSerial: 'SIM-HF-002',
      ingestStatus: 201,
      ingestDuplicate: false,
      fingerprint: 'f'.repeat(64),
      confirmRadialRms: 0.057,
      confirmRatio: 3.46,
    });
    expect(recommendation).toMatch(/Prioritize inspection/);
    expect(recommendation).toMatch(/SIM-HF-002/);
    expect(recommendation).not.toMatch(
      /bearing|failure|defect|remaining useful life|RUL|diagnos|replace|shutdown/i,
    );
  });

  it('21. execução repetida produz assessment idêntico (determinismo)', () => {
    const first = computeAssessment(observationsFromEngine(), OPTIONS);
    const second = computeAssessment(observationsFromEngine(), OPTIONS);
    expect(second).toEqual(first);
  });
});

describe('pareamento Y/Z estanque (achados da revisão)', () => {
  const start = PLANT.windows.baseline;
  const startMs = Date.parse(start);
  const stamps = Array.from({ length: 60 }, (_, i) => new Date(startMs + i * 1000).toISOString());
  const axis = (value: number) => stamps.map((timestamp) => ({ timestamp, value }));

  it('60 pares perfeitos produzem 60 RMS radiais', () => {
    const radial = windowRadialSeries(axis(0.02), axis(0.02), start, 'teste');
    expect(radial).toHaveLength(60);
    expect(radial[0]).toBeCloseTo(0.02, 12);
  });

  it('59 amostras em um eixo falham alto (nunca pareamento parcial)', () => {
    expect(() => windowRadialSeries(axis(0.02).slice(0, 59), axis(0.02), start, 'teste')).toThrow(
      /59\/60/,
    );
  });

  it('conjuntos de timestamps divergentes entre Y e Z falham alto', () => {
    const shifted = axis(0.02).map((s, i) =>
      i === 30 ? { ...s, timestamp: new Date(startMs + 30_500).toISOString() } : s,
    );
    expect(() => windowRadialSeries(axis(0.02), shifted, start, 'teste')).toThrow(
      /existe em Y mas não em Z/,
    );
  });

  it('timestamps duplicados em um eixo falham alto, mesmo com 60 amostras', () => {
    const duplicated = axis(0.02);
    duplicated[1] = { ...duplicated[0] };
    expect(() => windowRadialSeries(duplicated, axis(0.02), start, 'teste')).toThrow(
      /duplicados/,
    );
  });

  it('timestamp não-ISO vindo da API é erro explícito, não comparação silenciosa', () => {
    const broken = axis(0.02);
    broken[0] = { ...broken[0], timestamp: 'not-a-timestamp' };
    expect(() => windowRadialSeries(broken, axis(0.02), start, 'teste')).toThrow(
      /Timestamp inválido/,
    );
  });
});

/**
 * Frota (F3): N configurações determinísticas sobre a MESMA engine — sem processos,
 * containers ou classes por sensor. A ordem de geração é a ordem do manifest
 * (sequencial e reproduzível nos logs).
 */
import { buildCycle, type BuiltCycle, type SensorTwinIdentity } from './payload';
import { ingestCycle, type IngestionResponse, type TwinApiConfig } from './ingest';
import {
  CONFIRM_SEED_OFFSET,
  PLANT,
  plantSensors,
  validatePlantManifest,
  type PlantManifest,
  type PlantSensor,
} from './plant';
import type { ScenarioName } from './scenarios';

export type PlantPhase = 'baseline' | 'condition' | 'confirm';

/** Mapa serial → resourceId RESOLVIDO (bootstrap para pontos api; fixo para seed). */
export type ResolvedResourceIds = ReadonlyMap<string, string>;

export function scenarioForSensor(
  plant: PlantManifest,
  sensor: PlantSensor,
  phase: PlantPhase,
): ScenarioName {
  if (phase === 'baseline') return 'normal';
  // condition e confirm: só o alvo muda de condição; os demais permanecem normal.
  return sensor.sensorSerial === plant.conditionTarget.sensorSerial ? 'imbalance' : 'normal';
}

/** Sensores que participam da fase: todos no baseline/condition; só o alvo no confirm. */
export function sensorsForPhase(plant: PlantManifest, phase: PlantPhase): PlantSensor[] {
  const sensors = plantSensors(plant);
  if (phase !== 'confirm') return sensors;
  return sensors.filter((s) => s.sensorSerial === plant.conditionTarget.sensorSerial);
}

export function identityFor(
  sensor: PlantSensor,
  resourceIds: ResolvedResourceIds,
): SensorTwinIdentity {
  const resourceId = sensor.fixedResourceId ?? resourceIds.get(sensor.sensorSerial);
  if (!resourceId) {
    throw new Error(
      `resourceId não resolvido para "${sensor.sensorSerial}" — rode o bootstrap da planta primeiro.`,
    );
  }
  return {
    machineName: sensor.machineName,
    monitoringPointName: sensor.pointName,
    sensorSerial: sensor.sensorSerial,
    sensorModel: sensor.sensorModel,
    resourceId,
  };
}

/** Ciclos determinísticos da fase, na ordem do manifest. */
export function buildFleetCycles(
  plant: PlantManifest = PLANT,
  phase: PlantPhase = 'baseline',
  resourceIds: ResolvedResourceIds = new Map(),
): BuiltCycle[] {
  validatePlantManifest(plant);

  return sensorsForPhase(plant, phase).map((sensor) =>
    buildCycle(
      scenarioForSensor(plant, sensor, phase),
      {
        // Confirmação usa realização de ruído independente: seed + offset determinístico.
        seed: phase === 'confirm' ? sensor.seed + CONFIRM_SEED_OFFSET : sensor.seed,
        rpm: sensor.rpm,
        loadPercent: sensor.loadPercent,
        baseTimestamp: plant.windows[phase],
      },
      identityFor(sensor, resourceIds),
    ),
  );
}

export interface FleetIngestion {
  sensorSerial: string;
  status: number;
  body: IngestionResponse;
}

/**
 * Ingere a fase SEQUENCIALMENTE (decisão do plano: 12 sensores são pequenos; ordem
 * determinística deixa logs, falhas e demo reproduzíveis — nada de pools/filas).
 */
export async function runFleetPhase(
  config: TwinApiConfig,
  token: string,
  plant: PlantManifest,
  phase: PlantPhase,
  resourceIds: ResolvedResourceIds,
): Promise<FleetIngestion[]> {
  const results: FleetIngestion[] = [];
  for (const cycle of buildFleetCycles(plant, phase, resourceIds)) {
    const { status, body } = await ingestCycle(config, token, cycle);
    results.push({ sensorSerial: cycle.identity.sensorSerial, status, body });
  }
  return results;
}

/**
 * Ciclo confirmatório canônico de um sensor: a MESMA construção que a porta de
 * aquisição ingere — reutilizada pelo F8 para exportar a proveniência ROS do artefato.
 */
export function buildConfirmatoryCycle(
  plant: PlantManifest,
  resourceIds: ResolvedResourceIds,
  sensorSerial: string,
): BuiltCycle {
  const sensor = plantSensors(plant).find((s) => s.sensorSerial === sensorSerial);
  if (!sensor) {
    throw new Error(`Sensor "${sensorSerial}" não existe no manifest da planta.`);
  }
  return buildCycle(
    scenarioForSensor(plant, sensor, 'confirm'),
    {
      seed: sensor.seed + CONFIRM_SEED_OFFSET,
      rpm: sensor.rpm,
      loadPercent: sensor.loadPercent,
      baseTimestamp: plant.windows.confirm,
    },
    identityFor(sensor, resourceIds),
  );
}

/**
 * PORTA DE AQUISIÇÃO DO SIMULADOR (fronteira do plano): o supervisor deliberativo
 * entrega apenas o SERIAL selecionado; quem resolve a realidade sintética do sinal
 * (cenário, seed da confirmação, janela) é este lado — o módulo do supervisor não
 * importa nem enxerga rótulos de cenário, e um teste de fronteira garante isso.
 */
export async function requestConfirmatoryAcquisition(
  config: TwinApiConfig,
  token: string,
  plant: PlantManifest,
  resourceIds: ResolvedResourceIds,
  sensorSerial: string,
): Promise<FleetIngestion> {
  const cycle = buildConfirmatoryCycle(plant, resourceIds, sensorSerial);
  const { status, body } = await ingestCycle(config, token, cycle);
  return { sensorSerial, status, body };
}

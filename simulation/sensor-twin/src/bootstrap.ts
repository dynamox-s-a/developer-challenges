/**
 * Bootstrap idempotente da planta (F2): a instalação sintética é criada como CLIENTE
 * do produto, exclusivamente pelas APIs reais (login → machines → points → sensors).
 * Zero Prisma, zero SQL.
 *
 * Protocolo de reconciliação (réplica do Codex incorporada): 409 nunca é "tolerado" às
 * cegas — POST → em 409, re-GET → comparar identidade/estado desejado → aceitar somente
 * se o estado já existe; qualquer divergência falha alto (drift de ambiente não é
 * consertado em silêncio; ambientes com dados inseridos por fora do produto não são
 * suportados).
 */
import { deterministicResourceId } from '@dynamox/contracts';

import {
  assignSensorApi,
  createMachineApi,
  createMonitoringPointApi,
  fetchAllMonitoringPoints,
  listMachines,
  type MonitoringPointItem,
  type TwinApiConfig,
} from './ingest';
import { PLANT, plantSensors, validatePlantManifest, type PlantManifest } from './plant';

export interface EnsureCounts {
  created: number;
  existing: number;
}

export interface PlantBootstrapResult {
  machines: EnsureCounts;
  points: EnsureCounts;
  sensors: EnsureCounts;
  /** nome da máquina → id (UUID) descoberto pela API. */
  machineIds: Map<string, string>;
  /** serial do sensor → resourceId RESOLVIDO (fixo do seed ou derivado de machine.id). */
  resourceIds: Map<string, string>;
}

function drift(message: string): Error {
  return new Error(`Bootstrap da planta: divergência de ambiente — ${message}`);
}

/**
 * Resolução READ-ONLY dos resourceIds (F8): descobre machine.id por GET e recomputa os
 * resourceIds derivados — sem criar nada. Falha alto se a planta ainda não existe;
 * quem cria entidades é somente o ensurePlant dos comandos que agem.
 */
export async function resolveResourceIds(
  config: TwinApiConfig,
  token: string,
  plant: PlantManifest = PLANT,
): Promise<Map<string, string>> {
  validatePlantManifest(plant);
  const machines = await listMachines(config, token);
  const byName = new Map(machines.map((m) => [m.name, m]));

  const resourceIds = new Map<string, string>();
  for (const sensor of plantSensors(plant)) {
    if (sensor.fixedResourceId) {
      resourceIds.set(sensor.sensorSerial, sensor.fixedResourceId);
      continue;
    }
    const machine = byName.get(sensor.machineName);
    if (!machine) {
      throw drift(`máquina "${sensor.machineName}" não existe — rode npm run plant -- bootstrap`);
    }
    resourceIds.set(
      sensor.sensorSerial,
      deterministicResourceId('dynamox-challenge', 'monitoring-point', machine.id, sensor.pointName),
    );
  }
  return resourceIds;
}

export async function ensurePlant(
  config: TwinApiConfig,
  token: string,
  plant: PlantManifest = PLANT,
): Promise<PlantBootstrapResult> {
  validatePlantManifest(plant);

  const machines: EnsureCounts = { created: 0, existing: 0 };
  const points: EnsureCounts = { created: 0, existing: 0 };
  const sensors: EnsureCounts = { created: 0, existing: 0 };
  const machineIds = new Map<string, string>();

  // ——— ensure machines ———
  let machineList = await listMachines(config, token);
  const machineByName = () => new Map(machineList.map((m) => [m.name, m]));

  for (const asset of plant.assets) {
    let machine = machineByName().get(asset.machineName);
    if (!machine) {
      const attempt = await createMachineApi(config, token, asset.machineName, asset.machineType);
      if (attempt.status === 201 && attempt.body) {
        machine = attempt.body;
        machineList = [...machineList, machine];
        machines.created += 1;
      } else if (attempt.status === 409) {
        // Corrida legítima: alguém criou entre o GET e o POST — re-GET e valide.
        machineList = await listMachines(config, token);
        machine = machineByName().get(asset.machineName);
        if (!machine) throw drift(`409 ao criar "${asset.machineName}" mas ela não aparece na listagem`);
        machines.existing += 1;
      } else {
        throw drift(`criar máquina "${asset.machineName}" falhou: HTTP ${attempt.status}`);
      }
    } else {
      machines.existing += 1;
    }
    if (machine.type !== asset.machineType) {
      throw drift(
        `máquina "${asset.machineName}" existe como ${machine.type}, o manifest exige ${asset.machineType}`,
      );
    }
    machineIds.set(asset.machineName, machine.id);
  }

  // ——— ensure monitoring points (paginação COMPLETA; pageSize nunca é prova) ———
  let allPoints = await fetchAllMonitoringPoints(config, token);
  const pointKey = (machineId: string, name: string) => `${machineId}::${name}`;
  const pointIndex = () => new Map(allPoints.map((p) => [pointKey(p.machine.id, p.name), p]));

  const resolvedPoints = new Map<string, MonitoringPointItem>(); // serial → point
  for (const sensor of plantSensors(plant)) {
    const machineId = machineIds.get(sensor.machineName)!;
    let point = pointIndex().get(pointKey(machineId, sensor.pointName));
    if (!point) {
      const attempt = await createMonitoringPointApi(config, token, machineId, sensor.pointName);
      if (attempt.status === 201 && attempt.body) {
        point = attempt.body;
        allPoints = [...allPoints, point];
        points.created += 1;
      } else if (attempt.status === 409) {
        allPoints = await fetchAllMonitoringPoints(config, token);
        point = pointIndex().get(pointKey(machineId, sensor.pointName));
        if (!point) {
          throw drift(`409 ao criar ponto "${sensor.pointName}" de "${sensor.machineName}" mas ele não aparece na listagem`);
        }
        points.existing += 1;
      } else {
        throw drift(
          `criar ponto "${sensor.pointName}" de "${sensor.machineName}" falhou: HTTP ${attempt.status}`,
        );
      }
    } else {
      points.existing += 1;
    }
    resolvedPoints.set(sensor.sensorSerial, point);
  }

  // ——— ensure sensors ———
  for (const sensor of plantSensors(plant)) {
    const point = resolvedPoints.get(sensor.sensorSerial)!;
    if (point.sensor) {
      if (
        point.sensor.serialNumber === sensor.sensorSerial &&
        point.sensor.model === sensor.sensorModel
      ) {
        sensors.existing += 1;
        continue;
      }
      throw drift(
        `ponto "${sensor.pointName}" de "${sensor.machineName}" já tem o sensor ` +
          `${point.sensor.serialNumber}/${point.sensor.model}; o manifest exige ` +
          `${sensor.sensorSerial}/${sensor.sensorModel}`,
      );
    }

    const attempt = await assignSensorApi(
      config,
      token,
      point.id,
      sensor.sensorSerial,
      sensor.sensorModel,
    );
    if (attempt.status === 201 && attempt.body) {
      resolvedPoints.set(sensor.sensorSerial, attempt.body);
      sensors.created += 1;
      continue;
    }
    if (attempt.status === 409) {
      // Re-GET e aceite apenas o estado desejado (corrida legítima do mesmo bootstrap).
      const refreshed = await fetchAllMonitoringPoints(config, token);
      const current = refreshed.find((p) => p.id === point.id);
      if (
        current?.sensor?.serialNumber === sensor.sensorSerial &&
        current.sensor.model === sensor.sensorModel
      ) {
        resolvedPoints.set(sensor.sensorSerial, current);
        sensors.existing += 1;
        continue;
      }
      throw drift(
        `409 ao associar ${sensor.sensorSerial} em "${sensor.machineName}/${sensor.pointName}": ` +
          `estado atual ${current?.sensor ? `${current.sensor.serialNumber}/${current.sensor.model}` : 'sem sensor'} não é o desejado`,
      );
    }
    throw drift(
      `associar sensor ${sensor.sensorSerial} falhou: HTTP ${attempt.status} — ${JSON.stringify(attempt.body)}`,
    );
  }

  // ——— resolver resourceIds (fixos do seed; derivados de machine.id para os novos) ———
  const resourceIds = new Map<string, string>();
  for (const sensor of plantSensors(plant)) {
    resourceIds.set(
      sensor.sensorSerial,
      sensor.fixedResourceId ??
        deterministicResourceId(
          'dynamox-challenge',
          'monitoring-point',
          machineIds.get(sensor.machineName)!,
          sensor.pointName,
        ),
    );
  }

  return { machines, points, sensors, machineIds, resourceIds };
}

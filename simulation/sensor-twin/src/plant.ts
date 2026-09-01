/**
 * Plant manifest — fonte ÚNICA de verdade da instalação industrial sintética
 * ("Planta Sintética de Bioenergia", plantId sbe-01).
 *
 * Alimenta bootstrap, simulador, orquestrador, testes e demo. Nada de identidade de
 * frota hardcoded fora daqui. A planta é 100% sintética: não representa cliente real,
 * não carrega dados reais e nunca toca a API produtiva.
 *
 * resourceId dos pontos (restrição real do backend):
 *  - pontos do SEED derivam do NOME da máquina ⇒ hexes fixos conhecidos ('seed-name');
 *  - pontos criados via API derivam de machine.id (UUID de runtime) + nome ⇒ o cliente
 *    recomputa com a MESMA função compartilhada de @dynamox/contracts após descobrir o
 *    id pelo bootstrap ('api-machine-id').
 */
import { DEMO_HOUR_MS, demoWindowIso } from '@dynamox/contracts';
import {
  isSensorModelAllowedForMachine,
  type MachineType,
  type SensorModel,
} from '@dynamox/domain';

export type PointLabel = 'DE' | 'NDE';

/**
 * Política determinística da aquisição confirmatória (F6): mesma condição sintética,
 * realização de ruído DIFERENTE — seed da confirmação = seed do sensor + este offset.
 * A confirmação vira evidência independente dentro do modelo sintético, não um replay.
 */
export const CONFIRM_SEED_OFFSET = 1000;
export type ResourceIdStrategy = 'seed-name' | 'api-machine-id';

export interface PlantPointSpec {
  pointName: string;
  shortLabel: PointLabel;
  sensorSerial: string;
  sensorModel: SensorModel;
  seed: number;
  resourceIdStrategy: ResourceIdStrategy;
  /** Obrigatório quando a estratégia é 'seed-name' (hex de 24 conhecido do seed). */
  fixedResourceId?: string;
}

export interface PlantAssetSpec {
  machineName: string;
  machineType: MachineType;
  rpm: number;
  loadPercent: number;
  points: readonly [PlantPointSpec, PlantPointSpec];
}

export interface PlantManifest {
  plantId: string;
  plantName: string;
  /** Janelas plant-wide, UTC canônico com milissegundos. */
  windows: { baseline: string; condition: string; confirm: string };
  /** Exatamente UM sensor muda de condição (imbalance) nos snapshots. */
  conditionTarget: { sensorSerial: string };
  assets: readonly PlantAssetSpec[];
}

const DE = 'Mancal lado acoplamento';
const NDE = 'Mancal lado oposto ao acoplamento';

const point = (
  shortLabel: PointLabel,
  sensorSerial: string,
  sensorModel: SensorModel,
  seed: number,
  fixedResourceId?: string,
): PlantPointSpec => ({
  pointName: shortLabel === 'DE' ? DE : NDE,
  shortLabel,
  sensorSerial,
  sensorModel,
  seed,
  resourceIdStrategy: fixedResourceId ? 'seed-name' : 'api-machine-id',
  ...(fixedResourceId ? { fixedResourceId } : {}),
});

export const PLANT: PlantManifest = {
  plantId: 'sbe-01',
  plantName: 'Planta Sintética de Bioenergia',
  // Janelas RELATIVAS à execução (âncora do bloco de 6 h, ver @dynamox/contracts):
  // −3 h baseline, −2 h condition, −1 h confirm. Sempre no passado e dentro das últimas
  // 24 h, para que o painel classifique as leituras como recentes; estáveis dentro do
  // bloco, para que reingerir a mesma fase continue sendo reconhecido como duplicata.
  windows: {
    baseline: demoWindowIso(-3 * DEMO_HOUR_MS),
    condition: demoWindowIso(-2 * DEMO_HOUR_MS),
    confirm: demoWindowIso(-1 * DEMO_HOUR_MS),
  },
  conditionTarget: { sensorSerial: 'SIM-HF-002' },
  assets: [
    {
      // P-101 é a máquina do seed: nome EXATO e resourceIds fixos derivados por nome.
      machineName: 'P-101',
      machineType: 'Pump',
      rpm: 1750,
      loadPercent: 70,
      points: [
        point('DE', 'SIM-HF-001', 'HF+', 42, '42d726ba50f8645df08dba9f'),
        point('NDE', 'SIM-HF-002', 'HF+', 43, '8c7f0433523f53a860d7b17f'),
      ],
    },
    {
      machineName: 'P-102 — Bomba de recirculação',
      machineType: 'Pump',
      rpm: 1750,
      loadPercent: 70,
      points: [point('DE', 'SIM-HF-003', 'HF+', 44), point('NDE', 'SIM-HF-004', 'HF+', 45)],
    },
    {
      machineName: 'P-103 — Bomba de alimentação',
      machineType: 'Pump',
      rpm: 1750,
      loadPercent: 70,
      points: [point('DE', 'SIM-HF-005', 'HF+', 46), point('NDE', 'SIM-HF-006', 'HF+', 47)],
    },
    {
      // Fans a 1180 rpm: 2×f_rot ≈ 39,3 Hz, folga ampla sob Nyquist do stream (64 Hz).
      machineName: 'VE-201 — Ventilador de tiragem',
      machineType: 'Fan',
      rpm: 1180,
      loadPercent: 55,
      points: [point('DE', 'SIM-TCAG-001', 'TcAg', 48), point('NDE', 'SIM-TCAS-001', 'TcAs', 49)],
    },
    {
      machineName: 'VE-202 — Exaustor de caldeira',
      machineType: 'Fan',
      rpm: 1180,
      loadPercent: 55,
      points: [point('DE', 'SIM-HF-007', 'HF+', 50), point('NDE', 'SIM-TCAG-002', 'TcAg', 51)],
    },
    {
      machineName: 'VE-203 — Ventilador de resfriamento',
      machineType: 'Fan',
      rpm: 1180,
      loadPercent: 55,
      points: [point('DE', 'SIM-TCAS-002', 'TcAs', 52), point('NDE', 'SIM-HF-008', 'HF+', 53)],
    },
  ],
};

/** Sensor "achatado": ponto + contexto da máquina, na ordem determinística do manifest. */
export interface PlantSensor extends PlantPointSpec {
  machineName: string;
  machineType: MachineType;
  rpm: number;
  loadPercent: number;
}

export function plantSensors(plant: PlantManifest = PLANT): PlantSensor[] {
  return plant.assets.flatMap((asset) =>
    asset.points.map((p) => ({
      ...p,
      machineName: asset.machineName,
      machineType: asset.machineType,
      rpm: asset.rpm,
      loadPercent: asset.loadPercent,
    })),
  );
}

const CANONICAL_TS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/** Duração de uma aquisição (60 janelas RMS de 1 s). */
const WINDOW_SPAN_MS = 60_000;
/** Recência máxima aceita para os dados de demonstração (mesmo limite do painel). */
const MAX_WINDOW_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * Invariantes da planta — falhar cedo e alto. A quantidade 12 é canônica da demo, mas
 * a validação aceita qualquer manifest coerente (a engine não depende magicamente de 12).
 */
export function validatePlantManifest(plant: PlantManifest = PLANT): void {
  const problems: string[] = [];
  const sensors = plantSensors(plant);

  const machineNames = plant.assets.map((a) => a.machineName);
  if (new Set(machineNames).size !== machineNames.length) {
    problems.push('nomes de máquina duplicados');
  }

  for (const asset of plant.assets) {
    if (asset.points.length !== 2) {
      problems.push(`"${asset.machineName}" precisa de exatamente 2 pontos`);
    }
    const pointNames = asset.points.map((p) => p.pointName);
    if (new Set(pointNames).size !== pointNames.length) {
      problems.push(`pontos duplicados em "${asset.machineName}"`);
    }
    for (const p of asset.points) {
      if (!isSensorModelAllowedForMachine(asset.machineType, p.sensorModel)) {
        problems.push(
          `"${p.sensorModel}" não é permitido em ${asset.machineType} ("${asset.machineName}")`,
        );
      }
      if (p.resourceIdStrategy === 'seed-name' && !/^[0-9a-f]{24}$/.test(p.fixedResourceId ?? '')) {
        problems.push(`"${p.sensorSerial}": estratégia seed-name exige fixedResourceId de 24 hex`);
      }
      if (p.resourceIdStrategy === 'api-machine-id' && p.fixedResourceId !== undefined) {
        problems.push(`"${p.sensorSerial}": estratégia api-machine-id não aceita fixedResourceId`);
      }
    }
  }

  const serials = sensors.map((s) => s.sensorSerial);
  if (new Set(serials).size !== serials.length) problems.push('serials de sensor duplicados');

  const seeds = sensors.map((s) => s.seed);
  if (new Set(seeds).size !== seeds.length) problems.push('seeds duplicadas');
  if (seeds.some((s) => !Number.isSafeInteger(s))) problems.push('seed não inteira');

  const targets = sensors.filter((s) => s.sensorSerial === plant.conditionTarget.sensorSerial);
  if (targets.length !== 1) {
    problems.push('conditionTarget precisa apontar para exatamente um sensor do manifest');
  }

  const { baseline, condition, confirm } = plant.windows;
  for (const [label, ts] of Object.entries(plant.windows)) {
    if (!CANONICAL_TS.test(ts)) problems.push(`janela "${label}" fora do formato canônico`);
  }
  if (!(baseline < condition && condition < confirm)) {
    problems.push('janelas precisam ser estritamente crescentes (baseline < condition < confirm)');
  }
  // Cada aquisição ocupa 60 s: janelas mais próximas do que isso se sobreporiam e a
  // segunda ingestão bateria em conflito de instante na mesma série.
  const starts = [baseline, condition, confirm].map((ts) => Date.parse(ts));
  for (let i = 1; i < starts.length; i += 1) {
    if (starts[i] - starts[i - 1] < WINDOW_SPAN_MS) {
      problems.push('janelas precisam estar separadas por pelo menos a duração da aquisição');
    }
  }
  // Regra que substituiu a disjunção por data fixa: o dado de demonstração precisa ser
  // passado (senão o painel o marca como relógio divergente) e recente (senão some da
  // janela de tendência). As duas condições são o que o QA final encontrou quebrado.
  const now = Date.now();
  if (starts.some((at) => at > now)) {
    problems.push('janelas da planta não podem estar no futuro do relógio');
  }
  if (starts.some((at) => now - at > MAX_WINDOW_AGE_MS)) {
    problems.push('janelas da planta precisam estar dentro das últimas 24 h');
  }

  if (problems.length > 0) {
    throw new Error(`Plant manifest inválido: ${problems.join('; ')}.`);
  }
}

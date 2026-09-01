/**
 * Loop deliberativo (F6): OBSERVE → RANK → DECIDE → ACT → RE-OBSERVE → RECOMMEND.
 *
 * FRONTEIRA ESTANQUE (achado da revisão incorporado): este módulo — o supervisor — não
 * importa nenhuma maquinaria de cenário/seed/realidade do simulador. Ele decide QUEM
 * confirmar pelos dados e entrega apenas o serial à porta de aquisição do simulador
 * (fleet.requestConfirmatoryAcquisition). A lista de tokens proibidos vive em
 * boundary.spec.ts, que varre este arquivo e o assess.ts para impedir regressão.
 *
 * A confirmação NÃO é replay: é uma NOVA aquisição (janela e seed próprios, resolvidos
 * pelo simulador). A transição de estado nasce SEMPRE da releitura do banco —
 * duplicate é transporte, nunca evidência.
 */
import {
  SYNTHETIC_ATTENTION_RATIO,
  assessFleet,
  meanOf,
  readSensorSeries,
  seriesIdsForPlant,
  windowRadialSeries,
  type FleetAssessment,
  type SensorAssessment,
  type SensorState,
} from './assess';
import { requestConfirmatoryAcquisition, type ResolvedResourceIds } from './fleet';
import type { TwinApiConfig } from './ingest';
import { PLANT, plantSensors, type PlantManifest } from './plant';

export interface ConfirmationEvidence {
  sensorSerial: string;
  ingestStatus: number;
  ingestDuplicate: boolean;
  fingerprint: string;
  confirmRadialRms: number;
  confirmRatio: number;
}

export interface DeliberationResult {
  assessment: FleetAssessment;
  action: 'CONFIRM_ACQUISITION' | 'NONE';
  confirmation: ConfirmationEvidence | null;
  finalState: SensorState | null;
  recommendation: string | null;
}

/** Regra mínima de transição: confirmação também acima do limiar ⇒ CONFIRMED_ATTENTION. */
export function confirmTransition(
  conditionRatio: number,
  confirmRatio: number,
  threshold: number = SYNTHETIC_ATTENTION_RATIO,
): SensorState {
  if (conditionRatio >= threshold && confirmRatio >= threshold) return 'CONFIRMED_ATTENTION';
  return conditionRatio >= threshold ? 'SUSPECT' : 'STABLE';
}

/** Recomendação limitada: prioriza atenção; JAMAIS diagnostica falha. */
export function buildRecommendation(
  sensor: SensorAssessment,
  confirmation: ConfirmationEvidence,
): string {
  return (
    `Prioritize inspection — ${sensor.machineName} / ${sensor.shortLabel} ` +
    `(${sensor.sensorSerial}): radial RMS ${sensor.deviationRatio.toFixed(2)}x the synthetic ` +
    `baseline; confirmatory acquisition consistent (${confirmation.confirmRatio.toFixed(2)}x).`
  );
}

/** OBSERVE → RANK → DECIDE → ACT (via porta do simulador) → RE-OBSERVE → RECOMMEND. */
export async function deliberate(
  config: TwinApiConfig,
  token: string,
  plant: PlantManifest = PLANT,
  resourceIds: ResolvedResourceIds,
): Promise<DeliberationResult> {
  const assessment = await assessFleet(config, token, plant);

  if (!assessment.selected) {
    return {
      assessment,
      action: 'NONE',
      confirmation: null,
      finalState: null,
      recommendation: null,
    };
  }

  // ACT: o supervisor entrega SOMENTE o serial selecionado à porta do simulador.
  const selectedSerial = assessment.selected.sensorSerial;
  const ingestion = await requestConfirmatoryAcquisition(
    config, token, plant, resourceIds, selectedSerial,
  );

  // RE-OBSERVE: a conclusão nasce do BANCO, nunca do resultado interno do gerador.
  const target = plantSensors(plant).find((s) => s.sensorSerial === selectedSerial)!;
  const ids = (await seriesIdsForPlant(config, token, [target])).get(selectedSerial)!;
  const readings = await readSensorSeries(config, token, ids);
  const confirmRadial = windowRadialSeries(
    readings.ySamples,
    readings.zSamples,
    plant.windows.confirm,
    `confirm de ${selectedSerial}`,
  );
  const confirmRadialRms = meanOf(confirmRadial);
  const confirmRatio = confirmRadialRms / assessment.selected.baselineRadialRms;

  const confirmation: ConfirmationEvidence = {
    sensorSerial: selectedSerial,
    ingestStatus: ingestion.status,
    ingestDuplicate: ingestion.body.duplicate,
    fingerprint: ingestion.body.payloadFingerprint,
    confirmRadialRms,
    confirmRatio,
  };

  const finalState = confirmTransition(assessment.selected.deviationRatio, confirmRatio);

  return {
    assessment,
    action: 'CONFIRM_ACQUISITION',
    confirmation,
    finalState,
    recommendation:
      finalState === 'CONFIRMED_ATTENTION'
        ? buildRecommendation(assessment.selected, confirmation)
        : null,
  };
}

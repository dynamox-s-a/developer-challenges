import type { SensorModel } from '@dynamox/domain';
import { SensorModel as PrismaSensorModel } from '@prisma/client';

/**
 * Tradução entre o vocabulário público do desafio (`TcAg`/`TcAs`/`HF+`) e o enum do
 * Prisma (`TC_AG`/`TC_AS`/`HF_PLUS`). Vive em `common/` porque é compartilhado por
 * pontos de monitoramento e telemetria — nenhum dos dois módulos deve depender do
 * outro só por causa desta conversão.
 */
const PRISMA_TO_SENSOR_MODEL: Record<PrismaSensorModel, SensorModel> = {
  TC_AG: 'TcAg',
  TC_AS: 'TcAs',
  HF_PLUS: 'HF+',
};

const SENSOR_MODEL_TO_PRISMA: Record<SensorModel, PrismaSensorModel> = {
  TcAg: PrismaSensorModel.TC_AG,
  TcAs: PrismaSensorModel.TC_AS,
  'HF+': PrismaSensorModel.HF_PLUS,
};

export function toDomainSensorModel(value: PrismaSensorModel): SensorModel {
  return PRISMA_TO_SENSOR_MODEL[value];
}

export function toPrismaSensorModel(value: SensorModel): PrismaSensorModel {
  return SENSOR_MODEL_TO_PRISMA[value];
}

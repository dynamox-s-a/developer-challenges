import { z } from 'zod';
import type { MachineType } from './machine.schema.ts';

export const sensorModelSchema = z.enum(
  ['TcAg', 'TcAs', 'HF+'],
  'Modelo de sensor inválido',
);
export type SensorModel = z.infer<typeof sensorModelSchema>;
export const SENSOR_MODELS = sensorModelSchema.options; // ['TcAg', 'TcAs', 'HF+']

// Regra do negócio: os modelos de sensor que cada tipo de máquina NÃO aceita.
// O Record obriga a listar todos os tipos: um tipo novo não passa sem regra
export const SENSOR_MODELS_NOT_ALLOWED: Record<MachineType, SensorModel[]> = {
  Pump: ['TcAg', 'TcAs'],
  Fan: [],
};

export function isSensorModelAllowed(
  machineType: MachineType,
  sensorModel: SensorModel,
): boolean {
  return !SENSOR_MODELS_NOT_ALLOWED[machineType].includes(sensorModel);
}

// Número de série: DyL<modelo>.<2 dígitos>.<letra><4 dígitos>, ex.: DyL4.01.A0000.
// A comparação é feita em maiúsculas, por isso "DYL" aqui
const SERIAL_NUMBER_PATTERN = /^DYL\d\.\d{2}\.[A-Z]\d{4}$/;

// O dígito logo depois de "DyL" diz o modelo do sensor
const SERIAL_NUMBER_PREFIXES: Record<SensorModel, string> = {
  TcAg: 'DyL1',
  TcAs: 'DyL0',
  'HF+': 'DyL4',
};

// abort: true = se essa verificação falhar, as seguintes não rodam
// (nem a do modelo, lá embaixo). Assim aparece só uma mensagem por vez
const serialNumberSchema = z
  .string()
  .trim()
  .min(1, { error: 'Informe o número de série', abort: true })
  // Aceita o número digitado com qualquer caixa ("dyl4.01.a0000")...
  .toUpperCase()
  .regex(SERIAL_NUMBER_PATTERN, {
    error: 'Use o formato DyL4.01.A0000',
    abort: true,
  })
  // ...e devolve sempre do mesmo jeito ("DyL4.01.A0000"). Assim o banco
  // reconhece como repetido o mesmo número digitado com outra caixa
  .transform((serialNumber) => `DyL${serialNumber.slice(3)}`);

export const sensorSchema = z
  .object({
    model: sensorModelSchema,
    serialNumber: serialNumberSchema,
  })
  // O número de série tem que ser de um sensor do modelo escolhido
  .superRefine((sensor, ctx) => {
    const prefix = SERIAL_NUMBER_PREFIXES[sensor.model];
    if (!sensor.serialNumber.startsWith(prefix)) {
      ctx.addIssue({
        code: 'custom',
        message: `O número de série de um sensor ${sensor.model} começa com ${prefix}`,
        path: ['serialNumber'],
      });
    }
  });

export type SensorInput = z.infer<typeof sensorSchema>;

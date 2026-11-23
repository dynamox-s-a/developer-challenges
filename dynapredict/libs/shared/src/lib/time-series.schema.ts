import { z } from 'zod';

// O máximo de medições numa série. Mantém cada envio rápido (o desafio pede
// respostas em menos de 350 ms); dados maiores vão em mais de uma série
export const MAX_TIME_SERIES_SAMPLES = 10_000;

const sampleSchema = z.object({
  // Data e hora com fuso (Z ou -03:00): sem fuso, o mesmo texto seria um
  // instante diferente em cada computador.
  // abort: true = se a data for inválida, a checagem de instantes repetidos
  // (lá embaixo) não roda; ela receberia o texto em vez de uma data
  timestamp: z.iso
    .datetime({
      offset: true,
      error: 'Use data e hora com fuso, ex.: 2026-11-22T10:00:00Z',
      abort: true,
    })
    .transform((timestamp) => new Date(timestamp)),
  // O z.number() já recusa NaN e Infinity
  value: z.number('O valor tem que ser um número'),
});

export const timeSeriesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome da série')
    .max(100, 'Use no máximo 100 caracteres'),
  // Opcional: em branco ou sem a unidade, fica null ("sem unidade")
  unit: z
    .string()
    .trim()
    .max(20, 'Use no máximo 20 caracteres')
    .nullish()
    .transform((unit) => unit || null),
  samples: z
    .array(sampleSchema, 'Envie as medições numa lista')
    .min(1, 'Envie pelo menos uma medição')
    .max(
      MAX_TIME_SERIES_SAMPLES,
      `Envie no máximo ${MAX_TIME_SERIES_SAMPLES.toLocaleString('pt-BR')} medições`,
    )
    // Uma série não tem duas medições no mesmo instante. Compara as datas,
    // e não os textos: "10:00:00Z" e "07:00:00-03:00" são o mesmo instante
    .superRefine((samples, ctx) => {
      const seen = new Set<number>();
      for (const [index, sample] of samples.entries()) {
        const time = sample.timestamp.getTime();
        if (seen.has(time)) {
          ctx.addIssue({
            code: 'custom',
            message: `Há mais de uma medição no instante ${sample.timestamp.toISOString()}`,
            path: [index, 'timestamp'],
          });
          // Avisa só a primeira repetição, e não uma vez por medição
          return;
        }
        seen.add(time);
      }
    }),
});

// Os dados já validados, que a API grava: os instantes viram datas
export type TimeSeriesInput = z.infer<typeof timeSeriesSchema>;
// O que a tela envia: os instantes ainda como texto
export type TimeSeriesUpload = z.input<typeof timeSeriesSchema>;

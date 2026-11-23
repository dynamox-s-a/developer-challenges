import type { TimeSeriesInput } from '@dynapredict/shared';
import { AppError } from '../../errors/app-error.ts';
import type { Prisma } from '../../generated/prisma/client.ts';
import { prisma } from '../../lib/prisma.ts';
import { getMonitoringPoint } from '../monitoring-points/monitoring-points.service.ts';

// Os campos de uma série sem as medições: é o que as listas mostram
const SUMMARY = {
  id: true,
  name: true,
  unit: true,
  sensorSerialNumber: true,
  monitoringPointId: true,
  sampleCount: true,
  startedAt: true,
  endedAt: true,
  createdAt: true,
} satisfies Prisma.TimeSeriesSelect;

// O primeiro e o último instante. As medições podem chegar fora de ordem
function timeRange(samples: TimeSeriesInput['samples']) {
  let startedAt = samples[0].timestamp;
  let endedAt = samples[0].timestamp;

  for (const { timestamp } of samples) {
    if (timestamp < startedAt) startedAt = timestamp;
    if (timestamp > endedAt) endedAt = timestamp;
  }

  return { startedAt, endedAt };
}

// Grava uma série enviada pelo sensor do ponto. "data" já chega validado
// pelo timeSeriesSchema: instantes como datas, sem repetidos, 1 a 10.000
export async function createTimeSeries(pointId: string, data: TimeSeriesInput) {
  await getMonitoringPoint(pointId); // 404 se o ponto não existir

  const sensor = await prisma.sensor.findUnique({
    where: { monitoringPointId: pointId },
  });

  // Os dados vêm do sensor: sem sensor no ponto, ninguém mediu nada
  if (!sensor) {
    throw new AppError(
      409,
      'POINT_WITHOUT_SENSOR',
      'Coloque um sensor no ponto antes de enviar dados',
    );
  }

  const { samples, ...series } = data;

  // Numa transação: se as medições falharem, nem a série fica gravada
  return prisma.$transaction(async (tx) => {
    const created = await tx.timeSeries.create({
      data: {
        ...series,
        sensorSerialNumber: sensor.serialNumber,
        monitoringPointId: pointId,
        sampleCount: samples.length,
        ...timeRange(samples),
      },
      select: SUMMARY,
    });

    // As medições vão num INSERT só, em SQL. Com o createMany do Prisma, um
    // envio de 10.000 medições levava uns 270 ms (às vezes passava dos 350 ms
    // do desafio); assim leva uns 140 ms. O unnest transforma as duas listas
    // (instantes e valores) em linhas. A coluna guarda a hora em UTC, sem
    // fuso, por isso o AT TIME ZONE 'UTC'
    await tx.$executeRaw`
      INSERT INTO "TimeSeriesSample" ("timeSeriesId", "timestamp", "value")
      SELECT ${created.id}, t::timestamptz AT TIME ZONE 'UTC', v
      FROM unnest(
        ${samples.map((sample) => sample.timestamp.toISOString())}::text[],
        ${samples.map((sample) => sample.value)}::float8[]
      ) AS sample(t, v)
    `;

    return created;
  });
}

// As séries de um ponto, sem as medições: as mais recentes primeiro
export async function listTimeSeries(pointId: string) {
  await getMonitoringPoint(pointId); // 404 se o ponto não existir

  return prisma.timeSeries.findMany({
    where: { monitoringPointId: pointId },
    orderBy: [{ startedAt: 'desc' }, { id: 'asc' }],
    select: SUMMARY,
  });
}

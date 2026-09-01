/**
 * Unitários do TelemetryService restritos à lógica que faz sentido isolar (TS-03/TS-05):
 * montagem do envelope de paginação e tradução de erros. A ingestão idempotente depende
 * de transações e índices reais e é coberta pelos e2e contra PostgreSQL.
 */
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { TelemetryService } from './telemetry.service';
import type { PrismaService } from '../prisma/prisma.service';

function buildService() {
  const prisma = {
    timeSeries: { findUnique: jest.fn(), delete: jest.fn() },
    timeSeriesSample: { findMany: jest.fn(), count: jest.fn() },
    // Transação em lote: recebe o array de promessas já disparadas pelos mocks acima.
    $transaction: jest.fn(async (operations: Array<Promise<unknown>>) =>
      Promise.all(operations),
    ),
  };
  return { prisma, service: new TelemetryService(prisma as unknown as PrismaService) };
}

describe('TelemetryService.getSamplesPage (TS-03)', () => {
  it('monta o envelope { items, total, limit, offset } com timestamps ISO', async () => {
    const { prisma, service } = buildService();
    prisma.timeSeries.findUnique.mockResolvedValue({ id: 'ts-1' });
    prisma.timeSeriesSample.findMany.mockResolvedValue([
      { timestamp: new Date('2026-08-26T12:00:00.000Z'), value: 0.02 },
      { timestamp: new Date('2026-08-26T12:00:10.000Z'), value: 0.021 },
    ]);
    prisma.timeSeriesSample.count.mockResolvedValue(42);

    const page = await service.getSamplesPage('ts-1', { limit: 2, offset: 10 });

    expect(page).toEqual({
      items: [
        { timestamp: '2026-08-26T12:00:00.000Z', value: 0.02 },
        { timestamp: '2026-08-26T12:00:10.000Z', value: 0.021 },
      ],
      total: 42,
      limit: 2,
      offset: 10,
    });
    // O total vem junto mesmo quando a página não é a última: nada trunca em silêncio.
    expect(prisma.timeSeriesSample.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 2, orderBy: { timestamp: 'asc' } }),
    );
    // Página e contagem precisam sair do MESMO snapshot: remover o Repeatable Read
    // seria uma regressão silenciosa — este assert a torna barulhenta.
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Array), {
      isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
    });
  });

  it('responde 404 para série inexistente antes de consultar amostras', async () => {
    const { prisma, service } = buildService();
    prisma.timeSeries.findUnique.mockResolvedValue(null);

    await expect(service.getSamplesPage('nao-existe', { limit: 500, offset: 0 })).rejects.toMatchObject(
      { constructor: NotFoundException, response: { code: 'TIME_SERIES_NOT_FOUND' } },
    );
    expect(prisma.timeSeriesSample.findMany).not.toHaveBeenCalled();
  });
});

describe('TelemetryService.removeTimeSeries (TS-05)', () => {
  it('traduz exclusão de série inexistente (P2025) em 404', async () => {
    const { prisma, service } = buildService();
    prisma.timeSeries.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('missing', {
        code: 'P2025',
        clientVersion: '5.22.0',
      }),
    );

    await expect(service.removeTimeSeries('nao-existe')).rejects.toMatchObject({
      response: { code: 'TIME_SERIES_NOT_FOUND' },
    });
  });

  it('propaga erros que não são "registro inexistente" sem mascará-los', async () => {
    const { prisma, service } = buildService();
    prisma.timeSeries.delete.mockRejectedValue(new Error('conexão caiu'));

    await expect(service.removeTimeSeries('ts-1')).rejects.toThrow('conexão caiu');
  });
});

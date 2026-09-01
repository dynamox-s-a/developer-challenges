/**
 * Unitários do MachinesService com Prisma mockado: validam o mapeamento de erros do
 * banco para códigos HTTP estáveis e a regra Pump × sensores na troca de tipo — sem
 * PostgreSQL real (os invariantes de banco ficam com os e2e).
 */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { MachinesService } from './machines.service';
import type { PrismaService } from '../prisma/prisma.service';

const NOW = new Date('2026-08-28T12:00:00.000Z');

const machineRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'm-1',
  name: 'P-101',
  type: 'PUMP',
  createdAt: NOW,
  updatedAt: NOW,
  ...overrides,
});

function uniqueViolation(target: unknown): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError('unique', {
    code: 'P2002',
    clientVersion: '5.22.0',
    meta: { target },
  });
}

function recordNotFound(): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError('missing', {
    code: 'P2025',
    clientVersion: '5.22.0',
  });
}

interface TxMock {
  machine: { update: jest.Mock };
  sensor: { findMany: jest.Mock };
}

function buildService(tx: TxMock) {
  const prisma = {
    machine: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    // O update roda dentro de transação interativa: o mock entrega o tx ao callback.
    $transaction: jest.fn(async (callback: (tx: TxMock) => Promise<unknown>) => callback(tx)),
  };
  return { prisma, service: new MachinesService(prisma as unknown as PrismaService) };
}

const emptyTx = (): TxMock => ({
  machine: { update: jest.fn() },
  sensor: { findMany: jest.fn().mockResolvedValue([]) },
});

describe('MachinesService.create', () => {
  it('devolve o vocabulário público (Pump), nunca o enum interno do banco', async () => {
    const { prisma, service } = buildService(emptyTx());
    prisma.machine.create.mockResolvedValue(machineRow());

    const result = await service.create({ name: 'P-101', type: 'Pump' });

    expect(result.type).toBe('Pump');
    expect(prisma.machine.create).toHaveBeenCalledWith({
      data: { name: 'P-101', type: 'PUMP' },
    });
  });

  it('traduz violação de unicidade (P2002) em 409 MACHINE_NAME_CONFLICT', async () => {
    const { prisma, service } = buildService(emptyTx());
    prisma.machine.create.mockRejectedValue(uniqueViolation(['name']));

    await expect(service.create({ name: 'P-101', type: 'Fan' })).rejects.toMatchObject({
      constructor: ConflictException,
      response: { code: 'MACHINE_NAME_CONFLICT' },
    });
  });
});

describe('MachinesService.update — regra Pump × sensores', () => {
  it('reverte a troca para Pump quando algum ponto tem sensor TcAg/TcAs', async () => {
    const tx = emptyTx();
    tx.machine.update.mockResolvedValue(machineRow());
    tx.sensor.findMany.mockResolvedValue([
      { serialNumber: 'S-TCAG-1', model: 'TC_AG' },
      { serialNumber: 'S-TCAS-2', model: 'TC_AS' },
    ]);
    const { service } = buildService(tx);

    const attempt = service.update('m-1', { type: 'Pump' });

    // O throw dentro da transação desfaz o update; a mensagem nomeia os sensores.
    await expect(attempt).rejects.toMatchObject({
      response: { code: 'MACHINE_TYPE_SENSOR_CONFLICT' },
    });
    await expect(service.update('m-1', { type: 'Pump' })).rejects.toThrow(/S-TCAG-1/);
  });

  it('só consulta sensores quando o destino é Pump: virar Fan não dispara a checagem', async () => {
    const tx = emptyTx();
    tx.machine.update.mockResolvedValue(machineRow({ type: 'FAN' }));
    const { service } = buildService(tx);

    const result = await service.update('m-1', { type: 'Fan' });

    expect(result.type).toBe('Fan');
    expect(tx.sensor.findMany).not.toHaveBeenCalled();
  });

  it('aceita virar Pump quando os sensores associados são compatíveis (HF+)', async () => {
    const tx = emptyTx();
    tx.machine.update.mockResolvedValue(machineRow());
    tx.sensor.findMany.mockResolvedValue([]);
    const { service } = buildService(tx);

    const result = await service.update('m-1', { type: 'Pump' });

    expect(result.type).toBe('Pump');
    // A checagem filtra exatamente os modelos proibidos pelo enunciado.
    expect(tx.sensor.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ model: { in: ['TC_AG', 'TC_AS'] } }),
      }),
    );
  });

  it('traduz máquina inexistente (P2025) em 404 MACHINE_NOT_FOUND', async () => {
    const tx = emptyTx();
    tx.machine.update.mockRejectedValue(recordNotFound());
    const { service } = buildService(tx);

    await expect(service.update('fantasma', { name: 'X' })).rejects.toMatchObject({
      constructor: NotFoundException,
      response: { code: 'MACHINE_NOT_FOUND' },
    });
  });

  it('traduz nome duplicado no PATCH (P2002) em 409 MACHINE_NAME_CONFLICT', async () => {
    const tx = emptyTx();
    tx.machine.update.mockRejectedValue(uniqueViolation(['name']));
    const { service } = buildService(tx);

    await expect(service.update('m-1', { name: 'Ocupado' })).rejects.toMatchObject({
      response: { code: 'MACHINE_NAME_CONFLICT' },
    });
  });
});

describe('MachinesService.remove', () => {
  it('traduz exclusão de id inexistente (P2025) em 404', async () => {
    const { prisma, service } = buildService(emptyTx());
    prisma.machine.delete.mockRejectedValue(recordNotFound());

    await expect(service.remove('fantasma')).rejects.toMatchObject({
      response: { code: 'MACHINE_NOT_FOUND' },
    });
  });
});

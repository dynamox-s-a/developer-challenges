/**
 * Unitários do MonitoringPointsService com Prisma mockado. Foco nas regras de negócio
 * do enunciado (Pump × TcAg/TcAs, um sensor por ponto, serial único) e na tradução de
 * erros do banco; corridas e locks reais ficam com os e2e contra PostgreSQL.
 */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { deterministicResourceId } from '@dynamox/contracts';

import { MonitoringPointsService } from './monitoring-points.service';
import type { PrismaService } from '../prisma/prisma.service';

const NOW = new Date('2026-08-28T12:00:00.000Z');

const machineRow = (type: 'PUMP' | 'FAN' = 'FAN') => ({
  id: 'm-1',
  name: 'V-200',
  type,
  createdAt: NOW,
  updatedAt: NOW,
});

const pointRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'p-1',
  name: 'Mancal LA',
  machineId: 'm-1',
  externalResourceId: 'a'.repeat(24),
  createdAt: NOW,
  updatedAt: NOW,
  sensor: null,
  ...overrides,
});

function uniqueViolation(target: unknown): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError('unique', {
    code: 'P2002',
    clientVersion: '5.22.0',
    meta: { target },
  });
}

interface TxMock {
  monitoringPoint: { findUnique: jest.Mock; findUniqueOrThrow: jest.Mock };
  sensor: { create: jest.Mock };
  $queryRaw: jest.Mock;
}

function buildService(tx?: TxMock) {
  const prisma = {
    machine: { findUnique: jest.fn() },
    monitoringPoint: { create: jest.fn() },
    $transaction: jest.fn(async (callback: (tx: TxMock) => Promise<unknown>) =>
      callback(tx as TxMock),
    ),
  };
  return { prisma, service: new MonitoringPointsService(prisma as unknown as PrismaService) };
}

/** Transação padrão: ponto sem sensor, máquina presente e lock devolvendo o tipo dado. */
function txWith(type: 'PUMP' | 'FAN', point = pointRow()): TxMock {
  return {
    monitoringPoint: {
      findUnique: jest.fn().mockResolvedValue(point),
      findUniqueOrThrow: jest.fn().mockResolvedValue({
        ...point,
        machine: machineRow(type),
        sensor: { id: 's-1', serialNumber: 'S-1', model: 'HF_PLUS' },
      }),
    },
    sensor: { create: jest.fn().mockResolvedValue({}) },
    $queryRaw: jest.fn().mockResolvedValue([{ name: 'V-200', type }]),
  };
}

describe('MonitoringPointsService.create', () => {
  it('recusa criar ponto para máquina inexistente com 404, sem tocar na tabela', async () => {
    const { prisma, service } = buildService();
    prisma.machine.findUnique.mockResolvedValue(null);

    await expect(service.create({ machineId: 'nao-existe', name: 'P' })).rejects.toMatchObject({
      constructor: NotFoundException,
      response: { code: 'MACHINE_NOT_FOUND' },
    });
    expect(prisma.monitoringPoint.create).not.toHaveBeenCalled();
  });

  it('deriva o resourceId deterministicamente do id imutável da máquina', async () => {
    const { prisma, service } = buildService();
    prisma.machine.findUnique.mockResolvedValue(machineRow());
    prisma.monitoringPoint.create.mockResolvedValue({
      ...pointRow(),
      machine: machineRow(),
      sensor: null,
    });

    await service.create({ machineId: 'm-1', name: 'Mancal LA' });

    const expected = deterministicResourceId(
      'dynamox-challenge',
      'monitoring-point',
      'm-1',
      'Mancal LA',
    );
    expect(expected).toMatch(/^[0-9a-f]{24}$/);
    expect(prisma.monitoringPoint.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ externalResourceId: expected }),
      }),
    );
  });

  it('traduz nome duplicado na mesma máquina (P2002) em 409', async () => {
    const { prisma, service } = buildService();
    prisma.machine.findUnique.mockResolvedValue(machineRow());
    prisma.monitoringPoint.create.mockRejectedValue(uniqueViolation(['machineId', 'name']));

    await expect(service.create({ machineId: 'm-1', name: 'Dup' })).rejects.toMatchObject({
      constructor: ConflictException,
      response: { code: 'MONITORING_POINT_NAME_CONFLICT' },
    });
  });
});

describe('MonitoringPointsService.assignSensor — regras do enunciado', () => {
  it('recusa TcAg e TcAs em máquina Pump com 409, sem criar o sensor', async () => {
    for (const model of ['TcAg', 'TcAs'] as const) {
      const tx = txWith('PUMP');
      const { service } = buildService(tx);

      await expect(
        service.assignSensor('p-1', { serialNumber: 'S-1', model }),
      ).rejects.toMatchObject({ response: { code: 'SENSOR_MODEL_NOT_ALLOWED' } });
      expect(tx.sensor.create).not.toHaveBeenCalled();
    }
  });

  it('aceita HF+ em Pump e TcAg em Fan, gravando o enum interno correspondente', async () => {
    const pumpTx = txWith('PUMP');
    const { service: pumpService } = buildService(pumpTx);
    await pumpService.assignSensor('p-1', { serialNumber: 'S-1', model: 'HF+' });
    expect(pumpTx.sensor.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ model: 'HF_PLUS' }) }),
    );

    const fanTx = txWith('FAN');
    const { service: fanService } = buildService(fanTx);
    await fanService.assignSensor('p-1', { serialNumber: 'S-2', model: 'TcAg' });
    expect(fanTx.sensor.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ model: 'TC_AG' }) }),
    );
  });

  it('recusa segundo sensor no mesmo ponto: máximo um por ponto', async () => {
    const occupied = pointRow({ sensor: { id: 's-1', serialNumber: 'S-1', model: 'HF_PLUS' } });
    const tx = txWith('FAN', occupied);
    const { service } = buildService(tx);

    await expect(
      service.assignSensor('p-1', { serialNumber: 'S-2', model: 'TcAg' }),
    ).rejects.toMatchObject({ response: { code: 'MONITORING_POINT_SENSOR_CONFLICT' } });
  });

  it('responde 404 para ponto inexistente e para máquina removida em corrida', async () => {
    const missingPoint = txWith('FAN');
    missingPoint.monitoringPoint.findUnique.mockResolvedValue(null);
    const { service: a } = buildService(missingPoint);
    await expect(
      a.assignSensor('nao-existe', { serialNumber: 'S-1', model: 'HF+' }),
    ).rejects.toMatchObject({ response: { code: 'MONITORING_POINT_NOT_FOUND' } });

    // A máquina sumiu entre a leitura do ponto e o lock: o SELECT volta vazio.
    const orphan = txWith('FAN');
    orphan.$queryRaw.mockResolvedValue([]);
    const { service: b } = buildService(orphan);
    await expect(
      b.assignSensor('p-1', { serialNumber: 'S-1', model: 'HF+' }),
    ).rejects.toMatchObject({ response: { code: 'MONITORING_POINT_NOT_FOUND' } });
  });

  it('desambigua o P2002 pelo alvo do índice, em qualquer formato do Prisma', async () => {
    const cases: Array<{ target: unknown; code: string }> = [
      { target: ['serialNumber'], code: 'SENSOR_SERIAL_CONFLICT' },
      { target: 'sensors_serialNumber_key', code: 'SENSOR_SERIAL_CONFLICT' },
      { target: ['monitoringPointId'], code: 'MONITORING_POINT_SENSOR_CONFLICT' },
      // Alvo irreconhecível nunca vira um código errado: cai no conflito genérico.
      { target: undefined, code: 'SENSOR_CONFLICT' },
    ];

    for (const { target, code } of cases) {
      const tx = txWith('FAN');
      tx.sensor.create.mockRejectedValue(uniqueViolation(target));
      const { service } = buildService(tx);

      await expect(
        service.assignSensor('p-1', { serialNumber: 'S-1', model: 'TcAs' }),
      ).rejects.toMatchObject({ response: { code } });
    }
  });
});

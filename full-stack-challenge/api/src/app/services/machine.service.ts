import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import PageQueryOptions from 'api/src/app/core/types/page-query-options.type';
import PageResult from 'api/src/app/core/types/page-result.type';
import Machine from 'api/src/app/models/machine.model';
import { Connection, Types } from 'mongoose';
import BaseService from '../core/base.service';
import MachineRepository from '../repositories/machine.repository';

@Injectable()
export default class MachineService extends BaseService<Machine> {
  @InjectConnection()
  private connection: Connection;

  constructor(@Inject(MachineRepository) repository) {
    super(repository);
  }

  async insert(props: Machine): Promise<Machine> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const machine = await super.insert(<Machine>props, session);

      await session.commitTransaction();
      return machine;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async update(id: Types.ObjectId | string, props: Machine): Promise<Machine> {
    let machine = await super.findById(id);
    if (!machine) {
      throw new NotFoundException('Máquina não encontrada', 'machine');
    }
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      machine = await super.update(
        machine._id,
        { ...machine, ...props } as Machine,
        session
      );

      await session.commitTransaction();
      return machine;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async removeMonitoringPoints(
    Ids: Types.ObjectId[] | string[],
    pointIds: Types.ObjectId[] | string[]
  ): Promise<Machine[]> {
    const machines: any = await this.list({ where: { _id: { $in: Ids } } });

    if ((await machines.length) < 1) {
      throw new NotFoundException(
        'Nenhuma máquina encontrada',
        'machines_not_found'
      );
    }

    const updatedMachines = machines?.map(async (machine) => {
      const monitoringPoints = machine.monitoringPoints;
      const newPointsList = monitoringPoints?.filter(
        (point) => !pointIds.includes(point._id)
      );
      machine.monitoringPoints = newPointsList;
      await super.update(machine._id, machine);
    });

    return updatedMachines;
  }

  async pageablePublic(
    queryOptions: PageQueryOptions<Machine>
  ): Promise<PageResult<Machine>> {
    return (<MachineRepository>this.repository).pageablePublic(queryOptions);
  }

  transformMonitoringPoints(machines) {
    const result = [];

    machines.forEach((machine) => {
      machine.monitoringPoints.forEach((point) => {
        result.push({
          _id: point?._id,
          name: machine?.name || '-',
          userId: point?.userId,
          sensorId: point?.sensors?.[0]._id,
          sensorModelName: point?.sensors?.[0].modelName,
          machineId: machine?._id,
          machineName: machine?.name,
          machineStatus: machine?.status,
          machineType: machine?.type,
          createdAt: machine?.createdAt || '-',
          updatedAt: machine?.updatedAt || '-',
        });
      });
    });

    return result;
  }

  async getMachineByMonitoringPointsUserId({
    userId,
  }: {
    userId: Types.ObjectId;
  }): Promise<Machine[]> {
    const response = await (<MachineRepository>(
      this.repository
    )).getByMonitoringPointsUserId({
      userId,
    });

    const machineWithFilteredPoints = response.map((machine) => {
      const monitoringPoints = machine.monitoringPoints.filter((point) =>
        point.userId.equals(userId)
      );
      return {
        _id: machine?._id,
        name: machine?.name,
        status: machine?.status,
        type: machine?.type,
        monitoringPoints,
      };
    });
    const result = this.transformMonitoringPoints(machineWithFilteredPoints);

    return result;
  }
}

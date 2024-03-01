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

      machine = await super.update(machine._id, <Machine>props, session);

      await session.commitTransaction();
      return machine;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async pageablePublic(
    queryOptions: PageQueryOptions<Machine>
  ): Promise<PageResult<Machine>> {
    return (<MachineRepository>this.repository).pageablePublic(queryOptions);
  }

  async getMachineByMonitoringPointsUserId({
    userId,
  }: {
    userId: Types.ObjectId;
  }): Promise<Machine[]> {
    return (<MachineRepository>this.repository).getByMonitoringPointsUserId({
      userId,
    });
  }
}

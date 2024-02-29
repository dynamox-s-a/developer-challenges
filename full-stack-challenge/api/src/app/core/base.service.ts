import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { ClientSession, Types } from 'mongoose';
import BaseModel from './base.model';
import BaseRepository from './base.repository';
import PageQueryOptions from './types/page-query-options.type';
import PageResult from './types/page-result.type';
import QueryOptions from './types/query-options.type';

@Injectable()
export default class BaseService<T extends BaseModel> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async insert(props: T, ...args: any[]): Promise<T> {
    return this.repository.insert(props, last(args));
  }

  async update(
    id: Types.ObjectId | string,
    props: T,
    ...args: any[]
  ): Promise<T> {
    return this.repository.update(id, props, last(args));
  }

  async deleteById(
    id: Types.ObjectId | string,
    session?: ClientSession
  ): Promise<void> {
    await this.repository.deleteById(id, session);
  }

  async deleteByCriteria(
    queryOptions: QueryOptions<T>,
    session?: ClientSession
  ): Promise<void> {
    await this.repository.deleteByCriteria(queryOptions, session);
  }

  async disableById(
    id: Types.ObjectId | string,
    session?: ClientSession
  ): Promise<void> {
    await this.repository.disableById(id, session);
  }

  async restoreById(
    id: Types.ObjectId | string,
    session?: ClientSession
  ): Promise<void> {
    await this.repository.restoreById(id, session);
  }

  async count(
    queryOptions?: QueryOptions<T>,
    session?: ClientSession
  ): Promise<number> {
    return this.repository.count(queryOptions, session);
  }

  async findById(
    id: Types.ObjectId | string,
    queryOptions?: QueryOptions<T>,
    session?: ClientSession
  ): Promise<T> {
    return this.repository.findById(id, queryOptions, session);
  }

  async findOne(
    queryOptions?: QueryOptions<T>,
    session?: ClientSession
  ): Promise<T> {
    return this.repository.findOne(queryOptions, session);
  }

  async list(
    queryOptions?: QueryOptions<T>,
    session?: ClientSession
  ): Promise<T[]> {
    return this.repository.list(queryOptions, session);
  }

  async pageable(
    queryOptions?: PageQueryOptions<T>,
    session?: ClientSession
  ): Promise<PageResult<T>> {
    return this.repository.pageable(queryOptions, session);
  }
}

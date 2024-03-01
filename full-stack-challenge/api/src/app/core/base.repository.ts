import { Injectable } from '@nestjs/common';
import { mapValues, pick } from 'lodash';
import {
  ClientSession,
  FilterQuery,
  Model,
  QueryOptions,
  Types,
} from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import BaseModel from './base.model';
import PageQueryOptions from './types/page-query-options.type';
import PageResult from './types/page-result.type';
import QueryOptionsType from './types/query-options.type';

@Injectable()
export default class BaseRepository<T extends BaseModel> {
  constructor(
    private model: Model<T>,
    private criteriaQueryBuilder: (args: string) => FilterQuery<T>
  ) {}

  protected parseQueryOptions(
    queryOptions: QueryOptionsType<T>
  ): [FilterQuery<T>, QueryOptions] {
    const options: QueryOptions = <QueryOptions>(
      pick(queryOptions, ['populate'])
    );

    if (queryOptions?.orderBy) {
      options.sort = {
        [queryOptions.orderBy]: queryOptions.orderDirection === 'desc' ? -1 : 1,
      };
    }

    if (queryOptions?.criteria) {
      return [this.criteriaQueryBuilder(queryOptions.criteria), options];
    }
    if (queryOptions?.where) {
      return [
        <FilterQuery<T>>(
          mapValues(queryOptions.where, (x) =>
            x !== null &&
            x !== undefined &&
            typeof x === 'string' &&
            x.match(/^[a-fA-F0-9]{24}$/)
              ? new Types.ObjectId(x)
              : x
          )
        ),
        options,
      ];
    }

    return [undefined, options];
  }

  async insert(props: T, session?: ClientSession): Promise<T> {
    props.createdAt = new Date();
    props.updatedAt = new Date();
    // @ts-expect-error: Unreachable code error
    if (props.name) {
      // @ts-expect-error: Unreachable code error
      props.normalizedName = props.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }
    const modelInstance = await new this.model(props).save({ session });
    return modelInstance.toObject();
  }

  async update(
    id: Types.ObjectId | string,
    props: T,
    session?: ClientSession
  ): Promise<T> {
    props.updatedAt = new Date();
    // @ts-expect-error: Unreachable code error
    if (props.name) {
      // @ts-expect-error: Unreachable code error
      props.normalizedName = props.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }
    return (
      this.model
        // @ts-expect-error: Unreachable code error
        .findByIdAndUpdate(id, props, { new: true, session })
        .lean({ virtuals: true })
    );
  }

  async deleteById(
    id: Types.ObjectId | string,
    session?: ClientSession
  ): Promise<void> {
    await this.model.findByIdAndDelete(id).setOptions({ session }).exec();
  }

  async deleteByCriteria(
    queryOptions: QueryOptionsType<T>,
    session?: ClientSession
  ): Promise<void> {
    const [query] = this.parseQueryOptions(queryOptions);
    await this.model.deleteMany(query).setOptions({ session }).exec();
  }

  async disableById(
    id: Types.ObjectId | string,
    session?: ClientSession
  ): Promise<void> {
    await (<SoftDeleteModel<T>>this.model)
      .deleteById(id)
      .setOptions({ session })
      .lean();
  }

  async disableByCriteria(
    queryOptions: QueryOptionsType<T>,
    session?: ClientSession
  ): Promise<void> {
    const [query] = this.parseQueryOptions(queryOptions);
    await (<SoftDeleteModel<T>>this.model)
      .delete(query)
      .setOptions({ session })
      .exec();
  }

  async restoreById(
    id: Types.ObjectId | string,
    session?: ClientSession
  ): Promise<void> {
    await (<SoftDeleteModel<T>>this.model)
      .restore({ _id: id })
      .setOptions({ session })
      .lean({ virtuals: true });
  }

  async count(
    queryOptions?: QueryOptionsType<T>,
    session?: ClientSession
  ): Promise<number> {
    const [query] = this.parseQueryOptions(queryOptions);
    return this.model.countDocuments(query).setOptions({ session }).exec();
  }

  async findById(
    id: Types.ObjectId | string,
    queryOptions?: QueryOptionsType<T>,
    session?: ClientSession
  ): Promise<T> {
    const [, options] = this.parseQueryOptions(queryOptions);
    return this.model
      .findById(id)
      .setOptions({ ...options, session })
      .lean({ virtuals: true });
  }

  async findOne(
    queryOptions?: QueryOptionsType<T>,
    session?: ClientSession
  ): Promise<T> {
    const [query, options] = this.parseQueryOptions(queryOptions);

    const method =
      queryOptions?.withDeleted ?? false
        ? (<SoftDeleteModel<T>>this.model).findOneWithDeleted(query)
        : this.model.findOne(query);

    return method.setOptions({ ...options, session }).lean({ virtuals: true });
  }

  async list(
    queryOptions?: QueryOptionsType<T>,
    session?: ClientSession
  ): Promise<T[]> {
    const [query, options] = this.parseQueryOptions(queryOptions);

    const method =
      queryOptions?.withDeleted ?? false
        ? (<SoftDeleteModel<T>>this.model).findWithDeleted(query)
        : this.model.find(query);

    return method.setOptions({ ...options, session }).lean({ virtuals: true });
  }

  async pageable(
    queryOptions?: PageQueryOptions<T>,
    session?: ClientSession
  ): Promise<PageResult<T>> {
    const [query, options] = this.parseQueryOptions(queryOptions);

    if (!options.sort?._id) {
      options.sort = { ...options?.sort, _id: 1 };
    }

    const find = queryOptions.withDeleted
      ? (<SoftDeleteModel<T>>this.model).findWithDeleted(query)
      : this.model.find(query);

    const count = queryOptions.withDeleted
      ? (<SoftDeleteModel<T>>this.model).countDocumentsWithDeleted(query)
      : this.model.countDocuments(query);

    const [data, total] = await Promise.all([
      find
        .setOptions({
          ...options,
          projection: {
            _id: 1,
            createdAt: 1,
            name: 1,
            status: 1,
            type: 1,
          },
          skip: (queryOptions.page - 1) * queryOptions.size,
          limit: queryOptions.size,
          session,
        })
        .collation({
          locale: 'pt',
          caseLevel: false,
        })
        .lean({ virtuals: true })
        .exec(),
      count.exec(),
    ]);

    return {
      // @ts-expect-error: Unreachable code error
      data,
      total,
    };
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.model
      .aggregate<any>(pipeline)
      .collation({
        locale: 'pt',
        caseLevel: false,
        strength: 1,
      })
      .allowDiskUse(true)
      .exec();
  }
}

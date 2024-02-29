import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import PageQueryOptions from 'api/src/app/core/types/page-query-options.type';
import PageResult from 'api/src/app/core/types/page-result.type';
import { head } from 'lodash';
import BaseRepository from '../core/base.repository';
import User from '../models/user.model';

@Injectable()
export default class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) model) {
    super(model, (param: string) => ({
      $or: [
        { name: { $regex: param, $options: 'i' } },
        { normalizedName: { $regex: param, $options: 'i' } },
        { shortName: { $regex: param, $options: 'i' } },
        { email: { $regex: param, $options: 'i' } },
      ],
    }));
  }

  async pageable(
    queryOptions?: PageQueryOptions<User>
  ): Promise<PageResult<User>> {
    const [query, options] = this.parseQueryOptions(queryOptions);

    // eslint-disable-next-line no-prototype-builtins
    if (!options?.sort?.hasOwnProperty('name')) {
      options.sort = { ...options?.sort, name: 1 };
    }

    const result = await this.aggregate([
      {
        $match: {
          ...(query || {}),
          deleted: queryOptions.withDeleted ? { $ne: null } : false,
        },
      },
      {
        $sort: {
          ...options.sort,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: (queryOptions.page - 1) * queryOptions.size,
            },
            {
              $limit: queryOptions.size,
            },
          ],
          total: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $unwind: '$total',
      },
    ]);

    return {
      data: head(result)?.data || [],
      total: head(result)?.total?.count || 0,
    };
  }
}

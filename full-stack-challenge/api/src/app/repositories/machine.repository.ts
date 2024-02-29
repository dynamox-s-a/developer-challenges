import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Machine from 'api/src/app//models/machine.model';
import PageQueryOptions from 'api/src/app/core/types/page-query-options.type';
import PageResult from 'api/src/app/core/types/page-result.type';
import { head } from 'lodash';
import BaseRepository from '../core/base.repository';

@Injectable()
export default class MachineRepository extends BaseRepository<Machine> {
  constructor(@InjectModel(Machine.name) model) {
    super(model, (param: string) => ({
      name: { $regex: param, $options: 'i' },
    }));
  }

  async pageablePublic(
    queryOptions: PageQueryOptions<Machine>
  ): Promise<PageResult<Machine>> {
    const [query, options] = this.parseQueryOptions(queryOptions);

    const result = await this.aggregate([
      {
        $match: {
          ...(query || {}),
          deleted: queryOptions.withDeleted ? { $ne: null } : false,
        },
      },
      {
        $project: {
          deleted: 0,
          type: 0,
          createdAt: 0,
          updatedAt: 0,
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

import { FilterQuery, PopulateOptions } from 'mongoose';
import BaseModel from '../base.model';

export default interface QueryOptions<T extends BaseModel> {
  where?: FilterQuery<T>;
  criteria?: string;
  populate?: string | PopulateOptions | PopulateOptions[];
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  withDeleted?: boolean;
}

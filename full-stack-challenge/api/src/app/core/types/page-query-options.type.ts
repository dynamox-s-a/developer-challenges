import BaseModel from '../base.model';
import QueryOptions from './query-options.type';

export default interface PageQueryOptions<T extends BaseModel>
  extends QueryOptions<T> {
  page: number;
  size?: number;
}

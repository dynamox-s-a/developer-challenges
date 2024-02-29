import BaseModel from "../base.model";

export default interface PageResult<T extends BaseModel> {
  data: T[];
  total: number;
}

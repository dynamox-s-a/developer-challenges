export type IFilter = {
  orderBy: string;
  order?: string;
  select?: Array<string>;
  page?: number,
  limit?: number | undefined,
  populate?: any,
  value?: object,
};

export interface PaginatedDTO {
  count: number;
  next: number;
  previous: number;
  resultData: Array<any>;
}

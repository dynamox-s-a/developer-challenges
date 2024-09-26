export type IFilter = {
  orderBy: string;
  order?: string;
  select?: Array<string>;
};

export interface PaginatedDTO {
  count: number;
  next: number;
  previous: number;
  resultData: Array<any>;
}

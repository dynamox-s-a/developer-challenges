import { Dispatch, SetStateAction } from "react";

interface IPagination {
  page: number;
  limit: number;
}

export enum ColumnOrder {
  asc = "ASC",
  desc = "DESC",
}
interface ITableSort {
  orderBy: string;
  order: ColumnOrder;
}

type SetStateFunction<T = any> = Dispatch<SetStateAction<T>>;

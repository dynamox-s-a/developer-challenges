import { Dispatch, SetStateAction } from "react";

interface IPagination {
  page: number;
  limit: number;
}

type SetStateFunction<T = any> = Dispatch<SetStateAction<T>>;

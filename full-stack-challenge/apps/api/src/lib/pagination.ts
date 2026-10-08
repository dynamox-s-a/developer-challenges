import type { PaginationMeta } from '@dynapredict/shared-types';
import { z } from 'zod';

export const MAX_PAGE_SIZE = 100;

/** Query schema for `?page&pageSize`, with a per-endpoint default page size. */
export function paginationQuery(defaultPageSize: number) {
  return z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .max(MAX_PAGE_SIZE)
      .default(defaultPageSize),
  });
}

export interface PageRequest {
  page: number;
  pageSize: number;
}

/** Prisma `skip`/`take` for a page. */
export function pageArgs({ page, pageSize }: PageRequest) {
  return { skip: (page - 1) * pageSize, take: pageSize };
}

export function paginationMeta(
  { page, pageSize }: PageRequest,
  total: number,
): PaginationMeta {
  return { page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
}

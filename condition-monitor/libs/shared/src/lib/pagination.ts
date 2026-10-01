import { z } from 'zod';

export const MAX_PAGE_SIZE = 100;

/** A page of a list, as every paginated route answers it (API contract, "Pagination"). */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type SortOrder = 'asc' | 'desc';

/**
 * Query of a paginated list. Values arrive as text in the URL, so numbers are coerced;
 * each list declares the columns it can be sorted by and its default page size. The
 * primary key is always the last sort key, applied by the API, so items never skip or
 * repeat between pages (assumption B8).
 */
export function paginationQuerySchema<const Keys extends readonly [string, ...string[]]>(options: {
  sortKeys: Keys;
  defaultSort: Keys[number];
  defaultPageSize: number;
}) {
  const sortMessage = `Must be one of: ${options.sortKeys.join(', ')}.`;
  return z.object({
    page: z.coerce
      .number({ error: 'Must be a whole number from 1.' })
      .int('Must be a whole number from 1.')
      .min(1, 'Must be a whole number from 1.')
      .default(1),
    pageSize: z.coerce
      .number({ error: `Must be a whole number from 1 to ${MAX_PAGE_SIZE}.` })
      .int(`Must be a whole number from 1 to ${MAX_PAGE_SIZE}.`)
      .min(1, `Must be a whole number from 1 to ${MAX_PAGE_SIZE}.`)
      .max(MAX_PAGE_SIZE, `Must be a whole number from 1 to ${MAX_PAGE_SIZE}.`)
      .default(options.defaultPageSize),
    sort: z.enum(options.sortKeys, { error: sortMessage }).default(options.defaultSort),
    order: z.enum(['asc', 'desc'], { error: 'Must be asc or desc.' }).default('asc'),
  });
}

import { z } from "zod";

export const idSchema = z.string().uuid();
export const isoDateTimeSchema = z.string().datetime({ offset: true });
export const nameSchema = z.string().trim().min(1).max(120);
export const sortOrderSchema = z.enum(["asc", "desc"]);

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type SortOrder = z.infer<typeof sortOrderSchema>;

/**
 * @fileoverview Shared pagination schemas used across paginated list endpoints.
 * PaginationQuerySchema defines query params; PaginationMetadataSchema defines response metadata.
 */
import { Type, Static } from '@sinclair/typebox';

export const PaginationQuerySchema = Type.Object({
  page: Type.Optional(Type.Number({ minimum: 1, description: 'Page number (1-based)' })),
  pageSize: Type.Optional(Type.Number({ minimum: 1, maximum: 100, description: 'Number of items per page' })),
});

export const PaginationMetadataSchema = Type.Object({
  currentPage: Type.Number(),
  pageSize: Type.Number(),
  totalPages: Type.Number(),
  totalElements: Type.Number(),
  hasNextPage: Type.Boolean(),
});

// Types

export type PaginationQuery = Static<typeof PaginationQuerySchema>;
export type PaginationMetadata = Static<typeof PaginationMetadataSchema>;

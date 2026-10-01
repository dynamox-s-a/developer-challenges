import { NotFoundException, ParseUUIDPipe } from '@nestjs/common';

/**
 * Checks a route id before any query. A value that is not a UUID cannot identify a
 * record, so it answers 404 like any id that does not exist, instead of reaching the
 * database and failing there as a 500.
 */
export const uuidParam = (resource: string) =>
  new ParseUUIDPipe({ exceptionFactory: () => new NotFoundException(`${resource} not found.`) });

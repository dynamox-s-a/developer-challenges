import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ingestReadingsSchema,
  type IngestionReport,
  type SessionUser,
} from '@condition-monitor/shared';
import { CurrentUser } from '../auth/current-user.decorator';
import { importRejected } from '../common/problem/problems';
import { IngestionService, JSON_LOCATOR } from './ingestion.service';

/**
 * Readings sent as JSON, by the simulator (C3). The body is parsed here rather than by
 * the global pipe, so that each error names the reading by its index, like a CSV error
 * names its line.
 */
@Controller('readings')
export class ReadingsController {
  constructor(private readonly ingestion: IngestionService) {}

  /** 200 rather than 201: a valid submission may store nothing new (C5). */
  @Post()
  @HttpCode(200)
  ingest(@CurrentUser() user: SessionUser, @Body() body: unknown): Promise<IngestionReport> {
    const parsed = ingestReadingsSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => {
        const [list, index, ...field] = issue.path;
        return list === 'readings' && typeof index === 'number'
          ? { index, field: field.join('.') || 'reading', message: issue.message }
          : { field: issue.path.join('.') || 'body', message: issue.message };
      });
      const invalid = new Set(errors.map((error) => ('index' in error ? error.index : -1))).size;
      throw importRejected('reading', errors, invalid);
    }
    return this.ingestion.ingest(user.id, parsed.data.readings, JSON_LOCATOR);
  }
}

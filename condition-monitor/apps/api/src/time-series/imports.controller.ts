import { Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  MAX_UPLOAD_BYTES,
  type IngestionReport,
  type SessionUser,
} from '@condition-monitor/shared';
import { CurrentUser } from '../auth/current-user.decorator';
import { fileRejected, importRejected } from '../common/problem/problems';
import { csvField, readCsv } from './csv-readings';
import { IngestionService } from './ingestion.service';

/**
 * A CSV file of readings uploaded from the interface (C3, C11, C12). It is stored
 * directly, with no preview step: all or nothing already guarantees that nothing is
 * stored halfway (E2).
 */
@Controller('imports')
export class ImportsController {
  constructor(private readonly ingestion: IngestionService) {}

  /** 200 rather than 201: a valid file may store nothing new (C5). */
  @Post()
  @HttpCode(200)
  @UseInterceptors(
    // Kept in memory: at most 2 MB, read once and dropped, never written to disk.
    FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 } }),
  )
  async import(
    @CurrentUser() user: SessionUser,
    @UploadedFile() file: { buffer: Buffer } | undefined,
  ): Promise<IngestionReport> {
    if (!file) throw fileRejected('Attach a CSV file in the field "file".');

    const csv = readCsv(file.buffer);
    if (!csv.ok && 'fileError' in csv) throw fileRejected(csv.fileError);
    if (!csv.ok) throw importRejected('line', csv.lineErrors, csv.invalidLines);

    return this.ingestion.ingest(user.id, csv.readings, {
      unit: 'line',
      key: 'line',
      of: (position) => csv.lines[position],
      field: csvField,
    });
  }
}

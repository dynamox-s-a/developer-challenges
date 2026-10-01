import { readCsv, type CsvResult } from './csv-readings';

const HEADER = 'serial_number,timestamp,quantity,axis,value';

function csv(...lines: string[]): Buffer {
  return Buffer.from(lines.join('\n'), 'utf8');
}

function fileErrorOf(result: CsvResult): string | undefined {
  return !result.ok && 'fileError' in result ? result.fileError : undefined;
}

function lineErrorsOf(result: CsvResult) {
  return !result.ok && 'lineErrors' in result ? result.lineErrors : [];
}

describe('readCsv', () => {
  it('reads the example of C11, with an empty axis for temperature', () => {
    const result = readCsv(
      csv(
        HEADER,
        'DX-001234,2026-09-29T10:00:00Z,velocity_rms,H,2.31',
        'DX-001234,2026-09-29T10:00:00Z,temperature,,48.2',
      ),
    );

    expect(result).toEqual({
      ok: true,
      readings: [
        {
          serialNumber: 'DX-001234',
          timestamp: '2026-09-29T10:00:00.000Z',
          quantity: 'velocity_rms',
          axis: 'H',
          value: 2.31,
        },
        {
          serialNumber: 'DX-001234',
          timestamp: '2026-09-29T10:00:00.000Z',
          quantity: 'temperature',
          axis: null,
          value: 48.2,
        },
      ],
      lines: [2, 3],
    });
  });

  it('matches columns by name in any order, and accepts a BOM, CRLF and blank lines', () => {
    const result = readCsv(
      Buffer.from(
        '﻿Value,Axis,Quantity,Timestamp,Serial_Number\r\n\r\n1.5,V,acceleration_rms,2026-09-29T10:00:00-03:00,dx-0001\r\n',
        'utf8',
      ),
    );

    expect(result).toMatchObject({
      ok: true,
      readings: [
        { serialNumber: 'DX-0001', axis: 'V', value: 1.5, timestamp: '2026-09-29T13:00:00.000Z' },
      ],
      // The blank line still counts, so the line number matches the editor.
      lines: [3],
    });
  });

  it('accepts negatives, exponents and a quoted field', () => {
    const result = readCsv(
      csv(
        HEADER,
        'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,-0.5',
        'DX-0001,2026-09-29T10:10:00Z,velocity_rms,H,1e-3',
        '"DX-0001","2026-09-29T10:20:00Z","velocity_rms","H","2"',
      ),
    );

    expect(result.ok && result.readings.map((reading) => reading.value)).toEqual([-0.5, 0.001, 2]);
  });

  it('refuses semicolons as a whole, saying why (C12)', () => {
    const result = readCsv(
      csv(
        'serial_number;timestamp;quantity;axis;value',
        'DX-0001;2026-09-29T10:00:00Z;velocity_rms;H;2,31',
      ),
    );

    expect(fileErrorOf(result)).toMatch(/separated by semicolons/);
  });

  it('points at a decimal comma, which splits a value in two', () => {
    const result = readCsv(csv(HEADER, 'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2,31'));

    expect(lineErrorsOf(result)).toEqual([
      {
        line: 2,
        field: 'line',
        message:
          'Expected 5 columns, found 6. A decimal comma, as in 2,31, splits a value in two; use a dot.',
      },
    ]);
  });

  it('refuses a value that is not a plain decimal with a dot', () => {
    const result = readCsv(
      csv(
        HEADER,
        'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,',
        'DX-0001,2026-09-29T10:10:00Z,velocity_rms,H,"2,31"',
        'DX-0001,2026-09-29T10:20:00Z,velocity_rms,H,NaN',
        'DX-0001,2026-09-29T10:30:00Z,velocity_rms,H,1e400',
      ),
    );

    expect(lineErrorsOf(result).map(({ line, field }) => [line, field])).toEqual([
      [2, 'value'],
      [3, 'value'],
      [4, 'value'],
      [5, 'value'],
    ]);
  });

  it('lists every problem of every line, with the CSV column names', () => {
    const result = readCsv(
      csv(
        HEADER,
        'DX-0001,2026-09-29T10:00:00Z,velocity_rms,H,2.31',
        'DX-0001,2026-09-29T10:00:00,displacement,H,1',
        'DX-0001,2026-09-29T10:00:00Z,temperature,H,40',
      ),
    );

    expect(result).toMatchObject({ ok: false, invalidLines: 2 });
    expect(lineErrorsOf(result).map(({ line, field }) => [line, field])).toEqual([
      [3, 'timestamp'],
      [3, 'quantity'],
      [4, 'axis'],
    ]);
  });

  it('refuses a header missing a column, with an unknown one, or repeating one', () => {
    expect(fileErrorOf(readCsv(csv('serial_number,timestamp,quantity,value', 'x')))).toMatch(
      /missing axis/,
    );
    expect(fileErrorOf(readCsv(csv(`${HEADER},unit`, 'x')))).toMatch(/unknown unit/);
    expect(fileErrorOf(readCsv(csv(`${HEADER},axis`, 'x')))).toMatch(/repeated axis/);
  });

  it('refuses an empty file, a header alone and text that is not UTF-8', () => {
    expect(fileErrorOf(readCsv(Buffer.alloc(0)))).toBe('The file is empty.');
    expect(fileErrorOf(readCsv(csv(HEADER)))).toBe('The file has a header but no readings.');
    // "é" in Latin-1, as some spreadsheets save it.
    expect(fileErrorOf(readCsv(Buffer.from([0x63, 0x61, 0x66, 0xe9])))).toMatch(/not UTF-8/);
  });

  it('refuses a malformed quote, naming the line', () => {
    const result = readCsv(csv(HEADER, 'DX-0001,"2026-09-29T10:00:00Z,velocity_rms,H,1'));

    expect(fileErrorOf(result)).toMatch(/not valid CSV/);
  });

  it('accepts 2,000 readings and refuses 2,001 as a whole (C8)', () => {
    const line = (n: number) =>
      `DX-0001,${new Date(Date.UTC(2026, 0, 1) + n * 60_000).toISOString()},velocity_rms,H,1`;
    const lines = Array.from({ length: 2_001 }, (_, n) => line(n));

    expect(readCsv(csv(HEADER, ...lines.slice(0, 2_000))).ok).toBe(true);
    expect(fileErrorOf(readCsv(csv(HEADER, ...lines)))).toBe(
      'The file has 2,001 readings; at most 2,000 are accepted per file.',
    );
  });
});

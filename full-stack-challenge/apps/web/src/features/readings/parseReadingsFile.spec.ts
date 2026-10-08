import {
  MAX_REPORTED_ERRORS,
  normalizeTimestamp,
  parseReadingsFile,
} from './parseReadingsFile';

const local = (text: string) => new Date(text).toISOString();

describe('normalizeTimestamp', () => {
  it('keeps instants that carry an offset', () => {
    expect(normalizeTimestamp('2026-10-01T12:00:00Z')).toBe(
      '2026-10-01T12:00:00.000Z',
    );
    expect(normalizeTimestamp('2026-10-01T09:00:00-03:00')).toBe(
      '2026-10-01T12:00:00.000Z',
    );
  });

  it('reads date-times without an offset in local time', () => {
    expect(normalizeTimestamp('2026-10-01 12:30')).toBe(
      local('2026-10-01T12:30'),
    );
    expect(normalizeTimestamp('2026-10-01')).toBe(local('2026-10-01T00:00'));
  });

  it('accepts epoch milliseconds', () => {
    expect(normalizeTimestamp(Date.UTC(2026, 9, 1))).toBe(
      '2026-10-01T00:00:00.000Z',
    );
  });

  it.each([['yesterday'], [''], [null], [{}]])('rejects %o', (raw) => {
    expect(normalizeTimestamp(raw)).toBeNull();
  });
});

describe('parseReadingsFile', () => {
  describe('CSV', () => {
    it('reads a comma-separated file with a header', () => {
      const result = parseReadingsFile(
        'series.csv',
        'timestamp,value\n2026-10-01T12:00:00Z,1.5\n2026-10-01T12:05:00Z,-2\n',
      );
      expect(result).toEqual({
        readings: [
          { timestamp: '2026-10-01T12:00:00.000Z', value: 1.5 },
          { timestamp: '2026-10-01T12:05:00.000Z', value: -2 },
        ],
        errors: [],
        invalidCount: 0,
      });
    });

    it('finds the columns by header name in any order', () => {
      const result = parseReadingsFile(
        'series.csv',
        'Value,Timestamp\r\n3,2026-10-01T12:00:00Z\r\n',
      );
      expect(result.readings).toEqual([
        { timestamp: '2026-10-01T12:00:00.000Z', value: 3 },
      ]);
    });

    it('accepts semicolons with a decimal comma, as pt-BR spreadsheets export', () => {
      const result = parseReadingsFile(
        'planilha.csv',
        'timestamp;value\n2026-10-01T12:00:00Z;12,5\n',
      );
      expect(result.readings[0].value).toBe(12.5);
    });

    it('works without a header row', () => {
      const result = parseReadingsFile(
        'series.csv',
        '2026-10-01T12:00:00Z,1\n2026-10-01T12:05:00Z,2\n',
      );
      expect(result.readings).toHaveLength(2);
    });

    it('reports bad lines by number', () => {
      const result = parseReadingsFile(
        'series.csv',
        'timestamp,value\n2026-10-01T12:00:00Z,1\nnot a date,2\n2026-10-01T12:10:00Z,abc\n',
      );
      expect(result.readings).toHaveLength(1);
      expect(result.errors).toEqual([
        'Line 3: invalid timestamp "not a date"',
        'Line 4: invalid value "abc"',
      ]);
      expect(result.invalidCount).toBe(2);
    });

    it(`lists at most ${MAX_REPORTED_ERRORS} problems but counts them all`, () => {
      const lines = Array.from({ length: 8 }, () => 'bad,row').join('\n');
      const result = parseReadingsFile('series.csv', lines);
      expect(result.errors).toHaveLength(MAX_REPORTED_ERRORS);
      expect(result.invalidCount).toBe(8);
    });
  });

  describe('JSON', () => {
    it('reads an array of readings', () => {
      const result = parseReadingsFile(
        'series.json',
        JSON.stringify([
          { timestamp: '2026-10-01T12:00:00Z', value: 1 },
          { timestamp: Date.UTC(2026, 9, 1, 12, 5), value: 2 },
        ]),
      );
      expect(result.readings).toEqual([
        { timestamp: '2026-10-01T12:00:00.000Z', value: 1 },
        { timestamp: '2026-10-01T12:05:00.000Z', value: 2 },
      ]);
    });

    it('reads the API body shape and detects JSON by content', () => {
      const result = parseReadingsFile(
        'export.txt',
        '{"readings":[{"timestamp":"2026-10-01T12:00:00Z","value":4}]}',
      );
      expect(result.readings).toHaveLength(1);
    });

    it('reports invalid items by position', () => {
      const result = parseReadingsFile(
        'series.json',
        '[{"timestamp":"2026-10-01T12:00:00Z","value":"high"}]',
      );
      expect(result.errors).toEqual(['Item 1: invalid value "high"']);
    });

    it.each([
      ['{not json', 'The file is not valid JSON'],
      [
        '{"data":[]}',
        'Expected an array of {"timestamp", "value"} or {"readings": [...]}',
      ],
    ])('explains a malformed file %s', (text, message) => {
      expect(parseReadingsFile('series.json', text).errors).toEqual([message]);
    });
  });

  it('flags an empty file', () => {
    expect(parseReadingsFile('empty.csv', '\n\n').errors).toEqual([
      'The file has no readings',
    ]);
  });
});

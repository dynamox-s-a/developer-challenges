import { parseSamplesCsv } from './parse-samples-csv';

describe('parseSamplesCsv', () => {
  it('should read one sample per line', () => {
    const csv = '2026-11-22T10:00:00Z,31.5\n2026-11-22T07:10:00-03:00,-2';

    expect(parseSamplesCsv(csv)).toEqual({
      ok: true,
      samples: [
        { timestamp: '2026-11-22T10:00:00Z', value: 31.5 },
        { timestamp: '2026-11-22T07:10:00-03:00', value: -2 },
      ],
      lines: [1, 2],
    });
  });

  it('should skip a header, blank lines and spaces', () => {
    const csv =
      'instante,valor\r\n\r\n 2026-11-22T10:00:00Z , 31.5 \r\n\r\n2026-11-22T10:10:00Z,32\r\n';

    expect(parseSamplesCsv(csv)).toEqual({
      ok: true,
      samples: [
        { timestamp: '2026-11-22T10:00:00Z', value: 31.5 },
        { timestamp: '2026-11-22T10:10:00Z', value: 32 },
      ],
      // As linhas do arquivo, contando o cabeçalho e as linhas em branco
      lines: [3, 5],
    });
  });

  it('should ignore the invisible BOM that Excel puts at the start', () => {
    const csv = '\uFEFF2026-11-22T10:00:00Z,31.5';

    expect(parseSamplesCsv(csv)).toEqual({
      ok: true,
      samples: [{ timestamp: '2026-11-22T10:00:00Z', value: 31.5 }],
      lines: [1],
    });
  });

  it('should read the Excel format, with ";" and decimal comma', () => {
    const csv = 'instante;valor\n2026-11-22T10:00:00Z;31,5';

    expect(parseSamplesCsv(csv)).toEqual({
      ok: true,
      samples: [{ timestamp: '2026-11-22T10:00:00Z', value: 31.5 }],
      lines: [2],
    });
  });

  it('should only treat the first line as a header', () => {
    const csv = '2026-11-22T10:00:00Z,31.5\nontem,32';

    // "ontem" não é data, mas não está na 1ª linha: vai para o schema
    // recusar, com o número da linha
    expect(parseSamplesCsv(csv)).toMatchObject({
      ok: true,
      samples: [
        { timestamp: '2026-11-22T10:00:00Z', value: 31.5 },
        { timestamp: 'ontem', value: 32 },
      ],
      lines: [1, 2],
    });
  });

  it('should turn an empty or invalid value into NaN, for the schema to reject', () => {
    const csv = '2026-11-22T10:00:00Z,\n2026-11-22T10:10:00Z,abc';

    const result = parseSamplesCsv(csv);

    expect(result.ok && result.samples.map((sample) => sample.value)).toEqual([
      Number.NaN,
      Number.NaN,
    ]);
  });

  it('should reject a line without exactly two columns', () => {
    const csv = '2026-11-22T10:00:00Z,31.5\n2026-11-22T10:10:00Z,31,5';

    expect(parseSamplesCsv(csv)).toEqual({
      ok: false,
      error: 'Linha 2: use o formato instante,valor',
    });
  });

  it('should reject a file without samples', () => {
    for (const csv of ['', 'instante,valor\n\n']) {
      expect(parseSamplesCsv(csv)).toEqual({
        ok: false,
        error: 'O arquivo não tem nenhuma medição',
      });
    }
  });
});

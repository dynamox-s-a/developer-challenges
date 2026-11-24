import type { TimeSeriesUpload } from '@dynapredict/shared';

type Sample = TimeSeriesUpload['samples'][number];

// Deu certo: as medições e, para cada uma, a linha do arquivo de onde veio
// (para as mensagens de erro dizerem "Linha 5: ...")
export type ParsedCsv =
  | { ok: true; samples: Sample[]; lines: number[] }
  | { ok: false; error: string };

// Lê um CSV com uma medição por linha: instante,valor
// (ex.: 2026-11-22T10:00:00Z,31.5). Aceita também:
// - um cabeçalho na primeira linha (ex.: instante,valor)
// - ";" como separador, com vírgula decimal: é o CSV do Excel em português
// - linhas em branco, que são ignoradas
// Aqui só se separam as colunas: quem valida instantes e valores é o
// timeSeriesSchema do shared, o mesmo da API
export function parseSamplesCsv(text: string): ParsedCsv {
  const samples: Sample[] = [];
  const lines: number[] = [];
  let firstRow = true;

  // O trim() de cada linha e de cada coluna também tira o BOM: um
  // caractere invisível que o Excel põe no começo do arquivo
  const rows = text.split(/\r?\n/);

  for (const [index, row] of rows.entries()) {
    const line = index + 1;
    if (row.trim() === '') {
      continue;
    }

    const separator = row.includes(';') ? ';' : ',';
    const columns = row.split(separator).map((column) => column.trim());
    if (columns.length !== 2) {
      return {
        ok: false,
        error: `Linha ${line}: use o formato instante,valor`,
      };
    }
    const [timestamp, value] = columns;

    // Cabeçalho: a primeira linha, quando a 1ª coluna não é uma data
    const isHeader = firstRow && Number.isNaN(Date.parse(timestamp));
    firstRow = false;
    if (isHeader) {
      continue;
    }

    samples.push({
      timestamp,
      // Vazio vira NaN (e não 0, como faria o Number('')), para o schema
      // recusar. Com ";", a vírgula é a decimal: 31,5 vira 31.5
      value:
        value === ''
          ? Number.NaN
          : Number(separator === ';' ? value.replace(',', '.') : value),
    });
    lines.push(line);
  }

  if (samples.length === 0) {
    return { ok: false, error: 'O arquivo não tem nenhuma medição' };
  }

  return { ok: true, samples, lines };
}

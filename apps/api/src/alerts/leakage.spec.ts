/**
 * Teste-guarda de vazamento: o motor de alertas não pode ler o rótulo do gerador.
 *
 * `metadata.history.groundTruth`, `configuration` e `scenario` são a resposta que a validação
 * usa para medir o motor — se o motor os lesse, a matriz de validação mediria a si mesma.
 * O único lugar autorizado é o CLI de validação, listado explicitamente aqui.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ALERTS_DIR = __dirname;
const FORBIDDEN = /\b(metadata|configuration|groundTruth|scenario)\b/;
const ALLOWED = new Set(['validate.cli.ts', 'leakage.spec.ts']);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe('fronteira do motor de alertas', () => {
  const files = walk(ALERTS_DIR).filter((path) => path.endsWith('.ts') && !ALLOWED.has(relative(ALERTS_DIR, path).split('/').pop() ?? ''));

  it('cobre os arquivos do motor', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files.map((path) => [relative(ALERTS_DIR, path), path]))(
    '%s não menciona metadata, configuration, groundTruth ou scenario',
    (_label, path) => {
      const offending = readFileSync(path, 'utf8')
        .split('\n')
        .map((line, index) => ({ line: line.trim(), number: index + 1 }))
        .filter(({ line }) => FORBIDDEN.test(line));
      expect(offending).toEqual([]);
    },
  );
});

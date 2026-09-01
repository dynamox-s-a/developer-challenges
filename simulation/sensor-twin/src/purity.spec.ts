/**
 * Guarda de pureza: nenhum código do gêmeo pode usar Math.random — todo acaso é
 * derivado da seed, senão o determinismo (e a prova por fingerprint) desmorona.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('determinismo por construção', () => {
  it('nenhum arquivo de src/ usa Math.random', () => {
    const sourceDir = join(__dirname);
    // Recursivo: subdiretórios (ex.: history/) obedecem à mesma regra.
    const offenders = readdirSync(sourceDir, { recursive: true, encoding: 'utf8' })
      .filter((name) => name.endsWith('.ts'))
      .filter((name) => readFileSync(join(sourceDir, name), 'utf8').includes('Math.random'));

    // Este spec cita o termo, então é o único lugar onde ele pode aparecer.
    expect(offenders).toEqual(['purity.spec.ts']);
  });
});

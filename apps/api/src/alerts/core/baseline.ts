/**
 * Baseline de comissionamento por ponto: 24 medianas, uma por hora UTC do dia.
 *
 * Por hora do dia porque o dataset (e uma planta real) tem ciclo diário — temperatura oscila
 * ~11 °C entre madrugada e tarde, e a carga modula a vibração. Uma baseline escalar
 * compararia a tarde com a média do dia e chamaria o ciclo térmico de deriva.
 *
 * Mediana, não média: uma leitura atípica dentro da janela de aprendizado não puxa a
 * referência. Bins com poucas amostras (menos que `minBinCount`) recebem a mediana global —
 * um sensor com histórico esparso não fica sem baseline, mas o relatório vê os bins fracos
 * em `binCounts`.
 *
 * Limitação declarada: a baseline presume máquina sadia durante o aprendizado. Instalar o
 * motor numa máquina já degradada embute o defeito na referência — é a premissa de
 * "baseline de comissionamento" da literatura, não um caso que o motor detecte.
 */
import { hourOfDayUtc } from './decision';

export interface LearningSample {
  startedAtMs: number;
  value: number;
}

export interface BaselineProfile {
  profile: number[];
  binCounts: number[];
  overall: number;
  sampleCount: number;
}

/** Mediana com a semântica de `percentile_cont(0.5)`: média dos dois centrais em n par. */
export function median(values: readonly number[]): number {
  if (values.length === 0) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function buildBaselineProfile(
  samples: readonly LearningSample[],
  minBinCount: number,
): BaselineProfile | null {
  const finite = samples.filter((sample) => Number.isFinite(sample.value));
  if (finite.length === 0) return null;

  const overall = median(finite.map((sample) => sample.value));
  const bins: number[][] = Array.from({ length: 24 }, () => []);
  for (const sample of finite) bins[hourOfDayUtc(sample.startedAtMs)].push(sample.value);

  return {
    profile: bins.map((bin) => (bin.length >= minBinCount ? median(bin) : overall)),
    binCounts: bins.map((bin) => bin.length),
    overall,
    sampleCount: finite.length,
  };
}

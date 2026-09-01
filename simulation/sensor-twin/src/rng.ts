/**
 * Aleatoriedade determinística do gêmeo. Nunca o gerador nativo do runtime: a mesma
 * seed precisa produzir exatamente o mesmo sinal em qualquer máquina, para o ciclo ser
 * auditável (mesmo fingerprint) e o replay ser uma prova, não uma coincidência.
 * (Um spec de pureza varre src/ e reprova qualquer uso do gerador nativo.)
 *
 * O ruído não é white noise em runtime: é uma soma FIXA de senóides banda-limitadas
 * parametrizadas pela seed. Banda limitada POR CONSTRUÇÃO ⇒ a decimação inteira do
 * stream não tem como criar aliasing.
 */

/** LCG de 32 bits — as mesmas constantes do seed determinístico do banco (prisma/seed.ts). */
export function createLcg(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0xffffffff;
  };
}

/** Deriva sub-seeds estáveis (ex.: uma por eixo) sem correlação óbvia entre elas. */
export function mixSeed(seed: number, salt: number): number {
  return ((seed >>> 0) ^ Math.imul(salt + 1, 0x9e3779b9)) >>> 0;
}

export interface NoiseComponent {
  frequencyHz: number;
  amplitudeG: number;
  phaseRad: number;
}

export interface DeterministicNoise {
  components: NoiseComponent[];
  /** Valor do ruído no instante t (segundos). */
  sampleAt(tSeconds: number): number;
}

/**
 * Soma de `count` senóides com frequências em [bandMinHz, bandMaxHz] e fases tiradas
 * do LCG. Amplitudes iguais a = σ·√(2/count): a variância teórica da soma é
 * count·a²/2 = σ², então o σ alvo é atingido por construção, sem normalização em
 * runtime.
 */
export function createDeterministicNoise(
  seed: number,
  options: { count: number; bandMinHz: number; bandMaxHz: number; sigmaG: number },
): DeterministicNoise {
  const { count, bandMinHz, bandMaxHz, sigmaG } = options;
  const next = createLcg(seed);
  const amplitudeG = sigmaG * Math.sqrt(2 / count);

  const components: NoiseComponent[] = Array.from({ length: count }, () => ({
    frequencyHz: bandMinHz + next() * (bandMaxHz - bandMinHz),
    amplitudeG,
    phaseRad: next() * 2 * Math.PI,
  }));

  return {
    components,
    sampleAt(tSeconds: number): number {
      let value = 0;
      for (const c of components) {
        value += c.amplitudeG * Math.sin(2 * Math.PI * c.frequencyHz * tSeconds + c.phaseRad);
      }
      return value;
    },
  };
}

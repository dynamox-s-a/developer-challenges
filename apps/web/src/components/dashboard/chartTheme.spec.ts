import { describe, expect, it } from 'vitest';

import { paddedDomain } from './chartTheme';

/**
 * O domínio do eixo decide o que o gráfico AFIRMA. Estes testes fixam os dois erros que a
 * regra existe para evitar — achatar uma degradação real e dramatizar ruído — porque
 * ambos já aconteceram nesta aplicação.
 */
describe('domínio vertical dos gráficos', () => {
  it('não ancora em zero: uma degradação de 3,5× ocupa o gráfico', () => {
    const [low, high] = paddedDomain([0.0164, 0.031, 0.0572])!;
    expect(low).toBeGreaterThan(0.01);
    expect(high).toBeLessThan(0.07);
    // A curva usa a maior parte da altura, em vez de virar uma linha rente ao eixo.
    expect((0.0572 - 0.0164) / (high - low)).toBeGreaterThan(0.7);
  });

  it('não dramatiza ruído: variação de meio por cento não vira uma onda', () => {
    const [low, high] = paddedDomain([0.0159, 0.0167, 0.0161])!;
    // A faixa mínima é proporcional ao nível do sinal (10% da média), então a variação
    // real ocupa uma fração pequena da altura — que é o que ela é.
    expect((0.0167 - 0.0159) / (high - low)).toBeLessThan(0.5);
    expect(low).toBeGreaterThan(0);
  });

  it('nunca desce abaixo de zero — grandeza de vibração não é negativa', () => {
    const [low] = paddedDomain([0.0001, 0.0002])!;
    expect(low).toBeGreaterThanOrEqual(0);
  });

  it('sem valores finitos, não há domínio a impor', () => {
    expect(paddedDomain([])).toBeUndefined();
    expect(paddedDomain([Number.NaN, Number.POSITIVE_INFINITY])).toBeUndefined();
  });
});

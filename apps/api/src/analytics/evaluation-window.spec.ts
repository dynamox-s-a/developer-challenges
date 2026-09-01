import { anchoredEvaluationFrom, CONDITION_LOOKBACK_MS } from './analytics.sql';

const T0 = Date.parse('2026-08-30T23:15:00.000Z'); // última amostra da demonstração

/**
 * A âncora da avaliação de condição: as últimas 24 h DE DADO, nunca do relógio.
 * É o que impede a frota inteira de decair para "sem classificação" horas depois
 * de a ingestão parar — sem nenhum dado novo para justificar a mudança.
 */
describe('anchoredEvaluationFrom', () => {
  const day = 24 * 60 * 60 * 1000;

  it('operação viva: dado encosta no to — âncora e relógio coincidem', () => {
    const to = T0 + 1000;
    expect(anchoredEvaluationFrom(to - 7 * day, to, T0).getTime()).toBe(T0 + 1 - CONDITION_LOOKBACK_MS);
  });

  it('ingestão parada: to horas além do dado — a âncora fica na última amostra', () => {
    const to = T0 + 22 * 60 * 60 * 1000; // consulta feita 22 h depois do fim do dado
    expect(anchoredEvaluationFrom(to - 7 * day, to, T0).getTime()).toBe(T0 + 1 - CONDITION_LOOKBACK_MS);
  });

  it('dado além do to (relógio divergente): o to continua sendo o teto', () => {
    const to = T0;
    expect(anchoredEvaluationFrom(to - 7 * day, to, T0 + day).getTime()).toBe(to - CONDITION_LOOKBACK_MS);
  });

  it('sem dado algum: cai no comportamento antigo (to − lookback)', () => {
    const to = T0;
    expect(anchoredEvaluationFrom(to - 7 * day, to, null).getTime()).toBe(to - CONDITION_LOOKBACK_MS);
  });

  it('janela mais curta que o lookback: o from pedido prevalece', () => {
    const from = T0 - 60 * 60 * 1000;
    expect(anchoredEvaluationFrom(from, T0 + day, T0).getTime()).toBe(from);
  });
});

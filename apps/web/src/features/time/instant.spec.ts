import { describe, expect, it } from 'vitest';

import {
  TIME_ZONE_LABEL,
  dayKey,
  dayWindow,
  formatDate,
  formatDateTime,
  formatDayKey,
  formatHourLabel,
  formatRange,
  formatRelativeTime,
  formatShortDateTime,
  formatTime,
  formatWeekdayKey,
  hourOfDay,
  hourWindow,
  hourWindowPath,
  parseInstant,
  windowFromPath,
} from './instant';

/**
 * A convenção temporal do produto é UTC de ponta a ponta. Estes testes existem para que
 * uma mudança de fuso — de servidor, de máquina de CI ou de navegador — não passe
 * despercebida: todas as asserções abaixo valem independentemente do `TZ` do processo.
 */
describe('camada temporal (UTC)', () => {
  const instant = '2026-08-30T14:02:05.000Z';

  it('formata datas e horas no fuso declarado, não no fuso da máquina', () => {
    expect(TIME_ZONE_LABEL).toBe('UTC');
    expect(formatDate(instant)).toBe('30/08/2026');
    expect(formatDateTime(instant)).toBe('30/08/2026, 14:02:05');
    expect(formatTime(instant)).toBe('14:02');
    expect(formatShortDateTime(instant)).toMatch(/^30 de ago\.?,? 14:02$|^30\/ago\.? 14:02$/);
  });

  it('aceita epoch em ms e ISO como o mesmo instante', () => {
    expect(formatDateTime(Date.parse(instant))).toBe(formatDateTime(instant));
    expect(parseInstant(instant)).toBe(Date.parse(instant));
  });

  it('distingue ausência de leitura de instante inválido', () => {
    expect(formatDateTime(null)).toBe('—');
    expect(formatDateTime(null, 'sem leitura')).toBe('sem leitura');
    expect(formatDateTime('não é data')).toBe('Data inválida');
    expect(parseInstant('não é data')).toBeNull();
  });

  it('deriva dia e hora UTC, os mesmos que a API usa para agrupar', () => {
    expect(dayKey(instant)).toBe('2026-08-30');
    expect(hourOfDay(instant)).toBe(14);
    expect(formatDayKey('2026-08-30')).toBe('30/08');
    expect(formatWeekdayKey('2026-08-30')).toBe('dom');
    expect(formatHourLabel(7)).toBe('07h');
  });

  it('alinha a janela horária ao início da hora que contém o instante', () => {
    expect(hourWindow(instant)).toEqual({
      from: '2026-08-30T14:00:00.000Z',
      to: '2026-08-30T15:00:00.000Z',
    });
    expect(dayWindow(instant)).toEqual({
      from: '2026-08-30T00:00:00.000Z',
      to: '2026-08-31T00:00:00.000Z',
    });
  });

  it('reconstrói a janela a partir do caminho, para o link funcionar sem query', () => {
    expect(windowFromPath('2026-08-30', '14')).toEqual({
      from: '2026-08-30T14:00:00.000Z',
      to: '2026-08-30T15:00:00.000Z',
    });
    expect(windowFromPath('2026-08-30', '07')).toEqual(windowFromPath('2026-08-30', '7'));
    expect(windowFromPath('30/08/2026', '14')).toBeNull();
    expect(windowFromPath('2026-08-30', '24')).toBeNull();
  });

  it('gera a rota da janela com o mesmo instante que rotulou a célula', () => {
    const path = hourWindowPath(instant);
    expect(path).toBe(
      '/monitoring/windows/2026-08-30/14?from=2026-08-30T14%3A00%3A00.000Z&to=2026-08-30T15%3A00%3A00.000Z',
    );

    // Ida e volta: a rota devolve exatamente a janela que a origem pretendia.
    const query = new URLSearchParams(path.split('?')[1]);
    expect({ from: query.get('from'), to: query.get('to') }).toEqual(hourWindow(instant));
  });

  it('descreve intervalos e recência em linguagem operacional', () => {
    expect(formatRange('2026-08-30T14:00:00.000Z', '2026-08-30T15:00:00.000Z')).toContain('→');
    expect(formatRange(null, instant)).toBe('Sem intervalo disponível');

    const now = Date.parse(instant);
    expect(formatRelativeTime(instant, now)).toBe('agora');
    expect(formatRelativeTime('2026-08-30T13:00:00.000Z', now)).toBe('há 1 h');
    expect(formatRelativeTime('2026-08-28T14:02:05.000Z', now)).toBe('há 2 dias');
    expect(formatRelativeTime('2026-08-30T15:00:00.000Z', now)).toContain('no futuro');
    expect(formatRelativeTime(null, now)).toBe('sem leitura');
  });
});

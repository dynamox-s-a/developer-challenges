import { describe, expect, test } from 'vitest';
import { formatDate, formatDateShort } from '../utils/formate-date';

describe('Date Utils', () => {
  test('formatDate retorna data com dia mês ano e hora', () => {
    const date = new Date('2023-12-31T12:54:56Z');
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe('31/12/2023, 09:54');
  });

  test('formatDateShort retorna a data com dia e mês', () => {
    const date = new Date('2023-12-31T12:34:56Z');
    const formattedDateShort = formatDateShort(date);
    expect(formattedDateShort).toBe('31/12');
  });
});
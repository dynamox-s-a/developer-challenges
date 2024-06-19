import Repositorios from '../services/dados';
import { describe, expect, test } from 'vitest';

describe('Repositorios Function', () => {
  test('deve retornar uma lista de resultados', async () => {
    const resultado = await Repositorios();

    expect(resultado.length).contains;
  });
});
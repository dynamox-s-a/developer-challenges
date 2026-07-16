import { describe, expect, it } from 'vitest';

import { getOrpcErrorMessage } from './orpc-client';

describe('getOrpcErrorMessage', () => {
  it('traduz falha de rede em instrução acionável, não no "Failed to fetch" do browser', () => {
    const message = getOrpcErrorMessage(new TypeError('Failed to fetch'));

    expect(message).toContain('Não foi possível conectar à API');
    expect(message).toContain('bun run dev');
    expect(message).not.toContain('Failed to fetch');
  });

  it('preserva a mensagem de erro vinda da API', () => {
    expect(getOrpcErrorMessage(new Error('Máquina MCH-999 não encontrada'))).toBe(
      'Máquina MCH-999 não encontrada'
    );
  });

  it('não confunde TypeError comum com falha de rede', () => {
    expect(getOrpcErrorMessage(new TypeError('x is not a function'))).toBe('x is not a function');
  });

  it('aceita erro em string e objeto com message', () => {
    expect(getOrpcErrorMessage('erro cru')).toBe('erro cru');
    expect(getOrpcErrorMessage({ message: 'do objeto' })).toBe('do objeto');
  });

  it('tem mensagem padrão para erro sem formato conhecido', () => {
    expect(getOrpcErrorMessage(null)).toBe('Falha ao buscar os dados do sensor.');
  });
});

import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../test/renderWithProviders';
import { AppHeader } from './AppHeader';

const USER = { id: 'u1', email: 'operador@dynamox.local', name: 'Operador', role: 'ADMIN' as const };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AppHeader', () => {
  it('mantém sessão e recuperação acessíveis quando o health check falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ message: 'API fora do ar' }), { status: 503 }),
      ),
    );

    renderWithProviders(<AppHeader />, {
      preloadedState: { auth: { status: 'authenticated', user: USER, error: null } },
    });

    // Uma única faixa de aplicação: sem card, sem título "Estado do sistema".
    const header = await screen.findByRole('banner', { name: /Estado do sistema e sessão/i });
    expect(within(header).getByText(/API indisponível/i)).toBeDefined();
    expect(within(header).getByText(USER.email)).toBeDefined();
    expect(within(header).getByRole('button', { name: /Atualizar estado do sistema/i })).toBeDefined();
    expect(within(header).getByRole('button', { name: /Sair da sessão/i })).toBeDefined();
    expect(screen.queryByRole('heading', { name: /Estado do sistema/i })).toBeNull();
  });
});

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';
import { getToken, setToken } from './api/client';
import type { RootState } from './store';
import { initialAuthState } from './features/auth/authSlice';
import { renderWithProviders } from './test/renderWithProviders';

const USER = { id: 'u1', email: 'analista@dynamox.local', name: 'Analista', role: 'ADMIN' as const };

function renderApp(preloaded?: Partial<RootState>) {
  return renderWithProviders(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
    // Estes testes cobrem a entrada e a saída da sessão: começam deslogados de propósito,
    // em vez da sessão simulada que o utilitário oferece por padrão.
    { preloadedState: { auth: initialAuthState, ...preloaded } },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  setToken(null);
});

describe('App — autenticação e proteção de rotas', () => {
  it('sem sessão, acesso direto à rota privada cai no login', async () => {
    renderApp();
    expect(await screen.findByRole('heading', { name: /Entrar/i })).toBeDefined();
    expect(screen.queryByRole('banner')).toBeNull();
  });

  it('reload em rota privada com token restaura a sessão via /auth/me com Bearer', async () => {
    setToken('jwt-valido');
    let meAuthorization: string | null = null;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith('/auth/me')) {
          meAuthorization = (init?.headers as Record<string, string>)?.Authorization ?? null;
          return new Response(JSON.stringify(USER), { status: 200 });
        }
        if (url.endsWith('/health'))
          return new Response(
            JSON.stringify({ status: 'ok', database: 'up', version: 'x', timestamp: '2026-08-29T12:00:00.000Z' }),
            { status: 200 },
          );
        // O painel consulta a camada analítica; aqui basta responder vazio.
        if (url.includes('/analytics/fleet-condition'))
          return new Response(
            JSON.stringify({ from: '2026-08-29T00:00:00.000Z', to: '2026-08-29T12:00:00.000Z', generatedAt: '2026-08-29T12:00:00.000Z', points: [] }),
            { status: 200 },
          );
        if (url.includes('/analytics/heatmap'))
          return new Response(
            JSON.stringify({ from: '2026-08-29T00:00:00.000Z', to: '2026-08-29T12:00:00.000Z', bucket: 'hour', expectedSensors: 0, buckets: [] }),
            { status: 200 },
          );
        // A listagem de máquinas é servida pela camada analítica (condição é derivada).
        if (url.includes('/analytics/machines'))
          return new Response(
            JSON.stringify({
              from: '2026-08-29T00:00:00.000Z',
              to: '2026-08-29T12:00:00.000Z',
              items: [],
              total: 0,
              page: 1,
              pageSize: 25,
              totalPages: 1,
              counts: { total: 0, attention: 0, observation: 0, normal: 0, unclassified: 0, noData: 0, noSensor: 0 },
              condition: null,
              search: null,
              sortBy: 'name',
              sortDir: 'asc',
            }),
            { status: 200 },
          );
        if (url.includes('/monitoring-points'))
          return new Response(
            JSON.stringify({
              items: [],
              total: 0,
              page: 1,
              pageSize: 5,
              sortBy: 'machineName',
              sortDir: 'asc',
            }),
            { status: 200 },
          );
        return new Response('[]', { status: 200 });
      }),
    );

    renderApp();

    // Uma única barra de aplicação carrega estado do sistema e sessão.
    const appHeader = await screen.findByRole('banner');
    expect(within(appHeader).getByText(USER.email)).toBeDefined();
    expect(within(appHeader).getByRole('button', { name: /Sair da sessão/i })).toBeDefined();
    expect(screen.getAllByText(USER.email)).toHaveLength(1);
    expect(screen.queryByText('MONITORAMENTO DE ATIVOS')).toBeNull();
    expect(meAuthorization).toBe('Bearer jwt-valido');
  });

  it('login pelo formulário → rota privada → logout → retorno bloqueado', async () => {
    // Sessão começa vazia: o fluxo inteiro passa pelo formulário, sem token pré-instalado.
    let loginCalls = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith('/auth/login')) {
          loginCalls += 1;
          return new Response(JSON.stringify({ token: 'jwt-do-form', user: USER }), {
            status: 200,
          });
        }
        if (url.endsWith('/health'))
          return new Response(
            JSON.stringify({ status: 'ok', database: 'up', version: 'x', timestamp: '2026-08-29T12:00:00.000Z' }),
            { status: 200 },
          );
        // O painel consulta a camada analítica; aqui basta responder vazio.
        if (url.includes('/analytics/fleet-condition'))
          return new Response(
            JSON.stringify({ from: '2026-08-29T00:00:00.000Z', to: '2026-08-29T12:00:00.000Z', generatedAt: '2026-08-29T12:00:00.000Z', points: [] }),
            { status: 200 },
          );
        if (url.includes('/analytics/heatmap'))
          return new Response(
            JSON.stringify({ from: '2026-08-29T00:00:00.000Z', to: '2026-08-29T12:00:00.000Z', bucket: 'hour', expectedSensors: 0, buckets: [] }),
            { status: 200 },
          );
        // A listagem de máquinas é servida pela camada analítica (condição é derivada).
        if (url.includes('/analytics/machines'))
          return new Response(
            JSON.stringify({
              from: '2026-08-29T00:00:00.000Z',
              to: '2026-08-29T12:00:00.000Z',
              items: [],
              total: 0,
              page: 1,
              pageSize: 25,
              totalPages: 1,
              counts: { total: 0, attention: 0, observation: 0, normal: 0, unclassified: 0, noData: 0, noSensor: 0 },
              condition: null,
              search: null,
              sortBy: 'name',
              sortDir: 'asc',
            }),
            { status: 200 },
          );
        if (url.includes('/monitoring-points'))
          return new Response(
            JSON.stringify({
              items: [],
              total: 0,
              page: 1,
              pageSize: 5,
              sortBy: 'machineName',
              sortDir: 'asc',
            }),
            { status: 200 },
          );
        return new Response('[]', { status: 200 });
      }),
    );

    renderApp();
    await screen.findByRole('heading', { name: /Entrar/i });

    // O formulário abre preenchido com a conta de demonstração; o teste substitui.
    await userEvent.clear(screen.getByLabelText(/E-mail/i));
    await userEvent.type(screen.getByLabelText(/E-mail/i), USER.email);
    await userEvent.clear(screen.getByLabelText(/Senha/i));
    await userEvent.type(screen.getByLabelText(/Senha/i), 'Dynamox@2026');
    await userEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));

    expect(await screen.findByRole('heading', { name: /Visão geral operacional/i })).toBeDefined();
    expect(loginCalls).toBe(1);
    expect(getToken()).toBe('jwt-do-form');

    await userEvent.click(screen.getByRole('button', { name: /Sair/i }));

    // De volta ao login, token limpo, e a rota privada não renderiza mais.
    expect(await screen.findByRole('heading', { name: /Entrar/i })).toBeDefined();
    await waitFor(() => expect(getToken()).toBeNull());
    expect(screen.queryByRole('heading', { name: /Visão geral operacional/i })).toBeNull();
  });

  it('formulário de login autentica contra a API e entra no painel', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith('/auth/login'))
          return new Response(JSON.stringify({ token: 'jwt-novo', user: USER }), { status: 200 });
        if (url.endsWith('/health'))
          return new Response(
            JSON.stringify({ status: 'ok', database: 'up', version: 'x', timestamp: '2026-08-29T12:00:00.000Z' }),
            { status: 200 },
          );
        // O painel consulta a camada analítica; aqui basta responder vazio.
        if (url.includes('/analytics/fleet-condition'))
          return new Response(
            JSON.stringify({ from: '2026-08-29T00:00:00.000Z', to: '2026-08-29T12:00:00.000Z', generatedAt: '2026-08-29T12:00:00.000Z', points: [] }),
            { status: 200 },
          );
        if (url.includes('/analytics/heatmap'))
          return new Response(
            JSON.stringify({ from: '2026-08-29T00:00:00.000Z', to: '2026-08-29T12:00:00.000Z', bucket: 'hour', expectedSensors: 0, buckets: [] }),
            { status: 200 },
          );
        // A listagem de máquinas é servida pela camada analítica (condição é derivada).
        if (url.includes('/analytics/machines'))
          return new Response(
            JSON.stringify({
              from: '2026-08-29T00:00:00.000Z',
              to: '2026-08-29T12:00:00.000Z',
              items: [],
              total: 0,
              page: 1,
              pageSize: 25,
              totalPages: 1,
              counts: { total: 0, attention: 0, observation: 0, normal: 0, unclassified: 0, noData: 0, noSensor: 0 },
              condition: null,
              search: null,
              sortBy: 'name',
              sortDir: 'asc',
            }),
            { status: 200 },
          );
        if (url.includes('/monitoring-points'))
          return new Response(
            JSON.stringify({
              items: [],
              total: 0,
              page: 1,
              pageSize: 5,
              sortBy: 'machineName',
              sortDir: 'asc',
            }),
            { status: 200 },
          );
        return new Response('[]', { status: 200 });
      }),
    );

    renderApp();
    await screen.findByRole('heading', { name: /Entrar/i });

    // O formulário abre preenchido com a conta de demonstração; o teste substitui.
    await userEvent.clear(screen.getByLabelText(/E-mail/i));
    await userEvent.type(screen.getByLabelText(/E-mail/i), USER.email);
    await userEvent.clear(screen.getByLabelText(/Senha/i));
    await userEvent.type(screen.getByLabelText(/Senha/i), 'Dynamox@2026');
    await userEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));

    expect(await screen.findByRole('banner')).toBeDefined();
    expect(getToken()).toBe('jwt-novo');
  });

  it('login abre preenchido com a conta da seed e entra sem digitação', async () => {
    let enviado: { email: string; password: string } | null = null;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith('/auth/login')) {
          enviado = JSON.parse(String(init?.body)) as { email: string; password: string };
          return new Response(JSON.stringify({ token: 'jwt-demo', user: USER }), { status: 200 });
        }
        return new Response('[]', { status: 200 });
      }),
    );

    renderApp();
    await screen.findByRole('heading', { name: /Entrar/i });

    const email = screen.getByLabelText(/E-mail/i) as HTMLInputElement;
    const senha = screen.getByLabelText(/Senha/i) as HTMLInputElement;
    expect(email.value).toBe('analista@dynamox.local');
    expect(senha.value).not.toBe('');

    await userEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));
    await waitFor(() => expect(enviado).not.toBeNull());
    expect(enviado).toEqual({ email: 'analista@dynamox.local', password: 'Dynamox@2026' });
  });

  it('erro de credencial aparece no formulário', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ message: 'Credenciais inválidas.' }), { status: 401 }),
      ),
    );

    renderApp();
    await screen.findByRole('heading', { name: /Entrar/i });

    // O formulário abre preenchido com a conta de demonstração; o teste substitui.
    await userEvent.clear(screen.getByLabelText(/E-mail/i));
    await userEvent.type(screen.getByLabelText(/E-mail/i), USER.email);
    await userEvent.clear(screen.getByLabelText(/Senha/i));
    await userEvent.type(screen.getByLabelText(/Senha/i), 'errada');
    await userEvent.click(screen.getByRole('button', { name: /^Entrar$/i }));

    expect(await screen.findByText(/Credenciais inválidas/i)).toBeDefined();
  });
});

describe('AppShell — navegação lateral', () => {
  it('menu lateral navega entre visão geral, máquinas e pontos', async () => {
    setToken('jwt-valido');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith('/auth/me')) return new Response(JSON.stringify(USER), { status: 200 });
        if (url.endsWith('/health'))
          return new Response(
            JSON.stringify({ status: 'ok', database: 'up', version: 'x', timestamp: '2026-08-29T12:00:00.000Z' }),
            { status: 200 },
          );
        // O painel consulta a camada analítica; aqui basta responder vazio.
        if (url.includes('/analytics/fleet-condition'))
          return new Response(
            JSON.stringify({ from: '2026-08-29T00:00:00.000Z', to: '2026-08-29T12:00:00.000Z', generatedAt: '2026-08-29T12:00:00.000Z', points: [] }),
            { status: 200 },
          );
        if (url.includes('/analytics/heatmap'))
          return new Response(
            JSON.stringify({ from: '2026-08-29T00:00:00.000Z', to: '2026-08-29T12:00:00.000Z', bucket: 'hour', expectedSensors: 0, buckets: [] }),
            { status: 200 },
          );
        // A listagem de máquinas é servida pela camada analítica (condição é derivada).
        if (url.includes('/analytics/machines'))
          return new Response(
            JSON.stringify({
              from: '2026-08-29T00:00:00.000Z',
              to: '2026-08-29T12:00:00.000Z',
              items: [],
              total: 0,
              page: 1,
              pageSize: 25,
              totalPages: 1,
              counts: { total: 0, attention: 0, observation: 0, normal: 0, unclassified: 0, noData: 0, noSensor: 0 },
              condition: null,
              search: null,
              sortBy: 'name',
              sortDir: 'asc',
            }),
            { status: 200 },
          );
        if (url.includes('/monitoring-points'))
          return new Response(
            JSON.stringify({
              items: [],
              total: 0,
              page: 1,
              pageSize: 5,
              sortBy: 'machineName',
              sortDir: 'asc',
            }),
            { status: 200 },
          );
        return new Response('[]', { status: 200 });
      }),
    );

    renderApp();

    // Visão geral carregada. No viewport de teste (mobile) o menu abre pelo botão.
    expect(await screen.findByRole('banner')).toBeDefined();

    const openNav = async () => {
      await userEvent.click(screen.getByRole('button', { name: /Abrir menu de navegação/i }));
      return screen.getByRole('navigation', { name: /Navegação principal/i });
    };

    // Máquinas.
    let nav = await openNav();
    expect(within(nav).getByRole('link', { name: /Visão geral/i }).getAttribute('aria-current')).toBe('page');
    await userEvent.click(within(nav).getByText('Máquinas'));
    // A toolbar duplicada foi removida; existe apenas o título próprio do painel.
    expect(await screen.findAllByRole('heading', { name: /^Máquinas$/i })).toHaveLength(1);
    expect(screen.getByRole('banner')).toBeDefined();
    expect(screen.getByRole('button', { name: /Sair da sessão/i })).toBeDefined();

    // Pontos e sensores.
    nav = await openNav();
    expect(within(nav).getByRole('link', { name: /Máquinas/i }).getAttribute('aria-current')).toBe('page');
    await userEvent.click(within(nav).getByText('Pontos e sensores'));
    expect(
      await screen.findByRole('heading', { name: /Pontos de monitoramento/i }),
    ).toBeDefined();
  });
});

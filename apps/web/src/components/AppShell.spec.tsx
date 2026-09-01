import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../test/renderWithProviders';
import { AppShell } from './AppShell';

/**
 * Estes testes rodam no breakpoint DESKTOP, onde o drawer é permanente: é lá que o accordion
 * tem o comportamento que interessa (grupos abertos por padrão, recolher, reabrir sozinho).
 * O caminho mobile — drawer temporário que fecha ao navegar — é coberto em `App.spec.tsx`.
 */
function stubDesktopViewport() {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('min-width'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

/** O shell só precisa do health para o cabeçalho; a página em si não é o objeto deste teste. */
function stubHealth() {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      new Response(
        JSON.stringify({ status: 'ok', database: 'up', version: '0.1.0', timestamp: '2026-08-31T12:00:00.000Z' }),
        { status: 200 },
      ),
    ),
  );
}

function renderShell(route: string) {
  const rendered = renderWithProviders(
    <Routes>
      <Route element={<AppShell />}>
        {/* O conteúdo faz o papel de qualquer página que leve a outro destino. */}
        <Route path="*" element={<Link to="/machines">abrir uma máquina</Link>} />
      </Route>
    </Routes>,
    { route },
  );
  return rendered;
}

const nav = () => screen.getByRole('navigation', { name: /Navegação principal/i });

beforeEach(() => {
  stubDesktopViewport();
  stubHealth();
});
afterEach(() => vi.unstubAllGlobals());

describe('AppShell — menu lateral', () => {
  it('agrupa os destinos por monitoramento e cadastro, sem listar rotas contextuais', () => {
    renderShell('/');
    const menu = nav();
    // Os cabeçalhos de grupo nomeiam as listas: quem usa leitor de tela ouve a categoria.
    expect(within(menu).getByRole('button', { name: 'Monitoramento' })).toBeDefined();
    expect(within(menu).getByRole('button', { name: 'Cadastro' })).toBeDefined();
    expect(within(menu).getAllByRole('list')).toHaveLength(2);
    expect(within(menu).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/alerts',
      '/machines',
      '/monitoring-points',
    ]);
  });

  it('os grupos nascem expandidos — organizar não é esconder', () => {
    renderShell('/');
    for (const label of ['Monitoramento', 'Cadastro']) {
      const header = within(nav()).getByRole('button', { name: label });
      expect(header.getAttribute('aria-expanded')).toBe('true');
      // O cabeçalho aponta para a lista que ele controla.
      expect(document.getElementById(header.getAttribute('aria-controls') ?? '')).not.toBeNull();
    }
  });

  it('recolher um grupo esconde os destinos dele e mantém os outros', async () => {
    renderShell('/');
    await userEvent.click(within(nav()).getByRole('button', { name: 'Cadastro' }));
    await waitFor(() =>
      expect(within(nav()).getByRole('button', { name: 'Cadastro' }).getAttribute('aria-expanded')).toBe('false'),
    );
    await waitFor(() => expect(within(nav()).queryByRole('link', { name: /^Máquinas/ })).toBeNull());
    expect(within(nav()).getByRole('link', { name: /^Alertas/ })).toBeDefined();
  });

  it('navegar para dentro de um grupo recolhido o reabre — nunca esconde onde a pessoa chegou', async () => {
    renderShell('/alerts');
    const header = () => within(nav()).getByRole('button', { name: 'Cadastro' });
    await userEvent.click(header());
    await waitFor(() => expect(header().getAttribute('aria-expanded')).toBe('false'));

    // Link da PÁGINA (não do menu) para um destino que vive no grupo fechado.
    await userEvent.click(screen.getByRole('link', { name: 'abrir uma máquina' }));

    await waitFor(() => expect(header().getAttribute('aria-expanded')).toBe('true'));
    expect(within(nav()).getByRole('link', { name: /^Máquinas/ }).getAttribute('aria-current')).toBe('page');
  });

  it('a escolha de recolher sobrevive à navegação dentro do mesmo grupo aberto', async () => {
    renderShell('/');
    await userEvent.click(within(nav()).getByRole('button', { name: 'Cadastro' }));
    await waitFor(() =>
      expect(within(nav()).getByRole('button', { name: 'Cadastro' }).getAttribute('aria-expanded')).toBe('false'),
    );
    await userEvent.click(within(nav()).getByRole('link', { name: /^Alertas/ }));
    // Navegar dentro de Monitoramento não desfaz o que a pessoa escolheu em Cadastro.
    expect(within(nav()).getByRole('button', { name: 'Cadastro' }).getAttribute('aria-expanded')).toBe('false');
  });

  it('a raiz destaca "Visão geral" e apenas ela', () => {
    renderShell('/');
    const links = within(nav()).getAllByRole('link');
    expect(links[0].getAttribute('aria-current')).toBe('page');
    expect(links.slice(1).every((link) => link.getAttribute('aria-current') === null)).toBe(true);
  });

  it.each([
    ['/alerts/1554cd5d-3588-41c5-b90d-97b94fb52452', 'Alertas'],
    ['/machines/P-101/points/mancal-lado-acoplamento', 'Máquinas'],
    // O índice do sensor é o registro de instrumentação — é a página que lista sensores.
    ['/sensors/SIM-HF-002', 'Pontos e sensores'],
    ['/acquisitions/abc/samples', 'Pontos e sensores'],
  ])('a subrota %s mantém "%s" como ramo ativo', (route, label) => {
    renderShell(route);
    const active = within(nav()).getByRole('link', { name: new RegExp(`^${label}`) });
    expect(active.className).toContain('active');
    // "true" e não "page": o item é o ramo que contém a página, não a página em si.
    expect(active.getAttribute('aria-current')).toBe('true');
  });

  it('a página do destino em si é "page", não apenas o ramo', () => {
    renderShell('/machines');
    expect(within(nav()).getByRole('link', { name: /^Máquinas/ }).getAttribute('aria-current')).toBe('page');
  });

  it('o Swagger fica fora da navegação de operação e declara que abre em outra aba', () => {
    renderShell('/');
    const swagger = screen.getByRole('link', { name: /API \(Swagger\).*nova aba/i });
    expect(within(nav()).queryByRole('link', { name: /Swagger/i })).toBeNull();
    expect(swagger.getAttribute('target')).toBe('_blank');
    expect(swagger.getAttribute('rel')).toContain('noopener');
  });

  it('a marca volta para o início', () => {
    renderShell('/machines');
    expect(screen.getByRole('link', { name: /Desafio Dynamox/i }).getAttribute('href')).toBe('/');
  });
});

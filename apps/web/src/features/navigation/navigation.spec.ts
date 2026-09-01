import { describe, expect, it } from 'vitest';

import { NAV_GROUPS, activeNavGroup, isNavItemActive } from './navigation';

const item = (to: string) =>
  NAV_GROUPS.flatMap((group) => group.items).find((candidate) => candidate.to === to)!;

describe('destinos do menu lateral', () => {
  it('separa monitoramento de cadastro e não repete a mesma página em dois lugares', () => {
    expect(NAV_GROUPS.map((group) => group.id)).toEqual(['monitoramento', 'cadastro']);
    const destinos = NAV_GROUPS.flatMap((group) => group.items).map((navItem) => navItem.to);
    expect(destinos).toEqual(['/', '/alerts', '/machines', '/monitoring-points']);
    expect(new Set(destinos).size).toBe(destinos.length);
  });

  it('não lista rotas contextuais — elas são alcançadas de dentro da página', () => {
    const destinos = NAV_GROUPS.flatMap((group) => group.items).map((navItem) => navItem.to);
    for (const contextual of ['/machines/new', '/machines/P-101/edit', '/alerts/abc', '/acquisitions/abc']) {
      expect(destinos).not.toContain(contextual);
    }
  });
});

describe('isNavItemActive', () => {
  it('a raiz só fica ativa na própria raiz', () => {
    expect(isNavItemActive(item('/'), '/')).toBe(true);
    expect(isNavItemActive(item('/'), '/machines')).toBe(false);
    expect(isNavItemActive(item('/'), '/alerts')).toBe(false);
  });

  it.each([
    ['/machines', '/machines'],
    ['/machines/P-101', '/machines'],
    ['/machines/P-101/edit', '/machines'],
    ['/machines/P-101/points/mancal-lado-acoplamento', '/machines'],
    ['/machines/new', '/machines'],
    ['/alerts', '/alerts'],
    ['/alerts/1554cd5d-3588-41c5-b90d-97b94fb52452', '/alerts'],
    ['/monitoring-points', '/monitoring-points'],
  ])('%s mantém %s como ramo ativo', (pathname, expected) => {
    expect(isNavItemActive(item(expected), pathname)).toBe(true);
    expect(activeNavGroup(pathname)?.items.some((navItem) => navItem.to === expected)).toBe(true);
  });

  it.each([
    // O índice do sensor é o registro de instrumentação, não a lista de máquinas.
    ['/sensors/SIM-HF-002', '/monitoring-points'],
    ['/acquisitions/63ca6282', '/monitoring-points'],
    ['/acquisitions/63ca6282/samples', '/monitoring-points'],
    ['/assets/P-101', '/machines'],
    // A janela horária nasce do mapa de calor do painel.
    ['/monitoring/windows/2026-08-30/14', '/'],
  ])('a rota de investigação %s destaca %s', (pathname, expected) => {
    expect(isNavItemActive(item(expected), pathname)).toBe(true);
  });

  it('um prefixo parecido não ativa o item errado', () => {
    // "/machines-antigas" não é filho de "/machines".
    expect(isNavItemActive(item('/machines'), '/machines-antigas')).toBe(false);
    // "/monitoring-points" e "/monitoring/windows" compartilham o começo do texto, não a rota.
    expect(isNavItemActive(item('/monitoring-points'), '/monitoring/windows/2026-08-30/14')).toBe(false);
  });

  it('uma rota fora do mapa não ativa nada — melhor nenhum destaque que o errado', () => {
    expect(activeNavGroup('/login')).toBeNull();
    expect(NAV_GROUPS.flatMap((group) => group.items).some((navItem) => isNavItemActive(navItem, '/login'))).toBe(false);
  });
});

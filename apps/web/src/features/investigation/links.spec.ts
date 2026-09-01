import { describe, expect, it } from 'vitest';

import { machineSlug, matchesMachineKey, naturalKey, pointSlug, resolveByNaturalKey } from '@dynamox/domain';

import { links } from './links';

const RANGE = { from: '2026-08-24T00:00:00.000Z', to: '2026-08-31T00:00:00.000Z' };

/**
 * O identificador da URL é contrato: um link colado numa mensagem tem que continuar
 * abrindo o mesmo recurso depois. Estes testes fixam a regra dos dois lados — como o
 * segmento é gerado e como ele é resolvido de volta.
 */
describe('identificadores naturais em URL', () => {
  it('usa a etiqueta da máquina quando ela já é segura em URL', () => {
    expect(machineSlug('P-101')).toBe('P-101');
    expect(machineSlug('VE-202 — Exaustor de caldeira')).toBe('VE-202');
    // Sem etiqueta separável, o nome inteiro vira segmento — sem acento e sem espaço.
    expect(machineSlug('Bomba de recirculação')).toBe('bomba-de-recirculacao');
  });

  it('normaliza o ponto para um segmento legível', () => {
    expect(pointSlug('Mancal lado oposto ao acoplamento')).toBe('mancal-lado-oposto-ao-acoplamento');
    expect(naturalKey('Carcaça')).toBe('carcaca');
  });

  it('resolve o identificador de volta, sem depender de caixa ou acento', () => {
    const machines = [{ name: 'P-101' }, { name: 'VE-202 — Exaustor de caldeira' }];
    const found = (key: string) => {
      const resolved = resolveByNaturalKey(machines, key, (machine) => machine.name);
      return resolved.kind === 'found' ? resolved.item.name : resolved.kind;
    };

    expect(found('P-101')).toBe('P-101');
    expect(found('p-101')).toBe('P-101');
    expect(found('VE-202')).toBe('VE-202 — Exaustor de caldeira');
    expect(found('ve-202-exaustor-de-caldeira')).toBe('VE-202 — Exaustor de caldeira');
    expect(found('nao-existe')).toBe('not-found');
  });

  it('o nome completo tem precedência sobre a etiqueta', () => {
    // Cadastro ambíguo de propósito: "P-101" é o nome de uma e a etiqueta da outra.
    const machines = [{ name: 'P-101' }, { name: 'P-101 — Bomba reserva' }];
    const exato = resolveByNaturalKey(machines, 'P-101', (machine) => machine.name);
    expect(exato.kind === 'found' && exato.item.name).toBe('P-101');

    // Sem nome exato, a etiqueta empata — e empate é reportado, nunca escolhido em silêncio.
    const ambiguo = resolveByNaturalKey(
      [{ name: 'P-101 — Bomba principal' }, { name: 'P-101 — Bomba reserva' }],
      'P-101',
      (machine) => machine.name,
    );
    expect(ambiguo.kind).toBe('ambiguous');
    expect(matchesMachineKey('P-101 — Bomba reserva', 'p-101')).toBe(true);
  });

  it('todo link leva o recorte temporal junto', () => {
    const rotas = [
      links.machine('VE-202 — Exaustor de caldeira', RANGE),
      links.point('P-101', 'Mancal lado oposto ao acoplamento', RANGE),
      links.sensor('SIM-HF-002', RANGE),
      links.acquisition('ciclo-1', RANGE),
      links.samples('ciclo-1', RANGE),
    ];
    for (const rota of rotas) {
      expect(rota).toContain(`from=${encodeURIComponent(RANGE.from)}`);
      expect(rota).toContain(`to=${encodeURIComponent(RANGE.to)}`);
    }

    expect(rotas[0]).toMatch(/^\/machines\/VE-202\?/);
    expect(rotas[1]).toMatch(/^\/machines\/P-101\/points\/mancal-lado-oposto-ao-acoplamento\?/);
    expect(links.sensor('SIM-HF-002', RANGE, '15m')).toContain('bucket=15m');
  });

  it('a janela horária vem do instante, não de quem chamou', () => {
    // A rota e a query descrevem o MESMO intervalo: é o que impede título e chip de
    // discordarem sobre qual hora está sendo investigada.
    expect(links.window('2026-08-30T14:37:12.000Z')).toBe(
      '/monitoring/windows/2026-08-30/14?from=2026-08-30T14%3A00%3A00.000Z&to=2026-08-30T15%3A00%3A00.000Z',
    );
    expect(links.window('não é instante')).toBe('/');
  });
});

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AlertDetailDto, AlertListResponseDto, AlertOccurrenceDto } from '@dynamox/domain';

import { AlertsSection } from '../../components/alerts/AlertsSection';
import { renderWithProviders } from '../../test/renderWithProviders';
import { AlertDetailPage } from './AlertDetailPage';
import { AlertsListPage } from './AlertsListPage';

const VIBRATION: AlertOccurrenceDto = {
  id: 'a1a1a1a1-0000-4000-8000-000000000001',
  ruleId: 'r-vib',
  ruleKey: 'vibration-radial',
  type: 'vibration-threshold',
  family: 'condition',
  scope: 'point',
  level: 'A2',
  state: 'active',
  status: 'open',
  machineId: 'm1',
  machineName: 'P-101',
  machineType: 'Pump',
  monitoringPointId: 'p1',
  monitoringPointName: 'Mancal lado oposto ao acoplamento',
  sensorId: 's1',
  sensorSerialNumber: 'SIM-HF-002',
  sensorModel: 'HF+',
  openedAt: '2026-08-27T01:17:00.000Z',
  lastEvaluatedAt: '2026-08-30T23:00:00.000Z',
  acknowledgedAt: null,
  acknowledgedBy: null,
  acknowledgedLevel: null,
  acknowledgeNote: null,
  resolvedAt: null,
  resolutionReason: null,
  metric: 'radial_rms_g',
  unit: 'g',
  thresholdMode: 'ratio-to-baseline',
  trigger: { cycleId: 'c-open', at: '2026-08-27T01:17:00.000Z', value: 0.0226, baseline: 0.015, measure: 1.5, threshold: 1.5, consecutiveEvaluations: 2 },
  peak: { cycleId: 'c-peak', at: '2026-08-30T23:00:00.000Z', value: 0.0565, baseline: null, measure: 3.77 },
  last: { cycleId: 'c-peak', at: '2026-08-30T23:00:00.000Z', value: 0.0565, baseline: null, measure: 3.77 },
  affectedCount: null,
  policyVersion: 1,
};

const FLEET: AlertOccurrenceDto = {
  ...VIBRATION,
  id: 'a1a1a1a1-0000-4000-8000-000000000002',
  ruleId: 'r-presence',
  ruleKey: 'telemetry-presence',
  type: 'fleet-silent',
  family: 'data-quality',
  scope: 'fleet',
  level: 'A1',
  state: 'resolved',
  status: 'resolved',
  machineId: null,
  machineName: null,
  machineType: null,
  monitoringPointId: null,
  monitoringPointName: null,
  sensorId: null,
  sensorSerialNumber: null,
  sensorModel: null,
  openedAt: '2026-08-30T03:00:00.000Z',
  lastEvaluatedAt: '2026-08-30T08:15:00.000Z',
  resolvedAt: '2026-08-30T08:15:00.000Z',
  resolutionReason: 'telemetry-resumed',
  metric: 'telemetry_interval_s',
  unit: 's',
  thresholdMode: 'elapsed-intervals',
  trigger: { cycleId: null, at: '2026-08-30T01:47:00.000Z', value: 4380, baseline: 900, measure: 4.87, threshold: 4, consecutiveEvaluations: 1 },
  peak: { cycleId: null, at: '2026-08-30T08:00:00.000Z', value: 22380, baseline: null, measure: 24.9 },
  last: { cycleId: null, at: '2026-08-30T08:15:00.000Z', value: 22380, baseline: null, measure: 24.9 },
  affectedCount: 12,
};

const DETAIL: AlertDetailDto = {
  ...VIBRATION,
  baseline: {
    status: 'established',
    value: 0.0156,
    learningCycles: 192,
    learnedFrom: '2026-07-31T00:02:00.000Z',
    learnedTo: '2026-08-01T23:47:00.000Z',
    establishedAt: '2026-08-01T23:47:00.000Z',
    minBinCount: 8,
    maxBinCount: 8,
    sensorSerialNumber: 'SIM-HF-002',
  },
  rule: {
    id: 'r-vib',
    key: 'vibration-radial',
    type: 'vibration-threshold',
    family: 'condition',
    enabled: true,
    metric: 'radial_rms_g',
    unit: 'g',
    thresholdMode: 'ratio-to-baseline',
    a1Threshold: 1.5,
    a2Threshold: 2,
    clearThreshold: 1.4,
    consecutiveTrigger: 2,
    consecutiveClear: 4,
    learningCycles: 192,
    minBinCount: 4,
    expectedIntervalSeconds: 900,
    postGapSuppressionMinutes: null,
    fleetCollapseFraction: null,
    policyVersion: 1,
  },
  events: [
    { id: 'e1', type: 'opened', fromState: null, toState: 'active', fromLevel: null, toLevel: 'A1', occurredAt: '2026-08-27T01:17:00.000Z', cycleId: 'c-open', value: 0.0226, measure: 1.5, threshold: 1.5, actor: null, note: null },
    { id: 'e2', type: 'escalated', fromState: 'active', toState: 'active', fromLevel: 'A1', toLevel: 'A2', occurredAt: '2026-08-30T23:00:00.000Z', cycleId: 'c-peak', value: 0.0565, measure: 3.77, threshold: 2, actor: null, note: null },
  ],
};

function listResponse(items: AlertOccurrenceDto[], overrides: Partial<AlertListResponseDto> = {}): AlertListResponseDto {
  return {
    items,
    total: items.length,
    page: 1,
    pageSize: 25,
    totalPages: 1,
    counts: { total: 2, open: 1, acknowledged: 0, resolved: 1, activeA1: 0, activeA2: 1 },
    status: 'active',
    level: null,
    type: null,
    machine: null,
    sensor: null,
    search: null,
    from: null,
    to: null,
    sortBy: 'openedAt',
    sortDir: 'desc',
    ...overrides,
  };
}

function okJson(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200 });
}

/** Inventário que alimenta os seletores de máquina e sensor da listagem. */
const POINTS = [
  {
    id: 'p1',
    name: 'Mancal lado oposto ao acoplamento',
    machine: { id: 'm1', name: 'P-101', type: 'Pump' },
    sensor: { id: 's1', serialNumber: 'SIM-HF-002', model: 'HF+' },
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'p2',
    name: 'Mancal lado acoplamento',
    machine: { id: 'm2', name: 'VE-202 — Exaustor de caldeira', type: 'Fan' },
    sensor: { id: 's2', serialNumber: 'SIM-HF-007', model: 'HF+' },
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
];

function stubApi(handlers: { onAck?: (body: unknown) => Response } = {}) {
  const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/monitoring-points')) {
      return okJson({ items: POINTS, total: POINTS.length, page: 1, pageSize: 50, totalPages: 1, sortBy: 'machineName', sortDir: 'asc' });
    }
    if (url.includes('/analytics/fleet-condition')) {
      return okJson({
        from: '2026-08-24T00:00:00.000Z',
        to: '2026-08-31T00:00:00.000Z',
        generatedAt: '2026-08-31T00:00:00.000Z',
        counts: { total: 1, attention: 1, observation: 0, normal: 0, unclassified: 0, noData: 0, noSensor: 0 },
        points: [
          {
            machineName: 'P-101',
            machineType: 'Pump',
            monitoringPointId: 'p1',
            monitoringPointName: 'Mancal lado oposto ao acoplamento',
            sensorSerialNumber: 'SIM-HF-002',
            sensorModel: 'HF+',
            condition: 'attention',
            freshness: 'current',
            currentValue: 0.0572,
            baselineValue: 0.0164,
            deviationRatio: 3.49,
            currentAt: '2026-08-30T23:00:59.000Z',
            baselineAt: '2026-08-30T22:00:00.000Z',
            currentSampleCount: 60,
            currentCycleId: 'c1',
            baselineCycleId: 'c0',
            unit: 'g',
            trend: [],
          },
        ],
      });
    }
    if (url.includes('/alerts/') && url.endsWith('/acknowledge')) {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      return handlers.onAck ? handlers.onAck(body) : okJson({ ...DETAIL, status: 'acknowledged', acknowledgedAt: '2026-08-31T10:00:00.000Z', acknowledgedBy: 'teste@dynamox.local', acknowledgedLevel: 'A2', acknowledgeNote: body.note ?? null, events: [...DETAIL.events, { id: 'e3', type: 'acknowledged', fromState: 'active', toState: 'active', fromLevel: 'A2', toLevel: 'A2', occurredAt: '2026-08-31T10:00:00.000Z', cycleId: null, value: null, measure: null, threshold: null, actor: 'teste@dynamox.local', note: body.note ?? null }] });
    }
    if (url.includes(`/alerts/${VIBRATION.id}`)) return okJson(DETAIL);
    if (url.includes('/alerts/00000000')) return new Response(JSON.stringify({ code: 'ALERT_NOT_FOUND', message: 'Alerta não encontrado.' }), { status: 404 });
    if (url.includes('/alerts')) {
      const query = new URL(url).searchParams;
      const status = query.get('status');
      if (status === 'resolved') return okJson(listResponse([FLEET], { status: 'resolved' }));
      if (status === 'active' || status === 'open') return okJson(listResponse([VIBRATION], { status }));
      return okJson(listResponse([VIBRATION, FLEET], { status: null }));
    }
    return new Response(JSON.stringify({ message: `Rota não simulada: ${url}` }), { status: 404 });
  });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

function RouteProbe(): JSX.Element {
  const location = useLocation();
  return <div data-testid="rota">{`${location.pathname}${location.search}`}</div>;
}

function renderAlerts(route: string, role: 'ADMIN' | 'VIEWER' = 'ADMIN') {
  return renderWithProviders(
    <>
      <Routes>
        <Route path="/alerts" element={<AlertsListPage />} />
        <Route path="/alerts/:id" element={<AlertDetailPage />} />
        <Route path="/machines/:machineKey" element={<AlertsSection scope={{ machine: 'P-101' }} />} />
      </Routes>
      <RouteProbe />
    </>,
    { route, role },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Alertas — listagem', () => {
  it('padrão é "ativos": pede ao servidor com status=active e mostra as contagens do universo', async () => {
    const fetcher = stubApi();
    renderAlerts('/alerts');
    const table = await screen.findByRole('table', { name: /Alertas/i });
    expect(within(table).getByText(/Vibração/)).toBeDefined();
    expect(within(table).queryByText(/Frota sem telemetria/)).toBeNull();
    const urls = fetcher.mock.calls.map(([input]) => String(input));
    expect(urls.some((url) => /\/alerts\?.*status=active/.test(url))).toBe(true);
    // O seletor mostra quantos há em cada estado, vindo de `counts` — não da página.
    expect(screen.getByRole('button', { name: /^Resolvidos/ }).textContent).toMatch(/Resolvidos1/);
    expect(screen.getByText(/1 em A2 · 0 em A1 ativos/)).toBeDefined();
  });

  it('o recorte mora na URL: trocar o status e o tipo reescreve a query e reconsulta', async () => {
    const fetcher = stubApi();
    renderAlerts('/alerts');
    await screen.findByRole('table', { name: /Alertas/i });
    await userEvent.click(screen.getByRole('button', { name: /^Resolvidos/ }));
    await waitFor(() => expect(screen.getByTestId('rota').textContent).toBe('/alerts?status=resolved'));
    expect(await screen.findByText(/Frota sem telemetria/)).toBeDefined();
    expect(screen.getByText(/Frota · 12 pontos/)).toBeDefined();
    const urls = fetcher.mock.calls.map(([input]) => String(input));
    expect(urls.at(-1)).toMatch(/status=resolved/);
  });

  it('oferece recorte por máquina e por sensor, alimentado pelo cadastro', async () => {
    stubApi();
    renderAlerts('/alerts');
    await screen.findByRole('table', { name: /Alertas/i });
    const machine = screen.getByLabelText('Máquina');
    await userEvent.click(machine);
    const option = await screen.findByRole('option', { name: 'P-101' });
    await userEvent.click(option);
    // O status padrão é implícito: só o que a pessoa escolheu entra na URL.
    await waitFor(() => expect(screen.getByTestId('rota').textContent).toBe('/alerts?machine=P-101'));
    expect(screen.getByLabelText('Sensor')).toBeDefined();
  });

  it('a busca digitada vira ?search= na URL (com pausa) e reconsulta o servidor', async () => {
    const fetcher = stubApi();
    renderAlerts('/alerts');
    await screen.findByRole('table', { name: /Alertas/i });
    await userEvent.type(screen.getByLabelText('Buscar'), 've-202');
    // Debounce: a URL muda uma vez, depois da pausa — não a cada tecla.
    await waitFor(() => expect(screen.getByTestId('rota').textContent).toBe('/alerts?search=ve-202'));
    await waitFor(() => {
      const urls = fetcher.mock.calls.map(([input]) => String(input));
      expect(urls.some((url) => /\/alerts\?.*search=ve-202/.test(url))).toBe(true);
    });
  });

  it('abrir uma linha leva ao detalhe do episódio', async () => {
    stubApi();
    renderAlerts('/alerts');
    const row = await screen.findByRole('link', { name: /Abrir alerta A2 Vibração/i });
    await userEvent.click(row);
    await waitFor(() => expect(screen.getByTestId('rota').textContent).toBe(`/alerts/${VIBRATION.id}`));
    expect(await screen.findByRole('heading', { level: 1, name: /Vibração acima da baseline/i })).toBeDefined();
  });
});

describe('Alertas — detalhe e reconhecimento', () => {
  it('responde regra, evidência, linha do tempo e links para a aquisição do disparo', async () => {
    stubApi();
    renderAlerts(`/alerts/${VIBRATION.id}`);
    await screen.findByRole('heading', { level: 1, name: /Vibração acima da baseline/i });
    // Evidência: valor, baseline, razão e limiar, com o número de leituras consecutivas.
    expect(screen.getByText('1,5× ≥ 1,5×')).toBeDefined();
    expect(screen.getByText(/2 leitura\(s\) consecutiva\(s\)/)).toBeDefined();
    expect(screen.getByText(/^0,02\d* g$/)).toBeDefined();
    // Regra e política: os limiares vigentes e a versão.
    expect(screen.getByText('vibration-radial')).toBeDefined();
    expect(screen.getByText(/Alert Policy v1/)).toBeDefined();
    // Linha do tempo: aberto em A1, escalado para A2.
    const timeline = screen.getByRole('list', { name: /Linha do tempo do alerta/i });
    expect(within(timeline).getAllByRole('listitem')).toHaveLength(2);
    expect(within(timeline).getByText(/Escalado · A2/)).toBeDefined();
    expect(screen.getByRole('link', { name: /Abrir aquisição do disparo/i }).getAttribute('href')).toMatch(/^\/acquisitions\/c-open\?from=/);
    // Baseline aprendida e o período que a produziu — é o que responde "1,5× de quê".
    expect(screen.getByText('192 ciclos')).toBeDefined();
    expect(screen.getAllByText(/31\/07\/2026 → 01\/08\/2026/).length).toBeGreaterThan(0);
    // As DUAS referências lado a lado: sem isso, 3,77× e 3,49× parecem contradição.
    expect(screen.getByText('Razão do alerta')).toBeDefined();
    expect(screen.getByText('Condição atual do ponto')).toBeDefined();
    expect(await screen.findByText('3,49×')).toBeDefined();
    // Alerta ≠ condição, dito na própria tela.
    expect(screen.getByText(/um alerta pode estar aberto com a condição "normal"/i)).toBeDefined();
  });

  it('ADMIN reconhece com nota; a tela reflete o status e o evento sem recarregar', async () => {
    const fetcher = stubApi();
    renderAlerts(`/alerts/${VIBRATION.id}`);
    await userEvent.click(await screen.findByRole('button', { name: /^Reconhecer$/ }));
    const dialog = screen.getByRole('dialog', { name: /Reconhecer alerta/i });
    await userEvent.type(within(dialog).getByLabelText(/Nota/), 'Inspeção agendada');
    await userEvent.click(within(dialog).getByRole('button', { name: /Confirmar reconhecimento/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(await screen.findByText(/Reconhecido por teste@dynamox.local/)).toBeDefined();
    const timeline = screen.getByRole('list', { name: /Linha do tempo do alerta/i });
    expect(within(timeline).getAllByRole('listitem')).toHaveLength(3);
    const ack = fetcher.mock.calls.find(([input]) => String(input).endsWith('/acknowledge'));
    expect(ack).toBeDefined();
    expect(JSON.parse(String(ack?.[1]?.body))).toEqual({ note: 'Inspeção agendada' });
    // Já reconhecido: o botão sai — reconhecer de novo não faz nada.
    expect(screen.queryByRole('button', { name: /^Reconhecer$/ })).toBeNull();
  });

  it('VIEWER vê o episódio inteiro, mas não o botão de reconhecer', async () => {
    stubApi();
    renderAlerts(`/alerts/${VIBRATION.id}`, 'VIEWER');
    await screen.findByRole('heading', { level: 1, name: /Vibração acima da baseline/i });
    expect(screen.queryByRole('button', { name: /^Reconhecer$/ })).toBeNull();
  });

  it('identificador inexistente mostra "não encontrado" com caminho de volta', async () => {
    stubApi();
    renderAlerts('/alerts/00000000-0000-4000-8000-000000000000');
    expect(await screen.findByText(/Alerta não encontrado/)).toBeDefined();
    expect(screen.getByRole('link', { name: /Ver alertas/i }).getAttribute('href')).toBe('/alerts');
  });
});

describe('AlertsSection — costura nas páginas do ativo', () => {
  it('lista ativos e últimos resolvidos do recorte, com link para a listagem filtrada', async () => {
    const fetcher = stubApi();
    renderAlerts('/machines/P-101');
    const section = await screen.findByRole('region', { name: /^Alertas/ });
    expect(await within(section).findByText(/Ativos \(1\)/)).toBeDefined();
    expect(within(section).getByText(/Últimos resolvidos/)).toBeDefined();
    expect(within(section).getByRole('link', { name: /Abrir alerta A2 Vibração/i }).getAttribute('href')).toBe(`/alerts/${VIBRATION.id}`);
    expect(within(section).getByRole('link', { name: /Ver todos/ }).getAttribute('href')).toBe('/alerts?machine=P-101&status=all');
    const urls = fetcher.mock.calls.map(([input]) => String(input));
    expect(urls.every((url) => url.includes('machine=P-101'))).toBe(true);
  });
});

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { TimeSeriesSampleDto, TimeSeriesSummary } from '@dynamox/domain';

import { useLocation } from 'react-router-dom';

import { renderWithProviders } from '../../test/renderWithProviders';
import { OperationalDashboard } from './OperationalDashboard';

const USER = { id: 'u1', email: 'operador@dynamox.local', name: 'Operador', role: 'ADMIN' as const };
const baseMs = Date.now() - 2 * 24 * 60 * 60 * 1000;
const RANGE_FROM = new Date(baseMs - 24 * 60 * 60 * 1000).toISOString();
const RANGE_TO = new Date().toISOString();

function windowAt(offsetMs: number, value: number): TimeSeriesSampleDto[] {
  return [0, 1, 2].map((second) => ({
    timestamp: new Date(baseMs + offsetMs + second * 1000).toISOString(),
    value,
  }));
}

const samplesBySeries: Record<string, TimeSeriesSampleDto[]> = {
  s1y: [...windowAt(0, 1), ...windowAt(60 * 60 * 1000, 1)],
  s1z: [...windowAt(0, 1), ...windowAt(60 * 60 * 1000, 1)],
  s2y: [...windowAt(0, 1), ...windowAt(60 * 60 * 1000, 3)],
  s2z: [...windowAt(0, 1), ...windowAt(60 * 60 * 1000, 3)],
  s2x: [...windowAt(0, 0.008), ...windowAt(60 * 60 * 1000, 0.008)],
};

function series(
  id: string,
  serial: string,
  machine: string,
  point: string,
  axis: 'y' | 'z' | 'x',
): TimeSeriesSummary {
  const data = samplesBySeries[id] ?? [];
  return {
    id,
    sensorSerialNumber: serial,
    sensorModel: 'HF+',
    machineName: machine,
    machineType: 'Pump',
    monitoringPointName: point,
    physicalQuantity: 'acceleration',
    axis,
    unit: 'g',
    displayName: null,
    sampleCount: data.length || 6,
    lastValue: data.at(-1)?.value ?? 0.008,
    lastTimestamp: data.at(-1)?.timestamp ?? new Date(baseMs).toISOString(),
  };
}

const SERIES = [
  series('s1y', 'SIM-HF-001', 'P-101', 'Mancal lado acoplamento', 'y'),
  series('s1z', 'SIM-HF-001', 'P-101', 'Mancal lado acoplamento', 'z'),
  series('s2y', 'SIM-HF-002', 'P-102', 'Mancal lado oposto ao acoplamento', 'y'),
  series('s2z', 'SIM-HF-002', 'P-102', 'Mancal lado oposto ao acoplamento', 'z'),
  // Eixo X do sensor em atenção: mesmo instante das radiais e valor sem relação com a
  // condição. Existe para provar que a evidência exibida não cai nele.
  series('s2x', 'SIM-HF-002', 'P-102', 'Mancal lado oposto ao acoplamento', 'x'),
];

const MACHINES = [
  { id: 'm1', name: 'P-101', type: 'Pump', createdAt: '2026-08-01', updatedAt: '2026-08-01' },
  { id: 'm2', name: 'P-102', type: 'Pump', createdAt: '2026-08-01', updatedAt: '2026-08-01' },
] as const;

const POINTS = [
  {
    id: 'p1',
    name: 'Mancal lado acoplamento',
    machine: { id: 'm1', name: 'P-101', type: 'Pump' },
    sensor: { id: 'sn1', serialNumber: 'SIM-HF-001', model: 'HF+' },
    createdAt: '2026-08-01',
    updatedAt: '2026-08-01',
  },
  {
    id: 'p2',
    name: 'Mancal lado oposto ao acoplamento',
    machine: { id: 'm2', name: 'P-102', type: 'Pump' },
    sensor: { id: 'sn2', serialNumber: 'SIM-HF-002', model: 'HF+' },
    createdAt: '2026-08-01',
    updatedAt: '2026-08-01',
  },
  {
    id: 'p3',
    name: 'Carcaça',
    machine: { id: 'm2', name: 'P-102', type: 'Pump' },
    sensor: null,
    createdAt: '2026-08-01',
    updatedAt: '2026-08-01',
  },
] as const;

/** Tendência curta como o endpoint devolve: buckets já agregados, nunca amostras. */
function trendFixture(values: number[]) {
  return values.map((value, index) => ({
    timestamp: new Date(baseMs + index * 2 * 60 * 60 * 1000).toISOString(),
    value,
  }));
}

/**
 * Condição como o servidor devolve — a fixture reproduz a mesma classificação que antes era
 * derivada das amostras: SIM-HF-002 em atenção, 3x o baseline, com a evidência radial.
 */
function conditionFixture(options: { emptyInventory?: boolean } = {}) {
  if (options.emptyInventory) {
    return { from: RANGE_FROM, to: RANGE_TO, generatedAt: RANGE_TO, points: [] };
  }
  const at = (id: string, index: number) => samplesBySeries[id].at(index)!.timestamp;
  return {
    from: RANGE_FROM,
    to: RANGE_TO,
    generatedAt: RANGE_TO,
    points: [
      {
        machineName: 'P-101',
        machineType: 'Pump',
        monitoringPointId: 'p1',
        monitoringPointName: 'Mancal lado acoplamento',
        sensorSerialNumber: 'SIM-HF-001',
        sensorModel: 'HF+',
        condition: 'normal',
        freshness: 'stale',
        currentValue: 1,
        baselineValue: 1,
        deviationRatio: 1,
        currentAt: at('s1y', -1),
        baselineAt: at('s1y', 0),
        currentSampleCount: 3,
        currentCycleId: 'c1-cur',
        baselineCycleId: 'c1-base',
        unit: 'g',
        trend: trendFixture([1, 1, 1]),
      },
      {
        machineName: 'P-102',
        machineType: 'Pump',
        monitoringPointId: 'p2',
        monitoringPointName: 'Mancal lado oposto ao acoplamento',
        sensorSerialNumber: 'SIM-HF-002',
        sensorModel: 'HF+',
        condition: 'attention',
        freshness: 'stale',
        currentValue: 3,
        baselineValue: 1,
        deviationRatio: 3,
        currentAt: at('s2y', -1),
        baselineAt: at('s2y', 0),
        currentSampleCount: 3,
        currentCycleId: 'c2-cur',
        baselineCycleId: 'c2-base',
        unit: 'g',
        trend: trendFixture([1, 2, 3]),
      },
    ],
  };
}

/**
 * Mapa como o servidor devolve: uma célula por (dia, hora) com cobertura E severidade. As
 * três horas têm desvios diferentes de propósito — é o que o mapa existe para mostrar.
 */
function heatmapFixture(options: { emptyInventory?: boolean } = {}) {
  const day = new Date(baseMs).toISOString().slice(0, 10);
  return {
    from: RANGE_FROM,
    to: RANGE_TO,
    bucket: 'hour',
    expectedSensors: options.emptyInventory ? 0 : 2,
    buckets: options.emptyInventory
      ? []
      : [13, 14, 15].map((hour, index) => ({
          bucketStart: `${day}T${String(hour).padStart(2, '0')}:00:00.000Z`,
          bucketEnd: `${day}T${String(hour + 1).padStart(2, '0')}:00:00.000Z`,
          day,
          hour,
          sampleCount: 120,
          acquisitionCount: 2,
          reportingSensors: 2,
          expectedSensors: 2,
          coveragePercent: 100,
          // 1,02× normal · 1,60× observação · 3,49× atenção — uma faixa da política cada.
          maxDeviationRatio: [1.02, 1.6, 3.49][index],
          maxDeviationValue: [0.0164, 0.0262, 0.0572][index],
          maxDeviationSensor: index === 0 ? 'SIM-HF-001' : 'SIM-HF-002',
          maxDeviationMachine: index === 0 ? 'P-101' : 'P-102',
          maxDeviationPoint: 'Mancal lado oposto ao acoplamento',
        })),
  };
}

/** Série agregada: um ponto por janela de aquisição, como o endpoint devolve. */
function seriesPointsFixture(seriesId: string, window: { from?: string | null; to?: string | null } = {}) {
  // O servidor recorta pela janela pedida; o fixture faz o mesmo — sem isso, trocar o
  // período no painel nunca produziria um resultado vazio como na aplicação real.
  const fromMs = window.from ? Date.parse(window.from) : Number.NEGATIVE_INFINITY;
  const toMs = window.to ? Date.parse(window.to) : Number.POSITIVE_INFINITY;
  const data = (samplesBySeries[seriesId] ?? []).filter((sample) => {
    const t = Date.parse(sample.timestamp);
    return t >= fromMs && t < toMs;
  });
  const byWindow = new Map<string, TimeSeriesSampleDto[]>();
  for (const sample of data) {
    const bucket = new Date(Math.floor(Date.parse(sample.timestamp) / 900_000) * 900_000).toISOString();
    byWindow.set(bucket, [...(byWindow.get(bucket) ?? []), sample]);
  }
  const points = [...byWindow.entries()].map(([bucketStart, items]) => ({
    bucketStart,
    sampleCount: items.length,
    acquisitionCount: 1,
    avg: items.reduce((sum, item) => sum + item.value, 0) / items.length,
    min: Math.min(...items.map((item) => item.value)),
    max: Math.max(...items.map((item) => item.value)),
    lastAt: items.at(-1)!.timestamp,
  }));
  const values = data.map((item) => item.value);
  return {
    seriesId,
    from: RANGE_FROM,
    to: RANGE_TO,
    bucket: '15m',
    stats: {
      sampleCount: data.length,
      acquisitionCount: points.length,
      min: values.length ? Math.min(...values) : null,
      max: values.length ? Math.max(...values) : null,
      avg: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
      firstAt: data[0]?.timestamp ?? null,
      lastAt: data.at(-1)?.timestamp ?? null,
    },
    points,
  };
}

function okJson(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200 });
}

function fixtureFetch(
  options: {
    pointsFail?: boolean;
    emptyInventory?: boolean;
    seriesEmpty?: boolean;
  } = {},
) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.endsWith('/health')) {
      return okJson({
        status: 'ok',
        database: 'up',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
      });
    }
    if (url.endsWith('/machines')) return okJson(options.emptyInventory ? [] : MACHINES);
    if (url.includes('/monitoring-points')) {
      if (options.pointsFail) {
        return new Response(JSON.stringify({ message: 'Pontos indisponíveis' }), { status: 503 });
      }
      return okJson({
        items: options.emptyInventory ? [] : POINTS,
        total: options.emptyInventory ? 0 : POINTS.length,
        page: 1,
        pageSize: 50,
        sortBy: 'machineName',
        sortDir: 'asc',
      });
    }
    if (url.endsWith('/time-series')) return okJson(options.emptyInventory || options.seriesEmpty ? [] : SERIES);
    const metric = url.match(/time-series\/(s\d[xyz])\/metrics/);
    if (metric) {
      const data = samplesBySeries[metric[1]];
      return okJson({
        count: data.length,
        min: Math.min(...data.map((item) => item.value)),
        max: Math.max(...data.map((item) => item.value)),
        avg: data.reduce((sum, item) => sum + item.value, 0) / data.length,
        last: data.at(-1)?.value ?? null,
        firstTimestamp: data[0].timestamp,
        lastTimestamp: data.at(-1)?.timestamp ?? null,
      });
    }
    if (url.includes('/analytics/fleet-condition')) {
      return okJson(conditionFixture({ emptyInventory: options.emptyInventory }));
    }
    if (url.includes('/analytics/heatmap')) {
      return okJson(heatmapFixture({ emptyInventory: options.emptyInventory }));
    }
    const points = url.match(/analytics\/series\/(s\d[xyz])\/points/);
    if (points) {
      const query = new URL(url).searchParams;
      return okJson(seriesPointsFixture(points[1], { from: query.get('from'), to: query.get('to') }));
    }
    const sample = url.match(/time-series\/(s\d[xyz])\/samples/);
    if (sample) {
      const data = samplesBySeries[sample[1]];
      return okJson({ items: data, total: data.length, limit: 5000, offset: 0 });
    }
    if (url.includes('/alerts')) return okJson(alertsFixture({ emptyInventory: options.emptyInventory }));
    return new Response(JSON.stringify({ message: `Rota não simulada: ${url}` }), { status: 404 });
  });
}

/** Alertas persistidos pelo motor: um A2 ativo em SIM-HF-002 e um episódio de frota resolvido. */
function alertsFixture(options: { emptyInventory?: boolean } = {}) {
  const items = options.emptyInventory
    ? []
    : [
        {
          id: 'alrt-0000-0000-4000-8000-000000000001',
          ruleId: 'r-vib',
          ruleKey: 'vibration-radial',
          type: 'vibration-threshold',
          family: 'condition',
          scope: 'point',
          level: 'A2',
          state: 'active',
          status: 'open',
          machineId: 'm2',
          machineName: 'P-102',
          machineType: 'Pump',
          monitoringPointId: 'p2',
          monitoringPointName: 'Mancal lado oposto ao acoplamento',
          sensorId: 's2',
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
        },
        {
          id: 'alrt-0000-0000-4000-8000-000000000002',
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
          acknowledgedAt: null,
          acknowledgedBy: null,
          acknowledgedLevel: null,
          acknowledgeNote: null,
          resolvedAt: '2026-08-30T08:15:00.000Z',
          resolutionReason: 'telemetry-resumed',
          metric: 'telemetry_interval_s',
          unit: 's',
          thresholdMode: 'elapsed-intervals',
          trigger: { cycleId: null, at: '2026-08-30T01:47:00.000Z', value: 4380, baseline: 900, measure: 4.87, threshold: 4, consecutiveEvaluations: 1 },
          peak: { cycleId: null, at: '2026-08-30T08:00:00.000Z', value: 22380, baseline: null, measure: 24.9 },
          last: { cycleId: null, at: '2026-08-30T08:15:00.000Z', value: 22380, baseline: null, measure: 24.9 },
          affectedCount: 12,
        },
      ];
  return {
    items,
    total: items.length,
    page: 1,
    pageSize: 6,
    totalPages: 1,
    counts: options.emptyInventory
      ? { total: 0, open: 0, acknowledged: 0, resolved: 0, activeA1: 0, activeA2: 0 }
      : { total: 2, open: 1, acknowledged: 0, resolved: 1, activeA1: 0, activeA2: 1 },
    status: null,
    level: null,
    type: null,
    machine: null,
    sensor: null,
    from: null,
    to: null,
    sortBy: 'lastEvaluatedAt',
    sortDir: 'desc',
  };
}

/** Sonda de rota: o MemoryRouter não mexe em window.location, então a URL é observada aqui. */
function RouteProbe(): JSX.Element {
  const location = useLocation();
  return <div data-testid="rota">{`${location.pathname}${location.search}`}</div>;
}

function renderDashboard(fetcher = fixtureFetch()) {
  vi.stubGlobal('fetch', fetcher);
  // O painel navega para a investigação: precisa de um Router mesmo montado sozinho.
  return renderWithProviders(
    <>
      <OperationalDashboard />
      <RouteProbe />
    </>,
    {
      route: '/',
      preloadedState: { auth: { status: 'authenticated', user: USER, error: null } },
    },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserverMock {
      private readonly callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe(target: Element): void {
        this.callback(
          [
            {
              target,
              contentRect: { width: 900, height: 320 },
            } as ResizeObserverEntry,
          ],
          this as unknown as ResizeObserver,
        );
      }
      unobserve(): void {}
      disconnect(): void {}
    },
  );
});

describe('OperationalDashboard', () => {
  it('renderiza loading inicial com skeletons sem derrubar as seções', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => undefined)));
    renderDashboard(vi.mocked(fetch));
    expect(screen.getByRole('heading', { name: /Visão geral operacional/i })).toBeDefined();
    expect(screen.getByLabelText(/Carregando matriz de sensores/i)).toBeDefined();
    expect(screen.getByLabelText(/Ativos em atenção: carregando/i)).toBeDefined();
  });

  it('os quatro KPIs separam condição, magnitude, cobertura e alertas', async () => {
    renderDashboard();
    // Condição: apenas o sensor com desvio.
    expect(await screen.findByLabelText(/^Ativos em atenção: 1\b/)).toBeDefined();
    // Magnitude: o maior desvio atual, com a grandeza que o sustenta.
    const desvio = screen.getByLabelText(/^Maior desvio: 3×/);
    // O KPI nomeia a grandeza que sustenta a razão — não um "valor" genérico.
    expect(within(desvio).getByText(/RMS radial Y\/Z/i)).toBeDefined();
    // Cobertura: instrumentados e reportando sobre o total de pontos.
    expect(screen.getByLabelText(/^Cobertura monitorada: 66,7%/)).toBeDefined();
    // Alertas: episódios persistidos pelo motor — conceito distinto da condição ao lado.
    const alertas = await screen.findByLabelText(/^Alertas abertos: 1\b/);
    expect(within(alertas).getByText(/1 em A2 · 0 em A1 ativos/)).toBeDefined();
    // "Aberto" na home é o mesmo "Aberto" da listagem: ativo e não reconhecido.
    expect(alertas.getAttribute('href')).toBe('/alerts?status=open');
  });

  it('a carga não busca métricas por série nem amostra bruta: tudo vem agregado', async () => {
    const fetcher = fixtureFetch();
    renderDashboard(fetcher);
    await screen.findByLabelText(/^Ativos em atenção: 1\b/);
    await waitFor(() => expect(screen.getAllByText(/3×/).length).toBeGreaterThan(0));

    const urls = fetcher.mock.calls.map(([input]) => String(input));
    // O resumo das séries já traz a última leitura: nenhuma chamada de métricas.
    expect(urls.filter((url) => url.includes('/metrics'))).toHaveLength(0);
    // REGRESSÃO PROTEGIDA: o painel não baixa telemetria bruta em hipótese alguma.
    expect(urls.filter((url) => url.includes('/samples'))).toHaveLength(0);
    // Inventário: máquinas + pontos + séries, e nada de contagem por série.
    const inventario = urls.filter(
      (url) =>
        !url.includes('/analytics/') && !url.endsWith('/health') && !url.includes('/auth/') && !url.includes('/alerts'),
    );
    expect(inventario).toHaveLength(3);
    // Alertas: UMA consulta resumida (contagens + feed), sem janela — alerta tem o próprio tempo.
    const alertas = urls.filter((url) => url.includes('/alerts'));
    expect(alertas).toHaveLength(1);
    expect(alertas[0]).not.toMatch(/from=/);
    expect(urls.filter((url) => url.includes('withCounts'))).toHaveLength(0);
    // Condição: UMA consulta agregada com a janela do período, no lugar de uma por série.
    const condicao = urls.filter((url) => url.includes('/analytics/fleet-condition'));
    expect(condicao).toHaveLength(1);
    expect(condicao[0]).toMatch(/from=.+&to=/);
    // Tendência: pontos agregados da série selecionada, com bucket declarado.
    const pontos = urls.filter((url) => url.includes('/analytics/series/'));
    expect(pontos.length).toBeGreaterThan(0);
    expect(pontos.every((url) => /bucket=(15m|1h|4h|1d)/.test(url))).toBe(true);
  });

  it('a prioridade lista exceções primeiro, com valor e desvio da medição que classificou', async () => {
    renderDashboard();
    const fila = await screen.findByRole('region', { name: /Prioridade de inspeção/i });
    expect(within(fila).getByText(/Mostrando 2 de 2 avaliados/i)).toBeDefined();

    const linhas = within(fila).getAllByRole('row').slice(1); // sem o cabeçalho
    // Exceção antes do normal.
    expect(linhas[0].textContent).toContain('SIM-HF-002');
    expect(within(linhas[0]).getByText('Atenção')).toBeDefined();
    // Valor atual = RMS radial (3 g), nunca o eixo X (0,008 g).
    expect(within(linhas[0]).getByText('3 g')).toBeDefined();
    expect(within(linhas[0]).getByText('3×')).toBeDefined();
    expect(within(linhas[0]).queryByText(/0,008/)).toBeNull();
    expect(linhas[1].textContent).toContain('SIM-HF-001');
  });

  it('a linha da prioridade troca o contexto na própria página', async () => {
    renderDashboard();
    const fila = await screen.findByRole('region', { name: /Prioridade de inspeção/i });
    await waitFor(() => expect(within(fila).getByText('Atenção')).toBeDefined());
    await userEvent.click(within(fila).getAllByRole('row')[1]);

    const investigacao = await screen.findByRole('heading', { name: /Investigação — SIM-HF-002/i });
    // O drill-down entrega o foco: o caminho também existe no teclado.
    await waitFor(() => expect(document.activeElement).toBe(investigacao));
    // O painel de série temporal declara o contexto completo.
    const trend = screen.getByRole('region', { name: /Série temporal/i });
    expect(trend.textContent).toContain('SIM-HF-002');
    // Trocar o contexto NÃO é navegar: a home continua sendo a rota.
    expect(screen.getByTestId('rota').textContent).toBe('/');
  });

  it('a prioridade é ponto de entrada: máquina, ponto e sensor levam às suas páginas', async () => {
    renderDashboard();
    const fila = await screen.findByRole('region', { name: /Prioridade de inspeção/i });
    await waitFor(() => expect(within(fila).getByText('Atenção')).toBeDefined());

    // Cada identificador da linha aponta para o seu próprio nível da investigação.
    const linha = within(fila).getAllByRole('row')[1];
    expect(within(linha).getByRole('link', { name: 'P-102' }).getAttribute('href')).toMatch(
      /^\/machines\/P-102\?from=.+&to=/,
    );
    expect(within(linha).getByRole('link', { name: 'NDE' }).getAttribute('href')).toMatch(
      /^\/machines\/P-102\/points\/mancal-lado-oposto-ao-acoplamento\?from=/,
    );
    expect(within(linha).getByRole('link', { name: 'SIM-HF-002' }).getAttribute('href')).toMatch(
      /^\/sensors\/SIM-HF-002\?from=/,
    );

    // Um destino, um controle: a fila não repete uma seta "ver" ao lado de um serial que
    // já é o link para o mesmo lugar.
    expect(within(linha).queryByRole('button', { name: /Abrir o sensor/i })).toBeNull();
    await userEvent.click(within(linha).getByRole('link', { name: 'SIM-HF-002' }));
    await waitFor(() =>
      expect(screen.getByTestId('rota').textContent).toMatch(/^\/sensors\/SIM-HF-002\?from=.+&to=/),
    );
  });

  it('a miniatura de tendência vem agregada do servidor, sem baixar amostras', async () => {
    const fetcher = fixtureFetch();
    renderDashboard(fetcher);
    const fila = await screen.findByRole('region', { name: /Prioridade de inspeção/i });
    await waitFor(() => expect(within(fila).getByText('Atenção')).toBeDefined());

    // A condição é pedida COM a tendência — é o que devolve as miniaturas.
    const urls = fetcher.mock.calls.map(([input]) => String(input));
    expect(urls.filter((url) => url.includes('/analytics/fleet-condition'))[0]).toContain(
      'includeTrend=true',
    );
    // REGRESSÃO PROTEGIDA: a miniatura voltou sem reabrir a porta da telemetria bruta.
    expect(urls.filter((url) => url.includes('/samples'))).toHaveLength(0);
  });

  it('a célula da matriz abre o ponto correspondente', async () => {
    renderDashboard();
    // A granularidade visual da célula é o ponto monitorado — e é para ele que ela leva.
    const cell = await screen.findByRole('button', {
      name: /Abrir P-102, Mancal lado oposto ao acoplamento, SIM-HF-002/i,
    });
    // A célula carrega MAGNITUDE, não só categoria: 3× no ponto em atenção, 1× no normal.
    const matriz = screen.getByRole('region', { name: /Matriz de condição da frota/i });
    expect(within(matriz).getByText('3×')).toBeDefined();
    // '1×' também nomeia a faixa na legenda — a célula é a segunda ocorrência.
    expect(within(matriz).getAllByText('1×').length).toBeGreaterThanOrEqual(2);
    await userEvent.click(cell);
    await waitFor(() =>
      expect(screen.getByTestId('rota').textContent).toMatch(
        /^\/machines\/P-102\/points\/mancal-lado-oposto-ao-acoplamento\?from=.+&to=/,
      ),
    );
  });

  it('os alertas recentes são episódios persistidos e abrem o próprio episódio', async () => {
    renderDashboard();
    const painel = await screen.findByRole('region', { name: /Alertas recentes/i });
    // Um A2 ativo em SIM-HF-002 e uma parada da planta já resolvida — ambos com status próprio.
    expect(await within(painel).findByText(/Vibração · P-102 · Mancal lado oposto ao acoplamento · SIM-HF-002/i)).toBeDefined();
    expect(within(painel).getByText(/Frota sem telemetria · Frota · 12 pontos/i)).toBeDefined();
    expect(within(painel).getAllByText(/Resolvido/)).toHaveLength(1);
    expect(within(painel).queryByText(/não há alarmes persistidos/i)).toBeNull();
    expect(within(painel).getByRole('link', { name: /Ver todos/i }).getAttribute('href')).toBe('/alerts?status=active');

    // Abrir leva ao episódio — regra, evidência e linha do tempo —, não a uma janela genérica.
    await userEvent.click(within(painel).getByRole('button', { name: /Abrir alerta A2 Vibração/i }));
    await waitFor(() =>
      expect(screen.getByTestId('rota').textContent).toBe('/alerts/alrt-0000-0000-4000-8000-000000000001'),
    );
  });

  it('o mapa de severidade e o perfil 24 h são mestre/detalhe, e a célula abre a janela', async () => {
    renderDashboard();
    const mapa = await screen.findByRole('region', { name: /Severidade por hora/i });
    const perfil = screen.getByRole('region', { name: /Severidade do dia/i });

    // A célula anuncia MAGNITUDE e de quem ela é — não "quantos sensores reportaram".
    const celula = within(mapa).getByRole('button', { name: /Investigar .* 14h: pior desvio 1,6× em SIM-HF-002/i });
    expect(celula).toBeDefined();
    // O pico do período fica no cabeçalho, para não precisar caçar a célula mais escura.
    expect(within(mapa).getByText(/pico 3,49× · SIM-HF-002/)).toBeDefined();
    // Cada faixa da política pinta diferente: normal, observação e atenção são distinguíveis.
    const cores = [13, 14, 15].map((hour) =>
      getComputedStyle(within(mapa).getByRole('button', { name: new RegExp(`Investigar .* ${hour}h:`) })).backgroundColor,
    );
    expect(new Set(cores).size).toBe(3);
    // O perfil detalha o mesmo dia com a MESMA métrica do mapa — e nomeia a pior hora.
    expect(within(perfil).getByText(/Pior hora do dia: 15h — 3,49× em SIM-HF-002/)).toBeDefined();

    await userEvent.click(celula);
    // O clique navega para a janela investigada, em vez de rolar a própria home.
    await waitFor(() =>
      expect(screen.getByTestId('rota').textContent).toMatch(/\/monitoring\/windows\/\d{4}-\d{2}-\d{2}\/14/),
    );
    expect(screen.getByTestId('rota').textContent).toMatch(/from=.+&to=/);
  });

  it('quem puxa a severidade agrupa os líderes de cada hora por sensor', async () => {
    renderDashboard();
    const painel = await screen.findByRole('region', { name: /Quem puxa a severidade/i });
    // SIM-HF-002 lidera 14 h e 15 h (pico 3,49×); SIM-HF-001 lidera 13 h (1,02×).
    const linha = within(painel).getByRole('button', { name: /Investigar o pico de SIM-HF-002/i });
    expect(within(linha).getByText('3,49×')).toBeDefined();
    expect(within(linha).getByText(/2 h/)).toBeDefined();
    expect(within(painel).getByRole('button', { name: /Investigar o pico de SIM-HF-001: 1,02×/i })).toBeDefined();

    // O clique abre a janela do PICO do sensor — não uma janela genérica.
    await userEvent.click(linha);
    await waitFor(() =>
      expect(screen.getByTestId('rota').textContent).toMatch(/\/monitoring\/windows\/\d{4}-\d{2}-\d{2}\/15/),
    );
  });

  it('a janela ancora na última leitura, não no relógio — 24 h continua mostrando dado', async () => {
    const fetcher = fixtureFetch();
    renderDashboard(fetcher);
    await screen.findByLabelText(/^Ativos em atenção: 1\b/);

    // A consulta de condição vai ancorada no fim do DADO (o fixture termina há 2 dias),
    // não em Date.now(): ancorar no relógio faz a baseline deslizar para fora da janela
    // e o painel inteiro apodrecer em "sem classificação" quando a ingestão para.
    const fleetUrl = fetcher.mock.calls
      .map(([input]) => String(input))
      .find((url) => url.includes('/analytics/fleet-condition'));
    const to = Date.parse(new URL(fleetUrl!, 'http://localhost').searchParams.get('to')!);
    const dataEnd = Math.max(
      ...Object.values(samplesBySeries).flat().map((sample) => Date.parse(sample.timestamp)),
    );
    expect(to).toBeGreaterThanOrEqual(dataEnd);
    expect(to - dataEnd).toBeLessThan(5 * 60_000);

    // Trocar para 24 h significa o último dia DE DADO: a série continua visível.
    await userEvent.click(screen.getByRole('button', { name: /^24 h$/i }));
    await waitFor(() => expect(screen.getByRole('region', { name: /Série temporal — 24 h/i })).toBeDefined());
    expect(screen.queryByText(/Sem dados em 24 horas/i)).toBeNull();
  });

  it('mantém dados parciais e orienta nova tentativa quando pontos falham', async () => {
    renderDashboard(fixtureFetch({ pointsFail: true }));
    expect(await screen.findByText(/Dados parciais/i)).toBeDefined();
    expect(screen.getByText(/Pontos indisponíveis/i)).toBeDefined();
    // O alerta de dados parciais tem a própria ação; o mapa pode ter a dele.
    const alerta = screen.getByRole('alert');
    expect(within(alerta).getByRole('button', { name: /Tentar novamente/i })).toBeDefined();
  });

  it('orienta o primeiro cadastro quando não há máquinas', async () => {
    renderDashboard(fixtureFetch({ emptyInventory: true }));
    expect(await screen.findByText(/Nenhuma máquina cadastrada/i)).toBeDefined();
    expect(screen.getByLabelText(/^Ativos em atenção: 0/)).toBeDefined();
    expect(screen.getByText(/Cadastre uma máquina e seus pontos/i)).toBeDefined();
  });

  it('mantém sensores instalados como sem dados quando não existem séries', async () => {
    renderDashboard(fixtureFetch({ seriesEmpty: true }));
    expect(await screen.findByLabelText(/^Cobertura monitorada: 0%/)).toBeDefined();
    expect(screen.getAllByText(/Sem dados/i).length).toBeGreaterThan(0);
    expect(within(screen.getByRole('region', { name: /Série temporal/i })).getByText(/Nenhuma série persistida/i)).toBeDefined();
  });

  it('a série temporal é UM painel: filtros hierárquicos, estatísticas do servidor e a curva', async () => {
    renderDashboard();
    await screen.findByLabelText(/^Ativos em atenção: 1\b/);
    const trend = await screen.findByRole('region', { name: /Série temporal/i });
    // Os quatro filtros hierárquicos vivem aqui — não existe um segundo painel da mesma série.
    for (const label of ['Máquina', 'Ponto', 'Sensor', 'Eixo / métrica']) {
      expect(within(trend).getByLabelText(label)).toBeDefined();
    }
    // As estatísticas são as de `stats` da resposta agregada — inclusive aquisições, que o
    // cliente não teria como contar sem as amostras.
    await waitFor(() => expect(within(trend).getByText('Aquisições')).toBeDefined());
    expect(within(trend).getByText('Amostras')).toBeDefined();
    expect(within(trend).getByText('Média')).toBeDefined();
    expect(within(trend).getByText(/agregado no banco/)).toBeDefined();
  });

  it('expõe a hierarquia da página na ordem da decisão operacional', async () => {
    renderDashboard();
    expect(await screen.findByRole('heading', { level: 1, name: /Visão geral operacional/i })).toBeDefined();
    const titulos = screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent ?? '');
    const iFila = titulos.findIndex((t) => /Prioridade de inspeção/.test(t));
    const iMapa = titulos.findIndex((t) => /Severidade por hora/.test(t));
    const iTendencia = titulos.findIndex((t) => /Série temporal/.test(t));
    const iMatriz = titulos.findIndex((t) => /Matriz de condição da frota/.test(t));
    // Prioridade → onde no tempo piorou → a evidência da série → a matriz fecha.
    expect(iFila).toBeGreaterThanOrEqual(0);
    expect(iFila).toBeLessThan(iMapa);
    expect(iMapa).toBeLessThan(iTendencia);
    expect(iTendencia).toBeLessThan(iMatriz);
    expect(screen.getByRole('button', { name: /7 dias/i }).getAttribute('aria-pressed')).toBe('true');
  });
});

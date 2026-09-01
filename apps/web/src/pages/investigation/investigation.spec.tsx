import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/renderWithProviders';
import { AcquisitionPage } from './AcquisitionPage';
import { MachinePage } from '../resources/MachinePage';
import { MonitoringPointPage } from '../resources/MonitoringPointPage';
import { RawSamplesPage } from './RawSamplesPage';
import { SensorPage } from './SensorPage';
import { TimeWindowPage } from './TimeWindowPage';

const USER = { id: 'u1', email: 'operador@dynamox.local', name: 'Operador', role: 'ADMIN' as const };
const FROM = '2026-08-30T14:00:00.000Z';
const TO = '2026-08-30T15:00:00.000Z';
const CYCLE = '11111111-1111-4111-8111-111111111111';

const TREND = [
  { timestamp: '2026-08-30T12:00:00.000Z', value: 0.0164 },
  { timestamp: '2026-08-30T13:00:00.000Z', value: 0.031 },
  { timestamp: '2026-08-30T14:00:00.000Z', value: 0.0572 },
];

/** Resumo do ativo como o endpoint devolve: agregado, com uma linha por ponto. */
const ASSET_SUMMARY = {
  machineId: 'm1',
  machineName: 'P-101',
  machineType: 'Pump',
  slug: 'P-101',
  from: FROM,
  to: TO,
  kpis: {
    points: 2,
    sensors: 2,
    attention: 1,
    acquisitionCount: 8,
    coveragePercent: 100,
    maxDeviationRatio: 3.49,
    maxDeviationPoint: 'Mancal lado oposto ao acoplamento',
  },
  lastAt: '2026-08-30T14:47:59.000Z',
  createdAt: FROM,
  updatedAt: FROM,
  counts: { total: 2, attention: 1, observation: 0, normal: 1, unclassified: 0, noData: 0, noSensor: 0 },
  condition: null,
  points: [
    {
      monitoringPointId: 'p1',
      monitoringPointName: 'Mancal lado oposto ao acoplamento',
      slug: 'mancal-lado-oposto-ao-acoplamento',
      sensorSerialNumber: 'SIM-HF-002',
      sensorModel: 'HF+',
      condition: 'attention',
      freshness: 'current',
      currentValue: 0.0572,
      baselineValue: 0.0164,
      deviationRatio: 3.49,
      lastAt: '2026-08-30T14:47:59.000Z',
      acquisitionCount: 4,
      sampleCount: 240,
      min: 0.024,
      max: 0.061,
      avg: 0.03,
      unit: 'g',
      trend: TREND,
    },
    {
      monitoringPointId: 'p2',
      monitoringPointName: 'Mancal lado acoplamento',
      slug: 'mancal-lado-acoplamento',
      sensorSerialNumber: 'SIM-HF-001',
      sensorModel: 'HF+',
      condition: 'normal',
      freshness: 'current',
      currentValue: 0.0164,
      baselineValue: 0.0164,
      deviationRatio: 1,
      lastAt: '2026-08-30T14:47:59.000Z',
      acquisitionCount: 4,
      sampleCount: 240,
      min: 0.012,
      max: 0.02,
      avg: 0.016,
      unit: 'g',
      trend: TREND,
    },
  ],
};

const POINT_SUMMARY = {
  machineId: 'm1',
  machineName: 'P-101',
  machineType: 'Pump',
  machineSlug: 'P-101',
  monitoringPointId: 'p1',
  monitoringPointName: 'Mancal lado oposto ao acoplamento',
  slug: 'mancal-lado-oposto-ao-acoplamento',
  from: FROM,
  to: TO,
  sensorSerialNumber: 'SIM-HF-002',
  sensorModel: 'HF+',
  condition: 'attention',
  freshness: 'current',
  currentValue: 0.0572,
  baselineValue: 0.0164,
  deviationRatio: 3.49,
  currentAt: '2026-08-30T14:47:59.000Z',
  baselineAt: '2026-08-30T14:32:00.000Z',
  currentCycleId: CYCLE,
  baselineCycleId: 'outro',
  unit: 'g',
  window: {
    acquisitionCount: 4,
    sampleCount: 240,
    min: 0.024,
    max: 0.061,
    avg: 0.03,
    lastValue: 0.0572,
    lastAt: '2026-08-30T14:47:59.000Z',
  },
  trend: TREND,
  series: [
    {
      seriesId: 'series-y',
      physicalQuantity: 'acceleration',
      axis: 'y',
      unit: 'g',
      lastValue: 0.0572,
      lastAt: '2026-08-30T14:47:59.000Z',
    },
  ],
};

function okJson(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200 });
}

/** Rotas simuladas: qualquer chamada não prevista falha com 404 explícito. */
function stubApi(overrides: Record<string, unknown> = {}) {
  const calls: string[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);

    if (url.includes('/analytics/machines/')) {
      if (url.includes('/desconhecido')) {
        return new Response(
          JSON.stringify({ code: 'MACHINE_NOT_FOUND', message: 'Ativo "desconhecido" não encontrado.' }),
          { status: 404 },
        );
      }
      return okJson(url.includes('/points/') ? (overrides.point ?? POINT_SUMMARY) : (overrides.asset ?? ASSET_SUMMARY));
    }

    if (url.includes('/analytics/time-windows')) {
      return okJson(
        overrides.timeWindow ?? {
          from: FROM,
          to: TO,
          kpis: {
            reportingSensors: 2,
            silentSensors: 0,
            expectedSensors: 2,
            acquisitionCount: 8,
            sampleCount: 480,
            maxValue: 0.0611,
            maxValueSensor: 'SIM-HF-002',
          },
          items: [
            {
              sensorSerialNumber: 'SIM-HF-002',
              sensorModel: 'HF+',
              seriesId: 'series-y',
              machineName: 'P-101',
              machineType: 'Pump',
              monitoringPointId: 'p1',
              monitoringPointName: 'Mancal lado oposto ao acoplamento',
              sampleCount: 240,
              acquisitionCount: 4,
              min: 0.024,
              max: 0.028,
              avg: 0.026,
              lastValue: 0.025,
              lastAt: '2026-08-30T14:47:59.000Z',
              unit: 'g',
            },
          ],
          total: 1,
          page: 1,
          pageSize: 25,
          totalPages: 1,
        },
      );
    }

    if (url.includes('/analytics/fleet-condition')) {
      return okJson({
        from: FROM,
        to: TO,
        generatedAt: TO,
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
            currentAt: '2026-08-30T14:47:59.000Z',
            baselineAt: '2026-08-30T14:32:00.000Z',
            currentSampleCount: 60,
            currentCycleId: CYCLE,
            baselineCycleId: 'outro',
            unit: 'g',
          },
        ],
      });
    }

    if (url.endsWith('/time-series') || url.includes('/time-series?')) {
      return okJson([
        {
          id: 'series-y',
          sensorSerialNumber: 'SIM-HF-002',
          sensorModel: 'HF+',
          machineName: 'P-101',
          machineType: 'Pump',
          monitoringPointName: 'Mancal lado oposto ao acoplamento',
          physicalQuantity: 'acceleration',
          axis: 'y',
          unit: 'g',
          displayName: null,
          sampleCount: null,
          lastValue: 0.0572,
          lastTimestamp: '2026-08-30T14:47:59.000Z',
        },
      ]);
    }

    if (url.includes('/analytics/series/')) {
      return okJson({
        seriesId: 'series-y',
        from: FROM,
        to: TO,
        bucket: '15m',
        stats: {
          sampleCount: 240,
          acquisitionCount: 4,
          min: 0.024,
          max: 0.028,
          avg: 0.026,
          firstAt: FROM,
          lastAt: TO,
        },
        points: [
          { bucketStart: FROM, sampleCount: 60, acquisitionCount: 1, avg: 0.026, min: 0.024, max: 0.028, lastAt: FROM },
        ],
      });
    }

    if (url.includes('/acquisitions/') && url.includes('/samples')) {
      const cursor = new URL(url, 'http://x').searchParams.get('cursor');
      return okJson(
        cursor
          ? {
              cycleId: CYCLE,
              items: [
                { id: 's3', timestamp: '2026-08-30T14:47:02.000Z', value: 0.027, physicalQuantity: 'acceleration', axis: 'y', unit: 'g' },
              ],
              limit: 2,
              nextCursor: null,
              quantity: null,
              axis: null,
            }
          : {
              cycleId: CYCLE,
              items: [
                { id: 's1', timestamp: '2026-08-30T14:47:00.000Z', value: 0.025, physicalQuantity: 'acceleration', axis: 'y', unit: 'g' },
                { id: 's2', timestamp: '2026-08-30T14:47:01.000Z', value: 0.026, physicalQuantity: 'acceleration', axis: 'y', unit: 'g' },
              ],
              limit: 2,
              nextCursor: 'cursor-2',
              quantity: null,
              axis: null,
            },
      );
    }

    if (url.includes('/analytics/sensors/') && url.includes('/acquisitions')) {
      const page = new URL(url, 'http://x').searchParams.get('page') ?? '1';
      return okJson({
        serialNumber: 'SIM-HF-002',
        from: FROM,
        to: TO,
        items: [
          {
            cycleId: page === '1' ? CYCLE : '22222222-2222-4222-8222-222222222222',
            externalCycleId: null,
            startedAt: page === '1' ? '2026-08-30T14:47:00.000Z' : '2026-08-30T14:32:00.000Z',
            endedAt: page === '1' ? '2026-08-30T14:47:59.000Z' : '2026-08-30T14:32:59.000Z',
            durationSeconds: 60,
            rpm: 1750,
            loadPercent: 78.5,
            scenario: 'normal',
            sampleCount: 300,
            anchorSampleCount: 60,
            min: 0.024,
            max: 0.028,
            avg: 0.026,
            event: 'imbalance',
            expectedState: 'observation',
            unit: 'g',
          },
        ],
        page: Number(page),
        pageSize: 25,
        total: 100,
        totalPages: 4,
        hasNextPage: true,
      });
    }

    if (url.includes('/analytics/acquisitions/')) {
      return okJson({
        cycleId: CYCLE,
        externalCycleId: 'sim.SIM-HF-002.normal.s42',
        sensorSerialNumber: 'SIM-HF-002',
        sensorModel: 'HF+',
        machineName: 'P-101',
        monitoringPointName: 'Mancal lado oposto ao acoplamento',
        startedAt: '2026-08-30T14:47:00.000Z',
        endedAt: '2026-08-30T14:47:59.000Z',
        durationSeconds: 60,
        rpm: 1750,
        loadPercent: 78.5,
        scenario: 'normal',
        origin: 'SIMULATION',
        tags: ['simulated', 'dataset:history'],
        ingestedAt: '2026-08-30T22:51:50.000Z',
        sampleCount: 300,
        measurementCount: 5,
        groundTruth: { fault: true, expectedAlert: true, expectedState: 'observation' },
        series: [
          {
            seriesId: 'series-y',
            physicalQuantity: 'acceleration',
            axis: 'y',
            unit: 'g',
            sampleCount: 60,
            min: 0.024,
            max: 0.028,
            avg: 0.026,
            rms: 0.026,
            startedAt: '2026-08-30T14:47:00.000Z',
            endedAt: '2026-08-30T14:47:59.000Z',
          },
        ],
      });
    }

    return new Response(JSON.stringify({ message: `Rota não simulada: ${url}` }), { status: 404 });
  });
  vi.stubGlobal('fetch', fetchMock);
  return { fetchMock, calls };
}

function renderAt(route: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/monitoring/windows/:date/:hour" element={<TimeWindowPage />} />
      <Route path="/machines/:machineKey" element={<MachinePage />} />
      <Route path="/machines/:machineKey/points/:pointKey" element={<MonitoringPointPage />} />
      <Route path="/sensors/:serialNumber" element={<SensorPage />} />
      <Route path="/acquisitions/:cycleId" element={<AcquisitionPage />} />
      <Route path="/acquisitions/:cycleId/samples" element={<RawSamplesPage />} />
    </Routes>,
    { route, preloadedState: { auth: { status: 'authenticated', user: USER, error: null } } },
  );
}

class ResizeObserverMock {
  constructor(private readonly callback: ResizeObserverCallback) {}
  observe(target: Element): void {
    this.callback([{ target, contentRect: { width: 900, height: 320 } } as ResizeObserverEntry], this as never);
  }
  unobserve(): void {}
  disconnect(): void {}
}

// O Recharts observa o container; definido no módulo para sobreviver ao unstubAllGlobals.
globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

beforeEach(() => {
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('drill-down analítico', () => {
  it('a janela consulta apenas o intervalo da URL e nunca amostras brutas', async () => {
    const { calls } = stubApi();
    renderAt(`/monitoring/windows/2026-08-30/14?from=${FROM}&to=${TO}`);

    expect(await screen.findByRole('heading', { name: /30\/08\/2026 · 14h/ })).toBeDefined();
    await screen.findAllByText('SIM-HF-002');

    const janela = calls.filter((url) => url.includes('/analytics/time-windows'));
    expect(janela).toHaveLength(1);
    expect(janela[0]).toContain(`from=${encodeURIComponent(FROM)}`);
    expect(janela[0]).toContain(`to=${encodeURIComponent(TO)}`);
    // REGRESSÃO: nenhum nível acima da aquisição pode tocar telemetria bruta.
    expect(calls.filter((url) => url.includes('/samples'))).toHaveLength(0);
    expect(calls.filter((url) => url.includes('/time-series/'))).toHaveLength(0);
  });

  it('o breadcrumb da janela leva de volta à visão geral', async () => {
    stubApi();
    renderAt(`/monitoring/windows/2026-08-30/14?from=${FROM}&to=${TO}`);

    const trilha = await screen.findByRole('navigation', { name: /Trilha da investigação/i });
    expect(within(trilha).getByRole('link', { name: 'Visão geral' }).getAttribute('href')).toBe('/');
  });

  it('a página do sensor usa buckets agregados e propaga a janela nos links', async () => {
    const { calls } = stubApi();
    renderAt(`/sensors/SIM-HF-002?from=${FROM}&to=${TO}&bucket=15m`);

    expect(await screen.findByRole('heading', { name: 'SIM-HF-002' })).toBeDefined();
    // O título nomeia a GRANDEZA: a curva é do eixo Y, e o desvio ao lado é radial Y/Z.
    await screen.findByText(/Tendência — aceleração eixo Y \(RMS por bucket\)/);
    expect(screen.getByText(/Desvio radial \(Y\/Z\)/)).toBeDefined();

    const pontos = calls.filter((url) => url.includes('/analytics/series/'));
    expect(pontos).toHaveLength(1);
    expect(pontos[0]).toContain('bucket=15m');
    expect(calls.filter((url) => url.includes('/samples'))).toHaveLength(0);

    // KPIs vêm do agregado, não de contagem local de amostras.
    expect(screen.getByText('240')).toBeDefined();
    // O breadcrumb leva a janela adiante.
    const trilha = screen.getByRole('navigation', { name: /Trilha da investigação/i });
    expect(within(trilha).getByRole('link', { name: 'P-101' }).getAttribute('href')).toContain(
      `from=${encodeURIComponent(FROM)}`,
    );
  });

  it('as aquisições são paginadas no servidor', async () => {
    const { calls } = stubApi();
    renderAt(`/sensors/SIM-HF-002?from=${FROM}&to=${TO}&bucket=15m`);

    await screen.findByText(/Cada linha é um ciclo de 60 s/);
    const proxima = await screen.findByRole('button', { name: /Ir para a próxima página/i });
    await waitFor(() => expect(proxima).not.toHaveProperty('disabled', true));
    await userEvent.click(proxima);

    await waitFor(() => {
      const paginas = calls.filter((url) => url.includes('/analytics/sensors/'));
      expect(paginas.some((url) => url.includes('page=2'))).toBe(true);
    });
  });

  it('a aquisição resume por série e só oferece o dado bruto por ação explícita', async () => {
    const { calls } = stubApi();
    renderAt(`/acquisitions/${CYCLE}?from=${FROM}&to=${TO}`);

    await screen.findByRole('heading', { name: /Aquisição ·/ });
    expect(screen.getByText(/Resumo por série/)).toBeDefined();
    expect(screen.getByText(/expectedAlert: true/)).toBeDefined();
    // A amostra bruta não é buscada antes do clique.
    expect(calls.filter((url) => url.includes('/samples'))).toHaveLength(0);

    const cta = screen.getByRole('link', { name: /Ver dados brutos/i });
    expect(cta.getAttribute('href')).toContain(`/acquisitions/${CYCLE}/samples`);
    expect(cta.getAttribute('href')).toContain(`from=${encodeURIComponent(FROM)}`);
  });

  it('as amostras brutas paginam por cursor, sem offset', async () => {
    const { calls } = stubApi();
    renderAt(`/acquisitions/${CYCLE}/samples?from=${FROM}&to=${TO}`);

    await screen.findByRole('heading', { name: /Dados brutos/ });
    expect(await screen.findAllByRole('row')).toHaveLength(3); // cabeçalho + 2 amostras

    await userEvent.click(screen.getByRole('button', { name: /Próxima página/i }));

    await waitFor(() => {
      const paginas = calls.filter((url) => url.includes('/samples'));
      expect(paginas.some((url) => url.includes('cursor=cursor-2'))).toBe(true);
    });
    // Keyset, nunca offset profundo.
    expect(calls.every((url) => !url.includes('offset='))).toBe(true);
  });

  it('o ativo agrega os pontos e leva ao ponto escolhido', async () => {
    const { calls } = stubApi();
    renderAt(`/machines/P-101?from=${FROM}&to=${TO}`);

    expect(await screen.findByRole('heading', { level: 1, name: 'P-101' })).toBeDefined();
    // Indicadores do ativo, não da frota.
    expect(screen.getByText(/2 ponto\(s\) monitorado\(s\)/i)).toBeDefined();
    expect(screen.getAllByText('3,49×').length).toBeGreaterThan(0);

    // UMA consulta agregada resolve a página inteira — e nenhuma amostra bruta.
    expect(calls.filter((url) => url.includes('/analytics/machines/'))).toHaveLength(1);
    expect(calls.filter((url) => url.includes('/samples'))).toHaveLength(0);

    const tabela = screen.getByRole('table', { name: /Pontos e sensores/i });
    // O serial é atalho para o sensor; a linha inteira abre o ponto.
    expect(
      within(tabela).getByRole('link', { name: 'SIM-HF-002' }).getAttribute('href'),
    ).toMatch(/^\/sensors\/SIM-HF-002\?from=/);

    // O ponto é um link, não uma linha com onClick: alcançável também pelo teclado.
    await userEvent.click(
      within(tabela).getByRole('link', { name: 'Mancal lado oposto ao acoplamento' }),
    );
    expect(
      await screen.findByRole('heading', { level: 1, name: /Mancal lado oposto ao acoplamento/i }),
    ).toBeDefined();
  });

  it('o ponto é contexto e entrega o próximo nível, preservando o recorte', async () => {
    const { calls } = stubApi();
    renderAt(`/machines/P-101/points/mancal-lado-oposto-ao-acoplamento?from=${FROM}&to=${TO}`);

    expect(
      await screen.findByRole('heading', { level: 1, name: /Mancal lado oposto ao acoplamento/i }),
    ).toBeDefined();
    // A janela consultada é a da URL, não um padrão do componente.
    const consulta = calls.find((url) => url.includes('/analytics/machines/'))!;
    expect(consulta).toContain(`from=${encodeURIComponent(FROM)}`);
    expect(consulta).toContain(`to=${encodeURIComponent(TO)}`);

    // Subir um nível mantém o recorte.
    const trilha = screen.getByRole('navigation', { name: /Trilha da investigação/i });
    expect(within(trilha).getByRole('link', { name: 'P-101' }).getAttribute('href')).toMatch(
      /^\/machines\/P-101\?from=.+&to=/,
    );
    // Descer também: o ponto entrega o sensor, que é onde mora a história completa.
    expect(screen.getByRole('link', { name: /Abrir sensor/i }).getAttribute('href')).toMatch(
      /^\/sensors\/SIM-HF-002\?from=/,
    );
    // Contexto, não duplicata da página do sensor: as séries aparecem como inventário.
    expect(screen.getByRole('table', { name: /Séries do ponto/i })).toBeDefined();
  });

  it('a trilha do sensor reconstrói ativo e ponto', async () => {
    stubApi();
    renderAt(`/sensors/SIM-HF-002?from=${FROM}&to=${TO}&bucket=15m`);

    const trilha = await screen.findByRole('navigation', { name: /Trilha da investigação/i });
    await waitFor(() =>
      expect(within(trilha).getByRole('link', { name: 'P-101' }).getAttribute('href')).toMatch(
        /^\/machines\/P-101\?from=/,
      ),
    );
    expect(
      within(trilha)
        .getByRole('link', { name: /Mancal lado oposto ao acoplamento/i })
        .getAttribute('href'),
    ).toMatch(/^\/machines\/P-101\/points\/mancal-lado-oposto-ao-acoplamento\?from=/);
  });

  it('identificador inexistente vira "não encontrado", nunca redirecionamento silencioso', async () => {
    stubApi();
    renderAt(`/machines/desconhecido?from=${FROM}&to=${TO}`);

    expect(await screen.findByText(/Máquina não encontrada/i)).toBeDefined();
    expect(screen.getByText(/Nenhuma máquina cadastrada corresponde a "desconhecido"/i)).toBeDefined();
  });

  it('todo salto do drill-down é um link — o caminho existe no teclado', async () => {
    stubApi();
    renderAt(`/monitoring/windows/2026-08-30/14?from=${FROM}&to=${TO}`);

    const tabela = await screen.findByRole('table', { name: /Sensores da janela/i });
    const linha = within(tabela).getAllByRole('row')[1];
    // Máquina, ponto e sensor: três destinos, três links — nenhuma linha com onClick,
    // que o teclado não alcança.
    expect(within(linha).getByRole('link', { name: 'P-101' })).toBeDefined();
    expect(
      within(linha).getByRole('link', { name: /Mancal lado oposto ao acoplamento/i }),
    ).toBeDefined();
    const sensor = within(linha).getByRole('link', { name: 'SIM-HF-002' });
    expect(sensor.getAttribute('href')).toMatch(/^\/sensors\/SIM-HF-002\?from=.+&bucket=15m/);

    // Foco e Enter percorrem o mesmo caminho do clique.
    sensor.focus();
    expect(document.activeElement).toBe(sensor);
    await userEvent.keyboard('{Enter}');
    expect(await screen.findByRole('heading', { level: 1, name: 'SIM-HF-002' })).toBeDefined();
  });

  it('a aquisição é alcançável por link a partir da lista do sensor', async () => {
    stubApi();
    renderAt(`/sensors/SIM-HF-002?from=${FROM}&to=${TO}&bucket=15m`);

    const tabela = await screen.findByRole('table', { name: /Aquisições do sensor/i });
    const link = within(tabela).getAllByRole('link')[0];
    expect(link.getAttribute('href')).toMatch(new RegExp(`^/acquisitions/${CYCLE}\\?from=`));
    await userEvent.click(link);
    expect(await screen.findByRole('heading', { level: 1, name: /Aquisição ·/i })).toBeDefined();
  });

  it('mostra estado vazio quando a janela não tem aquisição', async () => {
    stubApi({
      timeWindow: {
        from: FROM,
        to: TO,
        kpis: { reportingSensors: 0, silentSensors: 2, expectedSensors: 2, acquisitionCount: 0, sampleCount: 0, maxValue: null, maxValueSensor: null },
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
        totalPages: 0,
      },
    });
    renderAt(`/monitoring/windows/2026-08-30/03?from=${FROM}&to=${TO}`);

    expect(await screen.findByText(/Nenhuma aquisição nesta janela/i)).toBeDefined();
  });

  it('reporta erro da consulta sem derrubar a página', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ message: 'Janela inválida' }), { status: 400 })),
    );
    renderAt(`/monitoring/windows/2026-08-30/14?from=${FROM}&to=${TO}`);

    expect(await screen.findByText(/Janela inválida/i)).toBeDefined();
    expect(screen.getByRole('heading', { name: /30\/08\/2026 · 14h/ })).toBeDefined();
  });
});

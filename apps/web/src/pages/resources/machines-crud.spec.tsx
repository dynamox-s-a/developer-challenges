import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../test/renderWithProviders';
import { MachineFormPage } from './MachineFormPage';
import { MachinePage } from './MachinePage';
import { MachinesListPage } from './MachinesListPage';
import { MonitoringPointPage } from './MonitoringPointPage';
import { PointFormPage } from './PointFormPage';

const FROM = '2026-08-24T00:00:00.000Z';
const TO = '2026-08-31T00:00:00.000Z';
const RANGE = `from=${FROM}&to=${TO}`;

const MACHINES = [
  { id: 'm1', name: 'P-101', type: 'Pump', createdAt: FROM, updatedAt: FROM },
  { id: 'm2', name: 'VE-201 — Ventilador de tiragem', type: 'Fan', createdAt: FROM, updatedAt: FROM },
];

const POINTS = [
  {
    id: 'p1',
    name: 'Mancal lado acoplamento',
    machine: { id: 'm1', name: 'P-101', type: 'Pump' },
    sensor: { id: 's1', serialNumber: 'SIM-HF-001', model: 'HF+' },
    createdAt: FROM,
    updatedAt: FROM,
  },
  {
    id: 'p2',
    name: 'Carcaça',
    machine: { id: 'm1', name: 'P-101', type: 'Pump' },
    sensor: null,
    createdAt: FROM,
    updatedAt: FROM,
  },
];

const CONDITION = {
  from: FROM,
  to: TO,
  generatedAt: TO,
  points: [
    {
      machineName: 'P-101',
      machineType: 'Pump',
      monitoringPointId: 'p1',
      monitoringPointName: 'Mancal lado acoplamento',
      sensorSerialNumber: 'SIM-HF-001',
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
};

const MACHINE_SUMMARY = {
  machineId: 'm1',
  machineName: 'P-101',
  machineType: 'Pump',
  slug: 'P-101',
  from: FROM,
  to: TO,
  kpis: {
    points: 2,
    sensors: 1,
    attention: 1,
    acquisitionCount: 8,
    coveragePercent: 50,
    maxDeviationRatio: 3.49,
    maxDeviationPoint: 'Mancal lado acoplamento',
  },
  lastAt: '2026-08-30T23:00:59.000Z',
  points: [
    {
      monitoringPointId: 'p1',
      monitoringPointName: 'Mancal lado acoplamento',
      slug: 'mancal-lado-acoplamento',
      sensorSerialNumber: 'SIM-HF-001',
      sensorModel: 'HF+',
      condition: 'attention',
      freshness: 'current',
      currentValue: 0.0572,
      baselineValue: 0.0164,
      deviationRatio: 3.49,
      lastAt: '2026-08-30T23:00:59.000Z',
      acquisitionCount: 4,
      sampleCount: 240,
      min: 0.02,
      max: 0.06,
      avg: 0.03,
      unit: 'g',
      trend: [
        { timestamp: '2026-08-30T20:00:00.000Z', value: 0.02 },
        { timestamp: '2026-08-30T22:00:00.000Z', value: 0.057 },
      ],
    },
  ],
};

const POINT_SUMMARY_SEM_SENSOR = {
  machineId: 'm1',
  machineName: 'P-101',
  machineType: 'Pump',
  machineSlug: 'P-101',
  monitoringPointId: 'p2',
  monitoringPointName: 'Carcaça',
  slug: 'carcaca',
  from: FROM,
  to: TO,
  sensorSerialNumber: null,
  sensorModel: null,
  condition: 'no-sensor',
  freshness: 'unknown',
  currentValue: null,
  baselineValue: null,
  deviationRatio: null,
  currentAt: null,
  baselineAt: null,
  currentCycleId: null,
  baselineCycleId: null,
  unit: 'g',
  window: {
    acquisitionCount: 0,
    sampleCount: 0,
    min: null,
    max: null,
    avg: null,
    lastValue: null,
    lastAt: null,
  },
  trend: [],
  series: [],
};

/** Listagem como a camada analítica devolve: já recortada, contada e ordenada. */
function machineListPayload(url: string) {
  const query = new URL(url, 'http://x').searchParams;
  const todas = [
    {
      machineId: 'm1',
      machineName: 'P-101',
      machineType: 'Pump',
      slug: 'P-101',
      pointCount: 2,
      sensorCount: 1,
      attentionCount: 1,
      condition: 'attention',
      lastAt: '2026-08-30T23:00:59.000Z',
      maxDeviationRatio: 3.49,
      maxDeviationPoint: 'Mancal lado acoplamento',
    },
    {
      machineId: 'm2',
      machineName: 'VE-201 — Ventilador de tiragem',
      machineType: 'Fan',
      slug: 'VE-201',
      pointCount: 2,
      sensorCount: 2,
      attentionCount: 0,
      condition: 'normal',
      lastAt: '2026-08-30T22:00:59.000Z',
      maxDeviationRatio: 1,
      maxDeviationPoint: 'Mancal lado acoplamento',
    },
  ];
  const condition = query.get('condition');
  const items = condition ? todas.filter((item) => item.condition === condition) : todas;
  return {
    from: FROM,
    to: TO,
    items,
    total: items.length,
    page: Number(query.get('page') ?? '1'),
    pageSize: Number(query.get('pageSize') ?? '25'),
    totalPages: 1,
    counts: { total: 2, attention: 1, observation: 0, normal: 1, unclassified: 0, noData: 0, noSensor: 0 },
    condition,
    search: query.get('search'),
    sortBy: query.get('sortBy') ?? 'name',
    sortDir: query.get('sortDir') ?? 'asc',
  };
}

function okJson(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), { status });
}

interface StubOptions {
  criarFalha?: string;
}

function stubApi(options: StubOptions = {}) {
  const calls: Array<{ method: string; url: string; body: unknown }> = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    calls.push({ method, url, body: init?.body ? JSON.parse(String(init.body)) : null });

    if (method === 'POST' && url.includes('/monitoring-points/') && url.includes('/sensor')) {
      return okJson({ ...POINTS[1], sensor: { id: 's9', serialNumber: 'SIM-HF-009', model: 'HF+' } });
    }
    if (method === 'POST' && url.endsWith('/monitoring-points')) {
      return okJson({ ...POINTS[1], id: 'p9', name: 'Mancal externo' });
    }
    if (method === 'POST' && url.endsWith('/machines')) {
      return options.criarFalha
        ? okJson({ code: 'MACHINE_NAME_CONFLICT', message: options.criarFalha }, 409)
        : okJson({ id: 'm9', name: 'P-900', type: 'Pump', createdAt: FROM, updatedAt: FROM });
    }
    if (method === 'PATCH' && url.includes('/machines/')) {
      return okJson({ ...MACHINES[0], name: 'P-101 — Bomba principal' });
    }
    if (method === 'DELETE' && url.includes('/machines/')) return new Response(null, { status: 204 });

    if (url.includes('/analytics/machines/') && url.includes('/points/')) {
      return okJson(POINT_SUMMARY_SEM_SENSOR);
    }
    if (url.includes('/analytics/machines/')) return okJson(MACHINE_SUMMARY);
    if (url.includes('/analytics/machines')) return okJson(machineListPayload(url));
    if (url.includes('/analytics/fleet-condition')) return okJson(CONDITION);
    if (url.includes('/monitoring-points')) {
      return okJson({
        items: POINTS,
        total: POINTS.length,
        page: 1,
        pageSize: 50,
        totalPages: 1,
        sortBy: 'machineName',
        sortDir: 'asc',
        search: null,
        machineType: null,
        sensorModel: null,
        hasSensor: null,
      });
    }
    if (url.endsWith('/machines')) return okJson(MACHINES);

    return okJson({ message: `Rota não simulada: ${url}` }, 404);
  });
  vi.stubGlobal('fetch', fetchMock);
  return { calls };
}

/** Sonda de rota: o MemoryRouter não mexe em window.location. */
function RouteProbe(): JSX.Element {
  const location = useLocation();
  return <div data-testid="rota">{`${location.pathname}${location.search}`}</div>;
}

function renderAt(route: string, role: 'ADMIN' | 'VIEWER' = 'ADMIN') {
  return renderWithProviders(
    <>
      <Routes>
        <Route path="/machines" element={<MachinesListPage />} />
        <Route path="/machines/new" element={<MachineFormPage mode="create" />} />
        <Route path="/machines/:machineKey" element={<MachinePage />} />
        <Route path="/machines/:machineKey/edit" element={<MachineFormPage mode="edit" />} />
        <Route path="/machines/:machineKey/points/new" element={<PointFormPage />} />
        <Route path="/machines/:machineKey/points/:pointKey" element={<MonitoringPointPage />} />
      </Routes>
      <RouteProbe />
    </>,
    { route, role },
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
globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

beforeEach(() => {
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('gestão de máquinas', () => {
  it('lista as máquinas com inventário e condição, e o nome abre o recurso', async () => {
    stubApi();
    renderAt(`/machines?${RANGE}`);

    const tabela = await screen.findByRole('table', { name: /Máquinas cadastradas/i });
    const linhas = within(tabela).getAllByRole('row').slice(1);
    expect(linhas).toHaveLength(2);
    // A linha responde "essa precisa de mim?": condição, quantos pontos e o maior desvio.
    expect(within(linhas[0]).getByText('Atenção')).toBeDefined();
    expect(within(linhas[0]).getByText('3,49×')).toBeDefined();

    await userEvent.click(within(linhas[0]).getByRole('link', { name: 'P-101' }));
    await waitFor(() =>
      expect(screen.getByTestId('rota').textContent).toMatch(/^\/machines\/P-101\?from=/),
    );
  });

  it('o filtro de condição vai para a URL e para a consulta, com as contagens do servidor', async () => {
    const { calls } = stubApi();
    renderAt(`/machines?${RANGE}`);
    await screen.findByRole('table', { name: /Máquinas cadastradas/i });

    // O seletor só oferece estados que existem na janela, com a contagem de cada um.
    const filtro = screen.getByRole('group', { name: /Filtrar máquinas por condição/i });
    expect(within(filtro).getByRole('button', { name: /^Todos — 2$/ })).toBeDefined();
    expect(within(filtro).getByRole('button', { name: /^Atenção — 1$/ })).toBeDefined();
    expect(within(filtro).queryByRole('button', { name: /Sem sensor/i })).toBeNull();

    await userEvent.click(within(filtro).getByRole('button', { name: /^Atenção — 1$/ }));

    // O recorte é do SERVIDOR: vira parâmetro de consulta, não filter() no navegador.
    await waitFor(() =>
      expect(calls.some((call) => call.url.includes('condition=attention'))).toBe(true),
    );
    expect(screen.getByTestId('rota').textContent).toContain('condition=attention');
    await waitFor(() => {
      const tabela = screen.getByRole('table', { name: /Máquinas cadastradas/i });
      expect(within(tabela).getAllByRole('row').slice(1)).toHaveLength(1);
    });
    // A contagem continua descrevendo o universo inteiro, não o recorte.
    expect(within(filtro).getByRole('button', { name: /^Todos — 2$/ })).toBeDefined();
  });

  it('recorte vazio explica o filtro e oferece limpá-lo', async () => {
    stubApi();
    renderAt(`/machines?${RANGE}&condition=observation`);

    expect(await screen.findByText(/Nenhuma máquina neste recorte/i)).toBeDefined();
    await userEvent.click(screen.getByRole('button', { name: /Limpar filtros/i }));
    await waitFor(() => expect(screen.getByTestId('rota').textContent).not.toContain('condition='));
  });

  it('busca e ordenação também são resolvidas no servidor', async () => {
    const { calls } = stubApi();
    renderAt(`/machines?${RANGE}`);
    await screen.findByRole('table', { name: /Máquinas cadastradas/i });

    await userEvent.type(screen.getByRole('textbox', { name: /Buscar máquina/i }), 'VE');
    await waitFor(() => expect(calls.some((call) => call.url.includes('search=VE'))).toBe(true), {
      timeout: 2000,
    });

    await userEvent.click(screen.getByRole('button', { name: /Maior desvio/i }));
    await waitFor(() =>
      expect(calls.some((call) => call.url.includes('sortBy=deviation'))).toBe(true),
    );
    expect(screen.getByTestId('rota').textContent).toContain('sortBy=deviation');
  });

  it('perfil somente leitura não recebe ações de mutação', async () => {
    stubApi();
    renderAt(`/machines?${RANGE}`, 'VIEWER');

    await screen.findByRole('table', { name: /Máquinas cadastradas/i });
    expect(screen.queryByRole('link', { name: /Nova máquina/i })).toBeNull();
    expect(screen.getByText(/somente leitura/i)).toBeDefined();

    await userEvent.click(screen.getByRole('button', { name: /Ações de P-101/i }));
    const menu = await screen.findByRole('menu');
    // Consultar continua liberado; alterar, não.
    expect(within(menu).getByRole('menuitem', { name: /Abrir máquina/i }).getAttribute('aria-disabled')).toBeNull();
    expect(within(menu).getByRole('menuitem', { name: /Editar/i }).getAttribute('aria-disabled')).toBe('true');
    expect(within(menu).getByRole('menuitem', { name: /Excluir/i }).getAttribute('aria-disabled')).toBe('true');
  });

  it('criar envia o cadastro e leva ao detalhe da máquina nova', async () => {
    const { calls } = stubApi();
    renderAt('/machines/new');

    await userEvent.type(screen.getByLabelText('Nome'), 'P-900');
    await userEvent.click(screen.getByRole('button', { name: /Criar máquina/i }));

    const criacao = calls.find((call) => call.method === 'POST');
    expect(criacao?.body).toEqual({ name: 'P-900', type: 'Pump' });
    await waitFor(() => expect(screen.getByTestId('rota').textContent).toBe('/machines/P-900'));
  });

  it('erro da API preserva o que foi digitado e não navega', async () => {
    stubApi({ criarFalha: 'Já existe uma máquina com o nome "P-101".' });
    renderAt('/machines/new');

    await userEvent.type(screen.getByLabelText('Nome'), 'P-101');
    await userEvent.click(screen.getByRole('button', { name: /Criar máquina/i }));

    expect(await screen.findByText(/Já existe uma máquina com o nome/i)).toBeDefined();
    expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('P-101');
    expect(screen.getByTestId('rota').textContent).toBe('/machines/new');
  });

  it('o formulário exige nome antes de chamar a API', async () => {
    const { calls } = stubApi();
    renderAt('/machines/new');

    await userEvent.click(screen.getByRole('button', { name: /Criar máquina/i }));
    expect(await screen.findByText(/Informe o nome da máquina/i)).toBeDefined();
    expect(calls.filter((call) => call.method === 'POST')).toHaveLength(0);
  });

  it('editar abre pré-preenchido pela URL e salva com PATCH', async () => {
    const { calls } = stubApi();
    renderAt('/machines/P-101/edit');

    // Refresh direto na rota funciona: o estado vem da API, não de um clique anterior.
    await waitFor(() =>
      expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('P-101'),
    );

    await userEvent.clear(screen.getByLabelText('Nome'));
    await userEvent.type(screen.getByLabelText('Nome'), 'P-101 — Bomba principal');
    await userEvent.click(screen.getByRole('button', { name: /Salvar alterações/i }));

    const patch = calls.find((call) => call.method === 'PATCH');
    expect(patch?.url).toContain('/machines/m1');
    expect(patch?.body).toEqual({ name: 'P-101 — Bomba principal', type: 'Pump' });
    await waitFor(() => expect(screen.getByTestId('rota').textContent).toBe('/machines/P-101'));
  });

  it('cancelar a edição não envia nada e volta ao detalhe', async () => {
    const { calls } = stubApi();
    renderAt('/machines/P-101/edit');

    await waitFor(() =>
      expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('P-101'),
    );
    await userEvent.clear(screen.getByLabelText('Nome'));
    await userEvent.type(screen.getByLabelText('Nome'), 'descartado');
    await userEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

    expect(calls.filter((call) => call.method === 'PATCH')).toHaveLength(0);
    expect(screen.getByTestId('rota').textContent).toBe('/machines/P-101');
  });

  it('excluir confirma dizendo o que desaparece antes de chamar a API', async () => {
    const { calls } = stubApi();
    renderAt(`/machines?${RANGE}`);

    await screen.findByRole('table', { name: /Máquinas cadastradas/i });
    await userEvent.click(screen.getByRole('button', { name: /Ações de P-101/i }));
    await userEvent.click(await screen.findByRole('menuitem', { name: /Excluir/i }));

    const dialogo = await screen.findByRole('dialog');
    // A cascata é regra do backend; a tela a torna visível ANTES do clique.
    expect(within(dialogo).getByText(/2 ponto\(s\) de monitoramento/i)).toBeDefined();
    expect(within(dialogo).getByText(/desassociados, não\s+apagados/i)).toBeDefined();
    // Abrir a confirmação não exclui nada.
    expect(calls.filter((call) => call.method === 'DELETE')).toHaveLength(0);

    await userEvent.click(within(dialogo).getByRole('button', { name: /Excluir máquina/i }));
    await waitFor(() => expect(calls.filter((call) => call.method === 'DELETE')).toHaveLength(1));
    expect(calls.find((call) => call.method === 'DELETE')?.url).toContain('/machines/m1');
  });

  it('cria o ponto dentro da máquina e segue para a página dele', async () => {
    const { calls } = stubApi();
    renderAt('/machines/P-101/points/new');

    await waitFor(() => expect(screen.getByLabelText('Nome do ponto')).toBeDefined());
    await userEvent.type(screen.getByLabelText('Nome do ponto'), 'Mancal externo');
    await userEvent.click(screen.getByRole('button', { name: /Criar ponto/i }));

    const post = calls.find((call) => call.method === 'POST');
    // A máquina vem da rota: o formulário não repete o que a URL já afirma.
    expect(post?.body).toEqual({ machineId: 'm1', name: 'Mancal externo' });
    await waitFor(() =>
      expect(screen.getByTestId('rota').textContent).toMatch(
        /^\/machines\/P-101\/points\/mancal-externo\?from=/,
      ),
    );
  });

  it('ponto sem sensor oferece a associação, com os modelos que a máquina aceita', async () => {
    const { calls } = stubApi();
    renderAt(`/machines/P-101/points/carcaca?${RANGE}`);

    await userEvent.click(await screen.findByRole('button', { name: /Associar sensor/i }));
    const dialogo = await screen.findByRole('dialog');
    // P-101 é bomba: TcAg e TcAs não podem ser oferecidos.
    await userEvent.click(within(dialogo).getByLabelText('Modelo'));
    const opcoes = await screen.findAllByRole('option');
    expect(opcoes.map((option) => option.textContent)).toEqual(['HF+']);
    await userEvent.keyboard('{Escape}');

    await userEvent.type(within(dialogo).getByLabelText('Número de série'), 'SIM-HF-009');
    await userEvent.click(within(dialogo).getByRole('button', { name: /Associar sensor/i }));

    await waitFor(() => {
      const post = calls.find((call) => call.method === 'POST' && call.url.includes('/sensor'));
      expect(post?.url).toContain('/monitoring-points/p2/sensor');
      expect(post?.body).toEqual({ serialNumber: 'SIM-HF-009', model: 'HF+' });
    });
  });
});

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MonitoringPointsPanel } from './MonitoringPointsPanel';
import { setToken } from '../api/client';
import { renderWithProviders } from '../test/renderWithProviders';

const MACHINES = [
  {
    id: 'm-pump',
    name: 'P-101',
    type: 'Pump',
    createdAt: '2026-08-28T12:00:00.000Z',
    updatedAt: '2026-08-28T12:00:00.000Z',
  },
  {
    id: 'm-fan',
    name: 'V-200',
    type: 'Fan',
    createdAt: '2026-08-28T12:00:00.000Z',
    updatedAt: '2026-08-28T12:00:00.000Z',
  },
];

const POINT_PUMP = {
  id: 'p1',
  name: 'Mancal LA',
  machine: { id: 'm-pump', name: 'P-101', type: 'Pump' },
  sensor: null,
  createdAt: '2026-08-28T12:00:00.000Z',
  updatedAt: '2026-08-28T12:00:00.000Z',
};

const POINT_WITH_SENSOR = {
  ...POINT_PUMP,
  id: 'p2',
  name: 'Mancal LOA',
  sensor: { id: 's1', serialNumber: 'SIM-HF-001', model: 'HF+' },
};

function pageDto(items: unknown[], total = items.length) {
  return {
    items,
    total,
    page: 1,
    pageSize: 5,
    totalPages: Math.ceil(total / 5),
    sortBy: 'machineName',
    sortDir: 'asc',
    search: null,
    machineType: null,
    sensorModel: null,
    hasSensor: null,
  };
}

/**
 * Mock de fetch roteado por URL/método: o painel fala com /machines (select do
 * formulário) e com /monitoring-points (listagem, criação e associação).
 */
function stubApi(options: {
  points?: unknown;
  onListPoints?: (url: string) => unknown;
  createResponse?: Response;
  assignResponse?: Response;
}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/machines')) {
      return new Response(JSON.stringify(MACHINES), { status: 200 });
    }
    if (url.includes('/sensor') && init?.method === 'POST') {
      return options.assignResponse ?? new Response(JSON.stringify(POINT_WITH_SENSOR), {
        status: 201,
      });
    }
    if (init?.method === 'POST') {
      return options.createResponse ?? new Response(JSON.stringify(POINT_PUMP), {
        status: 201,
      });
    }
    const body = options.onListPoints ? options.onListPoints(url) : options.points ?? pageDto([]);
    return new Response(JSON.stringify(body), { status: 200 });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderPanel() {
  // A listagem agora leva às páginas canônicas de máquina, ponto e sensor: precisa de rota.
  return renderWithProviders(<MonitoringPointsPanel />, { route: '/monitoring-points' });
}

afterEach(() => {
  vi.unstubAllGlobals();
  setToken(null);
});

describe('MonitoringPointsPanel', () => {
  it('1. mostra o estado vazio quando não há pontos', async () => {
    stubApi({ points: pageDto([]) });

    renderPanel();

    expect(await screen.findByText(/Nenhum ponto de monitoramento/i)).toBeDefined();
  });

  it('2. renderiza as colunas exigidas pelo desafio', async () => {
    stubApi({ points: pageDto([POINT_PUMP, POINT_WITH_SENSOR]) });

    renderPanel();

    const table = await screen.findByRole('table', {
      name: /Pontos de monitoramento cadastrados/i,
    });
    // Colunas: máquina, tipo, ponto, modelo do sensor.
    expect(within(table).getAllByText('P-101').length).toBeGreaterThan(0);
    expect(within(table).getAllByText('Pump').length).toBeGreaterThan(0);
    expect(within(table).getByText('Mancal LA')).toBeDefined();
    // Modelo e serial na mesma célula; o serial é o atalho para a página do sensor.
    expect(within(table).getByText(/HF\+/)).toBeDefined();
    expect(within(table).getByRole('link', { name: 'SIM-HF-001' }).getAttribute('href')).toMatch(
      /^\/sensors\/SIM-HF-001\?from=/,
    );
    // Ponto sem sensor mostra o traço.
    expect(within(table).getByText('—')).toBeDefined();
  });

  it('3. não envia a criação sem máquina selecionada', async () => {
    const fetchMock = stubApi({ points: pageDto([]) });

    renderPanel();
    await screen.findByText(/Nenhum ponto de monitoramento/i);
    const callsBefore = fetchMock.mock.calls.length;

    await userEvent.type(
      screen.getByRole('textbox', { name: /Nome do ponto/i }),
      'Mancal novo',
    );
    await userEvent.click(screen.getByRole('button', { name: /Criar ponto/i }));

    expect(await screen.findByText(/Selecione a máquina/i)).toBeDefined();
    expect(fetchMock.mock.calls).toHaveLength(callsBefore);
  });

  it('4. criação bem-sucedida limpa o nome e recarrega a lista', async () => {
    let listCalls = 0;
    stubApi({
      onListPoints: () => {
        listCalls += 1;
        return listCalls === 1 ? pageDto([]) : pageDto([POINT_PUMP]);
      },
    });

    renderPanel();
    await screen.findByText(/Nenhum ponto de monitoramento/i);

    await userEvent.click(screen.getByLabelText('Máquina'));
    await userEvent.click(await screen.findByRole('option', { name: /P-101/i }));
    const nameField = screen.getByRole('textbox', { name: /Nome do ponto/i });
    await userEvent.type(nameField, 'Mancal LA');
    await userEvent.click(screen.getByRole('button', { name: /Criar ponto/i }));

    const table = await screen.findByRole('table', {
      name: /Pontos de monitoramento cadastrados/i,
    });
    expect(within(table).getByText('Mancal LA')).toBeDefined();
    await waitFor(() => expect((nameField as HTMLInputElement).value).toBe(''));
  });

  it('5. erro da API na criação fica visível e preserva o formulário', async () => {
    stubApi({
      points: pageDto([POINT_PUMP]),
      createResponse: new Response(
        JSON.stringify({
          code: 'MONITORING_POINT_NAME_CONFLICT',
          message: 'A máquina "P-101" já tem um ponto chamado "Mancal LA".',
        }),
        { status: 409 },
      ),
    });

    renderPanel();
    await screen.findByRole('table', { name: /Pontos de monitoramento cadastrados/i });

    await userEvent.click(screen.getByLabelText('Máquina'));
    await userEvent.click(await screen.findByRole('option', { name: /P-101/i }));
    const nameField = screen.getByRole('textbox', { name: /Nome do ponto/i });
    await userEvent.type(nameField, 'Mancal LA');
    await userEvent.click(screen.getByRole('button', { name: /Criar ponto/i }));

    expect(await screen.findByText(/já tem um ponto chamado/i)).toBeDefined();
    expect((nameField as HTMLInputElement).value).toBe('Mancal LA');
  });

  it('6. clicar no cabeçalho reordena via API', async () => {
    const fetchMock = stubApi({ points: pageDto([POINT_PUMP]) });

    renderPanel();
    await screen.findByRole('table', { name: /Pontos de monitoramento cadastrados/i });

    // machineName asc é o padrão; clicar na coluna ativa inverte para desc.
    await userEvent.click(screen.getByRole('button', { name: /^Máquina$/i }));

    await waitFor(() => {
      const urls = fetchMock.mock.calls.map((call) => String(call[0]));
      expect(
        urls.some((url) => url.includes('sortBy=machineName') && url.includes('sortDir=desc')),
      ).toBe(true);
    });
  });

  it('7. pagina de 5 em 5 e navega para a próxima página', async () => {
    const manyPoints = Array.from({ length: 5 }, (_, index) => ({
      ...POINT_PUMP,
      id: `p-${index}`,
      name: `Ponto ${index}`,
    }));
    const fetchMock = stubApi({ points: pageDto(manyPoints, 7) });

    renderPanel();
    await screen.findByRole('table', { name: /Pontos de monitoramento cadastrados/i });

    expect(screen.getByText('1–5 de 7')).toBeDefined();

    await userEvent.click(screen.getByRole('button', { name: /Ir para a próxima página/i }));
    await waitFor(() => {
      const urls = fetchMock.mock.calls.map((call) => String(call[0]));
      expect(urls.some((url) => url.includes('page=2'))).toBe(true);
    });
  });

  it('8. associar sensor: modelos proibidos ficam desabilitados para Pump', async () => {
    stubApi({ points: pageDto([POINT_PUMP]) });

    renderPanel();
    await screen.findByRole('table', { name: /Pontos de monitoramento cadastrados/i });

    await userEvent.click(screen.getByRole('button', { name: /Associar sensor/i }));
    expect(await screen.findByText(/Associar sensor ao ponto/i)).toBeDefined();

    await userEvent.click(screen.getByLabelText('Modelo'));
    const options = await screen.findAllByRole('option');
    const byName = Object.fromEntries(options.map((o) => [o.textContent, o]));
    // A máquina do ponto é Pump: TcAg e TcAs não podem ser escolhidos.
    expect(byName.TcAg?.getAttribute('aria-disabled')).toBe('true');
    expect(byName.TcAs?.getAttribute('aria-disabled')).toBe('true');
    expect(byName['HF+']?.getAttribute('aria-disabled')).not.toBe('true');
  });

  it('9. associação bem-sucedida envia o POST correto e fecha o formulário', async () => {
    let listCalls = 0;
    const fetchMock = stubApi({
      onListPoints: () => {
        listCalls += 1;
        return listCalls === 1 ? pageDto([POINT_PUMP]) : pageDto([POINT_WITH_SENSOR]);
      },
    });

    renderPanel();
    await screen.findByRole('table', { name: /Pontos de monitoramento cadastrados/i });

    await userEvent.click(screen.getByRole('button', { name: /Associar sensor/i }));
    await userEvent.type(
      await screen.findByRole('textbox', { name: /Identificador do sensor/i }),
      'SIM-HF-001',
    );
    await userEvent.click(screen.getByRole('button', { name: /^Associar$/i }));

    await waitFor(() => {
      const post = fetchMock.mock.calls.find(
        (call) => String(call[0]).includes('/p1/sensor') && call[1]?.method === 'POST',
      );
      expect(post).toBeDefined();
      expect(JSON.parse(String(post?.[1]?.body))).toEqual({
        serialNumber: 'SIM-HF-001',
        model: 'HF+',
      });
    });
    // Formulário fecha e a linha passa a exibir o sensor.
    await waitFor(() =>
      expect(screen.queryByText(/Associar sensor ao ponto/i)).toBeNull(),
    );
    expect(screen.getByRole('link', { name: 'SIM-HF-001' })).toBeDefined();
  });

  it('10. erro 409 da associação chega ao usuário sem virar erro genérico', async () => {
    stubApi({
      points: pageDto([POINT_PUMP]),
      assignResponse: new Response(
        JSON.stringify({
          code: 'SENSOR_SERIAL_CONFLICT',
          message: 'Já existe um sensor com o identificador "SIM-HF-001".',
        }),
        { status: 409 },
      ),
    });

    renderPanel();
    await screen.findByRole('table', { name: /Pontos de monitoramento cadastrados/i });

    await userEvent.click(screen.getByRole('button', { name: /Associar sensor/i }));
    await userEvent.type(
      await screen.findByRole('textbox', { name: /Identificador do sensor/i }),
      'SIM-HF-001',
    );
    await userEvent.click(screen.getByRole('button', { name: /^Associar$/i }));

    expect(
      await screen.findByText(/Já existe um sensor com o identificador/i),
    ).toBeDefined();
  });
});

describe('MonitoringPointsPanel — recorte no servidor e perfil', () => {
  it('busca digitada vira parâmetro de consulta e volta para a primeira página', async () => {
    const urls: string[] = [];
    stubApi({
      onListPoints: (url) => {
        urls.push(url);
        return pageDto([POINT_PUMP], 1);
      },
    });
    renderPanel();
    await screen.findByRole('table');

    await userEvent.type(screen.getByLabelText(/Buscar pontos/i), 'P-101');

    // O termo é enviado ao servidor (a filtragem não acontece na página já carregada).
    await waitFor(() => {
      expect(urls.some((url) => url.includes('search=P-101'))).toBe(true);
    });
    expect(urls.at(-1)).toContain('page=1');
  });

  it('filtros de tipo, modelo e presença de sensor viajam codificados', async () => {
    const urls: string[] = [];
    stubApi({
      onListPoints: (url) => {
        urls.push(url);
        return pageDto([POINT_PUMP], 1);
      },
    });
    renderPanel();
    await screen.findByRole('table');

    await userEvent.click(screen.getByLabelText('Tipo da máquina'));
    await userEvent.click(await screen.findByRole('option', { name: 'Pump' }));
    await waitFor(() => expect(urls.some((url) => url.includes('machineType=Pump'))).toBe(true));

    await userEvent.click(screen.getByLabelText('Modelo do sensor'));
    await userEvent.click(await screen.findByRole('option', { name: 'HF+' }));
    // "HF+" precisa ir codificado: '+' cru numa query string significa espaço.
    await waitFor(() => expect(urls.some((url) => url.includes('sensorModel=HF%2B'))).toBe(true));

    await userEvent.click(screen.getByLabelText('Sensor'));
    await userEvent.click(await screen.findByRole('option', { name: 'Sem sensor' }));
    await waitFor(() => expect(urls.some((url) => url.includes('hasSensor=false'))).toBe(true));
  });

  it('limpar remove todo o recorte da consulta', async () => {
    const urls: string[] = [];
    stubApi({
      onListPoints: (url) => {
        urls.push(url);
        return pageDto([POINT_PUMP], 1);
      },
    });
    renderPanel();
    await screen.findByRole('table');

    await userEvent.click(screen.getByLabelText('Tipo da máquina'));
    await userEvent.click(await screen.findByRole('option', { name: 'Fan' }));
    await waitFor(() => expect(urls.some((url) => url.includes('machineType=Fan'))).toBe(true));

    await userEvent.click(screen.getByRole('button', { name: /Limpar/i }));
    await waitFor(() => expect(urls.at(-1)).not.toContain('machineType'));
  });

  it('VIEWER consulta e filtra, mas não recebe ações de escrita', async () => {
    stubApi({ points: pageDto([POINT_PUMP], 1) });
    renderWithProviders(<MonitoringPointsPanel />, { role: 'VIEWER', route: '/monitoring-points' });

    expect(await screen.findByRole('table')).toBeDefined();
    // O recorte continua disponível para quem só consulta...
    expect(screen.getByLabelText(/Buscar pontos/i)).toBeDefined();
    // ...mas nenhuma mutação é oferecida.
    expect(screen.queryByRole('button', { name: /Criar ponto/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Associar sensor/i })).toBeNull();
    expect(screen.getByText(/somente leitura/i)).toBeDefined();
  });
});

/**
 * TS-07 — verificação reproduzível do requisito de latência do enunciado:
 * "The latency between client and the server side should be below 350ms for all requests."
 *
 * Metodologia:
 *  - mede o estado estacionário local (cliente e servidor na mesma máquina), que é o
 *    ambiente de execução documentado do desafio; startup/cold boot fica de fora por
 *    definição — os WARMUP_COUNT primeiros disparos de cada rota são descartados;
 *  - SAMPLE_COUNT requisições sequenciais por rota (latência, não teste de carga);
 *  - cada amostra exige status 2xx — resposta de erro invalida a rota inteira;
 *  - o critério de aprovação é o MÁXIMO observado < 350 ms ("all requests"), com p95 e
 *    média reportados como apoio;
 *  - rotas privadas são chamadas com Authorization: Bearer real, obtido por login;
 *  - a rota de escrita cria máquinas com nomes únicos (prefixo LAT-) e a de exclusão
 *    as remove — o script não deixa resíduo no banco.
 *
 * Uso:  npm run perf:latency          (exige a API no ar: npm run dev:api)
 * Saída: tabela por rota + veredito; código de saída 1 se qualquer rota reprovar.
 */
import { performance } from 'node:perf_hooks';
import os from 'node:os';

const BASE_URL = process.env.LATENCY_BASE_URL ?? 'http://localhost:3000/api';
const EMAIL = process.env.SEED_USER_EMAIL ?? 'analista@dynamox.local';
const PASSWORD = process.env.SEED_USER_PASSWORD ?? 'Dynamox@2026';
const THRESHOLD_MS = 350;
const WARMUP_COUNT = 5;
const SAMPLE_COUNT = 30;

interface RouteResult {
  name: string;
  samples: number[];
  failures: number;
}

interface RouteSpec {
  name: string;
  request: (iteration: number) => Promise<Response>;
  /** Executada após cada amostra (fora do cronômetro); recebe o corpo já lido. */
  after?: (response: Response, bodyText: string) => Promise<void>;
}

function stats(samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.ceil(q * sorted.length) - 1)];
  const mean = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  return {
    min: sorted[0],
    mean,
    p50: at(0.5),
    p95: at(0.95),
    max: sorted[sorted.length - 1],
  };
}

async function measureRoute(spec: RouteSpec): Promise<RouteResult> {
  const result: RouteResult = { name: spec.name, samples: [], failures: 0 };

  for (let i = 0; i < WARMUP_COUNT + SAMPLE_COUNT; i += 1) {
    const started = performance.now();
    const response = await spec.request(i);
    // O corpo faz parte da resposta: latência real inclui recebê-lo por inteiro.
    const bodyText = await response.text();
    const elapsed = performance.now() - started;

    const measured = i >= WARMUP_COUNT;
    if (!response.ok) {
      // Leitura estrita de "all requests": resposta inválida reprova a rota mesmo no
      // aquecimento — aquecer com erro não é aquecer, é mascarar defeito.
      result.failures += 1;
    } else if (measured) {
      result.samples.push(elapsed);
    }
    if (spec.after) await spec.after(response, bodyText);
  }

  return result;
}

async function main(): Promise<void> {
  // Pré-condição: API viva. Sem ela, falhar rápido com instrução clara.
  const health = await fetch(`${BASE_URL}/health`).catch(() => null);
  if (!health || !health.ok) {
    console.error(`API indisponível em ${BASE_URL}. Suba com: npm run dev:api`);
    process.exit(1);
  }

  const login = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!login.ok) {
    console.error('Login falhou. Rode o seed primeiro: npm run seed');
    process.exit(1);
  }
  const { token } = (await login.json()) as { token: string };
  const AUTH = { Authorization: `Bearer ${token}` };
  const JSON_AUTH = { ...AUTH, 'Content-Type': 'application/json' };

  const seriesResponse = await fetch(`${BASE_URL}/time-series`, { headers: AUTH });
  if (!seriesResponse.ok) {
    console.error(`Pré-condição falhou: GET /time-series respondeu ${seriesResponse.status}.`);
    process.exit(1);
  }
  const series = (await seriesResponse.json()) as Array<{ id: string }>;
  if (series.length === 0) {
    console.error('Nenhuma série no banco. Rode o seed primeiro: npm run seed');
    process.exit(1);
  }
  const seriesId = series[0].id;

  // As rotas do painel e dos alertas são as que a demonstração usa de fato; um episódio
  // qualquer serve de amostra para o detalhe (se não houver nenhum, a rota é pulada).
  const now = new Date();
  const window7d = new URLSearchParams({
    from: new Date(now.getTime() - 7 * 86_400_000).toISOString(),
    to: now.toISOString(),
  }).toString();
  const alertsResponse = await fetch(`${BASE_URL}/alerts?pageSize=1`, { headers: AUTH });
  const alertId = alertsResponse.ok
    ? (((await alertsResponse.json()) as { items: Array<{ id: string }> }).items[0]?.id ?? null)
    : null;
  // Janela de 30 dias e uma máquina qualquer: as rotas analíticas mais caras (mapa de
  // severidade, resumo do ativo, série agregada) são medidas no pior período que a
  // interface oferece — é aí que "all requests" costuma falhar.
  const window30d = new URLSearchParams({
    from: new Date(now.getTime() - 30 * 86_400_000).toISOString(),
    to: now.toISOString(),
  }).toString();
  const machinesResponse = await fetch(`${BASE_URL}/machines`, { headers: AUTH });
  const machinesBody: unknown = machinesResponse.ok ? await machinesResponse.json() : [];
  const machineKey = Array.isArray(machinesBody)
    ? ((machinesBody[0] as { name?: string } | undefined)?.name ?? null)
    : null;

  // Nomes únicos por execução: duas rodadas seguidas não conflitam entre si.
  const runId = Date.now().toString(36);
  const createdIds: string[] = [];

  const routes: RouteSpec[] = [
    {
      name: 'POST /auth/login',
      request: () =>
        fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        }),
    },
    { name: 'GET /health', request: () => fetch(`${BASE_URL}/health`) },
    { name: 'GET /machines', request: () => fetch(`${BASE_URL}/machines`, { headers: AUTH }) },
    {
      name: 'GET /monitoring-points',
      request: () => fetch(`${BASE_URL}/monitoring-points?page=1`, { headers: AUTH }),
    },
    { name: 'GET /time-series', request: () => fetch(`${BASE_URL}/time-series`, { headers: AUTH }) },
    {
      name: 'GET /time-series/:id/samples',
      request: () => fetch(`${BASE_URL}/time-series/${seriesId}/samples?limit=500`, { headers: AUTH }),
    },
    {
      name: 'GET /time-series/:id/metrics',
      request: () => fetch(`${BASE_URL}/time-series/${seriesId}/metrics`, { headers: AUTH }),
    },
    {
      name: 'GET /analytics/fleet-condition (7 d)',
      request: () => fetch(`${BASE_URL}/analytics/fleet-condition?${window7d}`, { headers: AUTH }),
    },
    {
      name: 'GET /analytics/fleet-condition (30 d, +trend)',
      request: () =>
        fetch(`${BASE_URL}/analytics/fleet-condition?${window30d}&includeTrend=true`, { headers: AUTH }),
    },
    {
      name: 'GET /analytics/heatmap (7 d, hora)',
      request: () => fetch(`${BASE_URL}/analytics/heatmap?${window7d}&bucket=hour`, { headers: AUTH }),
    },
    {
      name: 'GET /analytics/heatmap (30 d, hora)',
      request: () => fetch(`${BASE_URL}/analytics/heatmap?${window30d}&bucket=hour`, { headers: AUTH }),
    },
    {
      name: 'GET /analytics/machines (30 d)',
      request: () => fetch(`${BASE_URL}/analytics/machines?${window30d}`, { headers: AUTH }),
    },
    ...(machineKey
      ? [
          {
            name: 'GET /analytics/machines/:key (30 d)',
            request: () =>
              fetch(`${BASE_URL}/analytics/machines/${encodeURIComponent(machineKey)}?${window30d}`, {
                headers: AUTH,
              }),
          } satisfies RouteSpec,
        ]
      : []),
    {
      name: 'GET /analytics/series/:id/points (30 d, 4 h)',
      request: () =>
        fetch(`${BASE_URL}/analytics/series/${seriesId}/points?${window30d}&bucket=4h`, { headers: AUTH }),
    },
    {
      name: 'GET /alerts?status=active',
      request: () => fetch(`${BASE_URL}/alerts?status=active`, { headers: AUTH }),
    },
    {
      name: 'GET /alerts?search=… (50 por página)',
      request: () =>
        fetch(`${BASE_URL}/alerts?search=${encodeURIComponent((machineKey ?? 'p-').slice(0, 5).toLowerCase())}&pageSize=50`, {
          headers: AUTH,
        }),
    },
    ...(alertId
      ? [
          {
            name: 'GET /alerts/:id',
            request: () => fetch(`${BASE_URL}/alerts/${alertId}`, { headers: AUTH }),
          } satisfies RouteSpec,
        ]
      : []),
    {
      name: 'POST /machines (escrita)',
      request: (i) =>
        fetch(`${BASE_URL}/machines`, {
          method: 'POST',
          headers: JSON_AUTH,
          body: JSON.stringify({ name: `LAT-${runId}-${i}`, type: 'Fan' }),
        }),
      after: async (response, bodyText) => {
        if (response.ok) {
          try {
            const body = JSON.parse(bodyText) as { id?: string };
            if (body.id) createdIds.push(body.id);
          } catch {
            // corpo inesperado: a amostra já foi contabilizada; nada a limpar.
          }
        }
      },
    },
    {
      name: 'DELETE /machines/:id',
      request: () => {
        const id = createdIds.shift();
        return fetch(`${BASE_URL}/machines/${id}`, { method: 'DELETE', headers: AUTH });
      },
    },
  ];

  console.log(`TS-07 — latência local (limite: ${THRESHOLD_MS} ms por requisição)`);
  console.log(
    `ambiente: node ${process.version} · ${os.platform()} ${os.arch()} · ${os.cpus()[0]?.model ?? 'cpu desconhecida'}`,
  );
  console.log(
    `amostras: ${SAMPLE_COUNT} por rota (após ${WARMUP_COUNT} de aquecimento descartadas), sequenciais\n`,
  );

  // A limpeza roda SEMPRE, mesmo se a medição estourar no meio: nenhuma máquina LAT-*
  // pode sobrar no banco (aconteceu numa versão anterior deste script; nunca mais).
  const results: RouteResult[] = [];
  try {
    for (const route of routes) {
      results.push(await measureRoute(route));
    }
  } finally {
    let leftovers = 0;
    for (const id of createdIds) {
      const removed = await fetch(`${BASE_URL}/machines/${id}`, {
        method: 'DELETE',
        headers: AUTH,
      }).catch(() => null);
      if (!removed || (!removed.ok && removed.status !== 404)) leftovers += 1;
    }
    if (leftovers > 0) {
      console.error(`ATENÇÃO: ${leftovers} máquina(s) LAT-* não puderam ser removidas.`);
    }
  }

  const header = '| rota | n | min | média | p50 | p95 | max | veredito |';
  console.log(header);
  console.log('|---|---|---|---|---|---|---|---|');

  let allPassed = true;
  for (const result of results) {
    if (result.failures > 0 || result.samples.length === 0) {
      allPassed = false;
      console.log(`| ${result.name} | ${result.samples.length} | — | — | — | — | — | FALHOU (${result.failures} respostas não-2xx) |`);
      continue;
    }
    const s = stats(result.samples);
    const passed = s.max < THRESHOLD_MS;
    if (!passed) allPassed = false;
    const ms = (value: number) => `${value.toFixed(1)} ms`;
    console.log(
      `| ${result.name} | ${result.samples.length} | ${ms(s.min)} | ${ms(s.mean)} | ${ms(s.p50)} | ${ms(s.p95)} | ${ms(s.max)} | ${passed ? 'PASSA' : `REPROVA (max ≥ ${THRESHOLD_MS} ms)`} |`,
    );
  }

  console.log(
    allPassed
      ? `\nRESULTADO: todas as rotas com máximo abaixo de ${THRESHOLD_MS} ms.`
      : `\nRESULTADO: há rota acima de ${THRESHOLD_MS} ms ou com falha — investigar antes de considerar o requisito atendido.`,
  );
  process.exit(allPassed ? 0 : 1);
}

void main();

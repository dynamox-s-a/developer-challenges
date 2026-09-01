/**
 * Preparação da demonstração, ponta a ponta e na ordem certa.
 *
 *   npm run demo:prepare                    # banco do zero → planta → 30 dias → alertas → validação
 *   npm run demo:prepare -- --skip-reset    # mantém o banco atual (só recarrega e reprocessa)
 *   npm run demo:prepare -- --skip-history  # planta e alertas, sem o mês sintético (rápido)
 *
 * Por que um script e não uma lista de comandos no README: a ordem tem uma armadilha real.
 * O histórico é ingerido PELA API (é o contrato de verdade), mas o motor de alertas não pode
 * avaliá-lo ao vivo — ele veria trinta dias de dados com o relógio de parede de hoje, e a
 * varredura de presença abriria episódios datados de agora. A saída é subir a API com o motor
 * desligado durante a carga, derrubá-la e reprocessar tudo com `alerts:backfill`, que replaya
 * o tempo do dado. Este script faz exatamente isso, falha cedo e diz o que quebrou.
 *
 * Nada aqui é mágico: cada passo é um comando que existe e pode ser rodado à mão.
 */
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

interface Options {
  skipReset: boolean;
  skipHistory: boolean;
  skipValidate: boolean;
}

const API_PORT = process.env.API_PORT ?? '3000';
const HEALTH_URL = `http://localhost:${API_PORT}/api/health`;

function parseArgs(argv: string[]): Options {
  const options: Options = { skipReset: false, skipHistory: false, skipValidate: false };
  for (const flag of argv) {
    if (flag === '--skip-reset') options.skipReset = true;
    else if (flag === '--skip-history') options.skipHistory = true;
    else if (flag === '--skip-validate') options.skipValidate = true;
    else throw new Error(`Argumento desconhecido: ${flag}`);
  }
  return options;
}

function assertLocalDatabase(): void {
  const url = process.env.DATABASE_URL ?? '';
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  })();
  if (!['localhost', '127.0.0.1', 'db'].includes(host)) {
    throw new Error(`demo:prepare só roda contra banco local (DATABASE_URL aponta para "${host || 'inválido'}").`);
  }
}

async function apiIsUp(): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    return (await fetch(HEALTH_URL, { signal: controller.signal })).ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

let step = 0;
function announce(title: string): void {
  step += 1;
  console.log(`\n[${step}] ${title}`);
}

/** Roda um comando herdando o terminal; qualquer falha aborta a preparação. */
function run(command: string, args: string[], label: string): void {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${label} falhou (código ${result.status}). A preparação parou aqui — nada foi mascarado.`);
  }
}

const npm = (script: string, args: string[] = []): void =>
  run('npm', ['run', script, ...(args.length > 0 ? ['--', ...args] : [])], `npm run ${script}`);

async function waitFor(predicate: () => Promise<boolean>, timeoutMs: number, what: string): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await delay(500);
  }
  throw new Error(`Tempo esgotado esperando ${what} (${Math.round(timeoutMs / 1000)} s).`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  assertLocalDatabase();

  if (await apiIsUp()) {
    throw new Error(
      `A API já está no ar em ${HEALTH_URL}. Pare-a antes: este script sobe a própria instância com o motor de ` +
        'alertas desligado durante a carga e a derruba antes do backfill.',
    );
  }

  const startedAt = Date.now();

  if (options.skipReset) {
    announce('Banco mantido (--skip-reset): apenas garantindo as migrações');
    npm('prisma:deploy');
  } else {
    announce('Banco do zero: volume, migrações e seed');
    npm('db:reset');
  }

  announce('Build das libs e da API');
  run('npx', ['nx', 'run-many', '-t', 'build', '--projects', '@dynamox/contracts,@dynamox/domain,@dynamox/api'], 'build');

  announce('API temporária COM O MOTOR DE ALERTAS DESLIGADO (a carga não pode ser avaliada ao vivo)');
  const api = spawn('node', ['apps/api/dist/main.js'], {
    stdio: ['ignore', 'pipe', 'inherit'],
    env: { ...process.env, ALERTS_EVALUATE_ON_INGEST: 'false', ALERTS_PRESENCE_SWEEP_MS: '0' },
  });
  api.stdout?.resume();
  let apiExited = false;
  api.on('exit', () => {
    apiExited = true;
  });

  try {
    await waitFor(async () => !apiExited && (await apiIsUp()), 60_000, 'a API temporária responder em /api/health');
    console.log(`    API temporária no ar (pid ${api.pid}) — ALERTS_EVALUATE_ON_INGEST=false, sem varredura de presença.`);

    announce('Planta de demonstração (cadastro, baseline e fase de condição) pelo contrato público');
    npm('plant', ['bootstrap']);
    npm('plant', ['baseline']);
    npm('plant', ['condition']);

    if (options.skipHistory) {
      console.log('\n    --skip-history: o mês sintético NÃO foi carregado (a demo terá só as fases da planta).');
    } else {
      announce('Histórico sintético de 30 dias por POST /telemetry-cycles (alguns minutos)');
      npm('twin:history');
    }
  } finally {
    announce('Derrubando a API temporária antes do replay');
    if (!apiExited) api.kill('SIGTERM');
    await waitFor(async () => !(await apiIsUp()), 30_000, 'a API temporária encerrar').catch(() => {
      api.kill('SIGKILL');
    });
    console.log('    API temporária encerrada.');
  }

  announce('Motor de alertas sobre todo o histórico, com relógio replayado (idempotente)');
  npm('alerts:backfill');

  announce('Histórico operacional anterior (mar–mai) — popular a listagem de alertas');
  npm('alerts:seed-history');

  if (!options.skipValidate) {
    announce('Validação contra a verdade-terreno do gerador');
    npm('alerts:validate');
  }

  announce('Conferência dos invariantes da demo');
  npm('demo:verify');

  const minutes = ((Date.now() - startedAt) / 60_000).toFixed(1);
  console.log(`\nDemo preparada em ${minutes} min.`);
  console.log('Agora suba a aplicação normalmente:');
  console.log('  npm run dev:api      # http://localhost:3000/api  (motor de alertas ligado)');
  console.log('  npm run dev:web      # http://localhost:5173');
  console.log('Login: analista@dynamox.local / Dynamox@2026 (ADMIN) · consulta@dynamox.local / Consulta@2026 (VIEWER)');
}

main().catch((error: unknown) => {
  console.error(`\ndemo:prepare falhou: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});

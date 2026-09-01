/**
 * Ponte TS → Python do F8: executa ros/rosbag_bridge.py com o ambiente do ROS Noetic
 * montado explicitamente (PYTHONPATH/LD_LIBRARY_PATH), sem `source` e sem roscore.
 *
 * ROS é OPCIONAL para o desafio: nada da suíte convencional depende deste módulo — só
 * o comando dedicado (`npm run twin:ros` / `plant rosbag`) o utiliza, e ele falha com
 * mensagem clara quando o runtime não está instalado.
 */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

/** Raiz do ROS 1 (Noetic por padrão; sobrescreva com TWIN_ROS_ROOT se necessário). */
export function rosRoot(): string {
  return process.env.TWIN_ROS_ROOT ?? '/opt/ros/noetic';
}

export function rosEnvironment(): NodeJS.ProcessEnv {
  const root = rosRoot();
  const pythonPath = join(root, 'lib', 'python3', 'dist-packages');
  const libPath = join(root, 'lib');
  return {
    ...process.env,
    PYTHONPATH: process.env.PYTHONPATH ? `${pythonPath}:${process.env.PYTHONPATH}` : pythonPath,
    LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH
      ? `${libPath}:${process.env.LD_LIBRARY_PATH}`
      : libPath,
  };
}

export const ROS_REQUIREMENTS =
  'F8 requer ROS Noetic (Ubuntu 20.04, Python 3.8) com rosbag/sensor_msgs — opcional para o desafio. ' +
  'Instalação padrão em /opt/ros/noetic (ou aponte TWIN_ROS_ROOT).';

/** Runtime disponível? (import de rosbag no Python com o ambiente montado). */
export function rosAvailable(): boolean {
  const probe = spawnSync('python3', ['-c', 'import rosbag'], {
    env: rosEnvironment(),
    timeout: 15_000,
  });
  return probe.status === 0;
}

export interface BridgeStats {
  messages: number;
  topics: string[];
}

const BRIDGE_SCRIPT = join(__dirname, '..', 'ros', 'rosbag_bridge.py');

/** Roda a ponte (to-bag | from-bag) e devolve as estatísticas reportadas por ela. */
export function runRosBridge(
  mode: 'to-bag' | 'from-bag',
  inputPath: string,
  outputPath: string,
): BridgeStats {
  const result = spawnSync(
    'python3',
    [BRIDGE_SCRIPT, mode, '--in', inputPath, '--out', outputPath],
    { env: rosEnvironment(), encoding: 'utf8', timeout: 60_000 },
  );
  if (result.error) {
    throw new Error(`Ponte ROS não executou (${result.error.message}). ${ROS_REQUIREMENTS}`);
  }
  if (result.status !== 0) {
    throw new Error(
      `Ponte ROS falhou (${mode}, exit ${result.status}): ${result.stderr.trim() || result.stdout.trim()}. ${ROS_REQUIREMENTS}`,
    );
  }
  const statsLine = result.stdout.trim().split('\n').pop() ?? '';
  let stats: BridgeStats;
  try {
    stats = JSON.parse(statsLine) as BridgeStats;
  } catch {
    throw new Error(`Ponte ROS respondeu sem estatísticas válidas: "${statsLine}".`);
  }
  if (!Number.isSafeInteger(stats.messages) || !Array.isArray(stats.topics)) {
    throw new Error(`Estatísticas da ponte ROS fora do formato esperado: "${statsLine}".`);
  }
  return stats;
}

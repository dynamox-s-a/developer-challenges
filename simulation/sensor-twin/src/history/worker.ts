/** Worker de geração: recebe um HistoryJob, devolve o ciclo serializado. Sem rede, sem estado. */
import { parentPort } from 'node:worker_threads';

import { buildHistoryCycle, type HistoryJob } from './build';

if (!parentPort) throw new Error('history/worker.ts só roda como worker_thread.');

parentPort.on('message', (job: HistoryJob) => {
  try {
    parentPort!.postMessage({ ok: true, cycle: buildHistoryCycle(job) });
  } catch (error) {
    parentPort!.postMessage({ ok: false, jobId: job.jobId, error: String((error as Error).message ?? error) });
  }
});

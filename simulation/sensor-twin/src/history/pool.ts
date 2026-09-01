/**
 * Pool de workers para a geração (CPU-bound: ≈3 M senos por ciclo). Um job por worker de
 * cada vez, fila FIFO; falha de qualquer worker derruba o pool com erro explícito.
 * Sob tsx, os workers herdam `process.execArgv` (loader TS) — em dist, carregam o .js.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Worker } from 'node:worker_threads';

import { buildHistoryCycle, type GeneratedCycle, type HistoryJob } from './build';

type WorkerReply = { ok: true; cycle: GeneratedCycle } | { ok: false; jobId: number; error: string };

interface Pending {
  job: HistoryJob;
  resolve: (cycle: GeneratedCycle) => void;
  reject: (error: Error) => void;
}

export interface Generator {
  generate(job: HistoryJob): Promise<GeneratedCycle>;
  close(): Promise<void>;
  readonly size: number;
}

/** Geração no próprio processo — o caminho simples, sempre disponível. */
export function inProcessGenerator(): Generator {
  return {
    size: 1,
    generate: async (job) => buildHistoryCycle(job),
    close: async () => undefined,
  };
}

export function workerFile(): string {
  const ts = join(__dirname, 'worker.ts');
  return existsSync(ts) ? ts : join(__dirname, 'worker.js');
}

export class GenerationPool implements Generator {
  private readonly idle: Worker[] = [];
  private readonly busy = new Map<Worker, Pending>();
  private readonly queue: Pending[] = [];
  private readonly workers: Worker[] = [];
  private failure: Error | null = null;

  constructor(readonly size: number) {
    for (let i = 0; i < size; i += 1) {
      const worker = new Worker(workerFile());
      worker.on('message', (reply: WorkerReply) => this.onReply(worker, reply));
      worker.on('error', (error) => this.fail(new Error(`worker de geração falhou: ${error.message}`)));
      worker.on('exit', (code) => {
        if (code !== 0 && !this.failure) this.fail(new Error(`worker de geração saiu com código ${code}`));
      });
      this.workers.push(worker);
      this.idle.push(worker);
    }
  }

  generate(job: HistoryJob): Promise<GeneratedCycle> {
    if (this.failure) return Promise.reject(this.failure);
    return new Promise<GeneratedCycle>((resolve, reject) => {
      this.queue.push({ job, resolve, reject });
      this.pump();
    });
  }

  /** Prova rápida de que o worker consegue carregar TS e gerar um ciclo. */
  async smoke(job: HistoryJob, timeoutMs = 20_000): Promise<GeneratedCycle> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`worker não respondeu em ${timeoutMs} ms`)), timeoutMs).unref(),
    );
    return Promise.race([this.generate(job), timeout]);
  }

  async close(): Promise<void> {
    await Promise.all(this.workers.map((worker) => worker.terminate()));
  }

  private pump(): void {
    while (this.idle.length > 0 && this.queue.length > 0) {
      const worker = this.idle.pop()!;
      const pending = this.queue.shift()!;
      this.busy.set(worker, pending);
      worker.postMessage(pending.job);
    }
  }

  private onReply(worker: Worker, reply: WorkerReply): void {
    const pending = this.busy.get(worker);
    this.busy.delete(worker);
    this.idle.push(worker);
    if (pending) {
      if (reply.ok) pending.resolve(reply.cycle);
      else pending.reject(new Error(`geração falhou (job ${reply.jobId}): ${reply.error}`));
    }
    this.pump();
  }

  private fail(error: Error): void {
    this.failure = error;
    for (const pending of [...this.busy.values(), ...this.queue]) pending.reject(error);
    this.busy.clear();
    this.queue.length = 0;
  }
}

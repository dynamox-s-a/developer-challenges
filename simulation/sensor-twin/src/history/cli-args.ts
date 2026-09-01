/** Flags do `plant history`. Desconhecido lança — mesma disciplina do parseArgs do CLI. */
import { cpus } from 'node:os';

import { PLANT, plantSensors } from '../plant';
import { HISTORY_MIN_UNTIL_OFFSET_HOURS } from './schedule';

export interface HistoryCliOptions {
  days: number;
  everyMinutes: number;
  untilOffsetHours: number;
  epochIso?: string;
  toIso?: string;
  sensors: string[];
  concurrency: number;
  workers: number;
  retries: number;
  dryRun: boolean;
  offline: boolean;
  reportPath?: string;
  sinceIso?: string;
  limit?: number;
  noDetect: boolean;
}

export function defaultWorkers(cpuCount = cpus().length): number {
  return Math.max(1, Math.min(cpuCount - 2, 8));
}

function integer(flag: string, raw: string | undefined, min: number): number {
  const value = Number(raw);
  if (raw === undefined || !Number.isInteger(value) || value < min) {
    throw new Error(`${flag} precisa ser inteiro ≥ ${min} (recebido "${raw ?? ''}").`);
  }
  return value;
}

function isoMidnight(flag: string, raw: string | undefined): string {
  const ms = Date.parse(raw ?? '');
  if (!Number.isFinite(ms)) throw new Error(`${flag} precisa ser uma data ISO 8601 (recebido "${raw ?? ''}").`);
  if (ms % 86_400_000 !== 0) throw new Error(`${flag} precisa ser uma meia-noite UTC (ex.: 2026-08-01T00:00:00Z).`);
  return new Date(ms).toISOString();
}

function iso(flag: string, raw: string | undefined): string {
  const ms = Date.parse(raw ?? '');
  if (!Number.isFinite(ms)) throw new Error(`${flag} precisa ser uma data ISO 8601 (recebido "${raw ?? ''}").`);
  return new Date(ms).toISOString();
}

export function parseHistoryArgs(argv: string[], cpuCount?: number): HistoryCliOptions {
  const options: HistoryCliOptions = {
    days: 30,
    everyMinutes: 15,
    untilOffsetHours: HISTORY_MIN_UNTIL_OFFSET_HOURS,
    sensors: plantSensors(PLANT).map((sensor) => sensor.sensorSerial),
    concurrency: 6,
    workers: defaultWorkers(cpuCount),
    retries: 3,
    dryRun: false,
    offline: false,
    noDetect: false,
  };
  const known = new Set(plantSensors(PLANT).map((sensor) => sensor.sensorSerial));
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = () => argv[++i];
    switch (flag) {
      case '--days':
        options.days = integer(flag, next(), 1);
        break;
      case '--every':
        options.everyMinutes = integer(flag, next(), 1);
        if (60 % options.everyMinutes !== 0) throw new Error('--every precisa dividir 60 minutos.');
        break;
      case '--until-offset':
        options.untilOffsetHours = integer(flag, next(), HISTORY_MIN_UNTIL_OFFSET_HOURS);
        break;
      case '--epoch':
        options.epochIso = isoMidnight(flag, next());
        break;
      case '--to':
        options.toIso = iso(flag, next());
        break;
      case '--since':
        options.sinceIso = iso(flag, next());
        break;
      case '--sensors': {
        const list = (next() ?? '').split(',').map((s) => s.trim()).filter(Boolean);
        const unknown = list.filter((serial) => !known.has(serial));
        if (list.length === 0 || unknown.length > 0) {
          throw new Error(`--sensors desconhecidos: ${unknown.join(', ') || '(vazio)'}. Válidos: ${[...known].join(', ')}.`);
        }
        options.sensors = list;
        break;
      }
      case '--concurrency':
        options.concurrency = integer(flag, next(), 1);
        break;
      case '--workers':
        options.workers = integer(flag, next(), 1);
        break;
      case '--retries':
        options.retries = integer(flag, next(), 0);
        break;
      case '--limit':
        options.limit = integer(flag, next(), 1);
        break;
      case '--report':
        options.reportPath = next();
        if (!options.reportPath) throw new Error('--report precisa de um caminho.');
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--offline':
        options.offline = true;
        break;
      case '--no-detect':
        options.noDetect = true;
        break;
      default:
        throw new Error(`Argumento desconhecido: ${flag}`);
    }
  }
  return options;
}

/** Constantes de tempo do histórico, sem dependências — importadas por schedule, thermal e narrative. */
export const DAY_MS = 86_400_000;
export const DEMO_HOUR = 3_600_000;
export const MINUTE_MS = 60_000;
export const MACHINE_PHASE_BASE_MINUTES = 2;
export function machinePhaseMinutes(machineIndex: number): number {
  return MACHINE_PHASE_BASE_MINUTES + machineIndex;
}
export type { HistoryGap, HistorySchedule, HistorySlot } from './schedule';

import { MAX_READINGS_PER_SUBMISSION } from '@condition-monitor/shared';
import type { LiveCommand } from '../cli/parse-args';
import { ApiRequestError, type ApiClient } from '../api/client';
import { latestGridTime } from '../telemetry/grid';
import { sensorReadings } from '../telemetry/readings';
import {
  addReport,
  chunk,
  count,
  degradingSince,
  discover,
  emptyTotals,
  missingMessage,
  notSimulated,
  notSimulatedMessage,
  type Output,
} from './shared';

export interface Clock {
  now(): number;
  /** Waits, or returns early when the signal aborts. */
  sleep(ms: number, signal: AbortSignal): Promise<void>;
}

/**
 * Sends the current reading of every series at each instant of the grid, like a sensor
 * does, until stopped (C13). Sensors are discovered again at each instant, so one
 * installed meanwhile joins in. A failed instant is reported and the next one is tried:
 * the process keeps running, and nothing fails silently.
 */
export async function live(
  command: LiveCommand,
  deps: { client: ApiClient; clock: Clock; out: Output; signal: AbortSignal },
): Promise<number> {
  const { client, clock, out, signal } = deps;
  const interval = command.intervalMinutes * 60_000;

  try {
    // A mistyped serial number is a mistake to fix now, not a warning every 10 minutes.
    const { sensors, missing } = await discover(client, command.serialNumbers);
    if (missing.length > 0) {
      out.error(missingMessage(missing));
      return 1;
    }
    const unknown = notSimulated(command.degrade, sensors);
    if (unknown.length > 0) {
      out.error(notSimulatedMessage(unknown));
      return 1;
    }
  } catch (error) {
    if (error instanceof ApiRequestError) {
      out.error(error.message);
      return 1;
    }
    throw error;
  }

  const unit = command.intervalMinutes === 1 ? 'minute' : 'minutes';
  out.info(`Live every ${command.intervalMinutes} ${unit}. Stop with Ctrl+C.`);
  while (!signal.aborted) {
    const instant = latestGridTime(clock.now(), command.intervalMinutes);
    const at = new Date(instant).toISOString();
    try {
      const { sensors, missing } = await discover(client, command.serialNumbers);
      if (missing.length > 0) out.error(`${at}: ${missingMessage(missing)}`);
      if (sensors.length === 0) {
        out.error(`${at}: no installed sensor, nothing sent.`);
      } else {
        const total = emptyTotals();
        const readings = sensors.flatMap((sensor) =>
          sensorReadings(
            sensor,
            [instant],
            command.seed,
            degradingSince(command.degrade, sensor.serialNumber),
          ),
        );
        for (const batch of chunk(readings, MAX_READINGS_PER_SUBMISSION)) {
          addReport(total, await client.sendReadings(batch));
        }
        out.info(
          `${at}: ${count(total.readingsInserted)} stored, ${count(total.readingsRepeated)} already stored, for ${sensors.length} sensors.`,
        );
      }
    } catch (error) {
      if (!(error instanceof ApiRequestError)) throw error;
      out.error(`${at}: ${error.message} Retrying at the next instant.`);
    }
    await clock.sleep(instant + interval - clock.now(), signal);
  }
  out.info('Stopped.');
  return 0;
}

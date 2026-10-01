import type { BackfillCommand } from '../cli/parse-args';
import { ApiRequestError, type ApiClient } from '../api/client';
import { backfillTimes } from '../telemetry/grid';
import { sensorReadings } from '../telemetry/readings';
import {
  addReport,
  chunk,
  count,
  degradingSince,
  discover,
  emptyTotals,
  INSTANTS_PER_BATCH,
  missingMessage,
  notSimulated,
  notSimulatedMessage,
  type Output,
} from './shared';

/**
 * Sends a history of telemetry for each sensor, then exits (C13). Each submission is all
 * or nothing, and values depend only on the seed and the instant: when a run stops
 * halfway, running it again sends the rest and reports the first part as repeated.
 * Returns the exit code: 0 when everything was sent, 1 otherwise.
 */
export async function backfill(
  command: BackfillCommand,
  deps: { client: ApiClient; now: number; out: Output },
): Promise<number> {
  const { client, out } = deps;
  try {
    const { sensors, missing } = await discover(client, command.serialNumbers);
    if (missing.length > 0) {
      out.error(missingMessage(missing));
      return 1;
    }
    if (sensors.length === 0) {
      // Finishing without data is not a success.
      out.error('No installed sensor found: install one at a monitoring point, then run again.');
      return 1;
    }

    const unknown = notSimulated(command.degrade, sensors);
    if (unknown.length > 0) {
      out.error(notSimulatedMessage(unknown));
      return 1;
    }

    const times = backfillTimes(deps.now, command.days, command.intervalMinutes);
    out.info(
      `Backfill of ${command.days} ${command.days === 1 ? 'day' : 'days'} every ${command.intervalMinutes} ${command.intervalMinutes === 1 ? 'minute' : 'minutes'}, from ${new Date(times[0]).toISOString()} to ${new Date(times[times.length - 1]).toISOString()}, for ${sensors.length} sensors.`,
    );
    const total = emptyTotals();
    for (const sensor of sensors) {
      const own = emptyTotals();
      const since = degradingSince(command.degrade, sensor.serialNumber);
      for (const instants of chunk(times, INSTANTS_PER_BATCH)) {
        const readings = sensorReadings(sensor, instants, command.seed, since);
        addReport(own, await client.sendReadings(readings));
      }
      addReport(total, { sensors: [], totals: own });
      out.info(
        `${sensor.serialNumber} at ${sensor.machineTag}, ${sensor.location}${since === null ? '' : `, degrading since ${new Date(since).toISOString().slice(0, 10)}`}: ${count(own.readingsInserted)} stored, ${count(own.readingsRepeated)} already stored, ${own.seriesCreated} series created.`,
      );
    }
    out.info(
      `Done: ${count(total.readingsInserted)} readings stored, ${count(total.readingsRepeated)} already stored, ${total.seriesCreated} series created.`,
    );
    return 0;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      out.error(error.message);
      return 1;
    }
    throw error;
  }
}

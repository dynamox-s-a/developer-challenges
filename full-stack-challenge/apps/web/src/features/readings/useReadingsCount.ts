import { useEffect, useState } from 'react';
import { countReadings } from '../../services/readingsApi';
import { pluralize } from '../../utils/format';

interface CountState {
  sensorId: string | null;
  count: number | null;
  failed: boolean;
}

/**
 * How many readings a sensor has, for confirmations that must say what a
 * cascade erases. `null` while unknown; a stale answer for another sensor is
 * never returned.
 */
export function useReadingsCount(sensorId: string | null) {
  const [state, setState] = useState<CountState>({
    sensorId: null,
    count: null,
    failed: false,
  });

  useEffect(() => {
    if (!sensorId) return;
    let active = true;
    setState({ sensorId, count: null, failed: false });
    countReadings(sensorId).then(
      (count) => active && setState({ sensorId, count, failed: false }),
      () => active && setState({ sensorId, count: null, failed: true }),
    );
    return () => {
      active = false;
    };
  }, [sensorId]);

  const current = state.sensorId === sensorId;
  return {
    count: current ? state.count : null,
    failed: current && state.failed,
  };
}

/** "its 288 readings", or a safe fallback while counting or if it failed. */
export function readingsPhrase({
  count,
  failed,
}: ReturnType<typeof useReadingsCount>): string {
  if (count !== null) return `its ${pluralize(count, 'reading')}`;
  return failed ? 'all of its readings' : 'all of its readings (counting…)';
}

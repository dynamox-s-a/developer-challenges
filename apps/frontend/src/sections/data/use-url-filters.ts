import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { machineSelected } from 'src/store/machines/slice';
import { isPeriod } from 'src/store/measurements/period';
import { periodChanged } from 'src/store/measurements/slice';

export const MACHINE_PARAM = 'machine';
export const PERIOD_PARAM = 'period';

export function useUrlFilters() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedId = useAppSelector((state) => state.machines.selectedId);
  const period = useAppSelector((state) => state.measurements.period);

  const isHydrated = useRef(false);

  useEffect(() => {
    if (!isHydrated.current) return;

    const next = new URLSearchParams(searchParams);

    if (selectedId) next.set(MACHINE_PARAM, selectedId);
    else next.delete(MACHINE_PARAM);

    next.set(PERIOD_PARAM, period);

    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, selectedId, period]);

  useEffect(() => {
    const urlMachine = searchParams.get(MACHINE_PARAM);
    const urlPeriod = searchParams.get(PERIOD_PARAM);

    if (urlMachine) dispatch(machineSelected(urlMachine));
    if (isPeriod(urlPeriod)) dispatch(periodChanged(urlPeriod));

    isHydrated.current = true;
  }, []);
}

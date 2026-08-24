import { useCallback, useEffect, useRef } from 'react';
import type Highcharts from 'highcharts';
import {
	bindChartSynchronization,
	createHighchartsSyncAdapter,
	type SynchronizableChart,
} from './chartSynchronization';

export function useChartSynchronization() {
	const adaptersRef = useRef(new Map<string, SynchronizableChart<Highcharts.Point>>());
	const listenerCleanupsRef = useRef(new Map<string, () => void>());

	const registerChart = useCallback((id: string, chart: Highcharts.Chart | null) => {
		listenerCleanupsRef.current.get(id)?.();
		listenerCleanupsRef.current.delete(id);
		adaptersRef.current.delete(id);

		if (!chart) return;

		const adapter = createHighchartsSyncAdapter(chart);
		adaptersRef.current.set(id, adapter);

		listenerCleanupsRef.current.set(
			id,
			bindChartSynchronization(chart.container, () => [...adaptersRef.current.values()], adapter),
		);
	}, []);

	useEffect(() => {
		return () => {
			for (const cleanup of listenerCleanupsRef.current.values()) cleanup();
			listenerCleanupsRef.current.clear();
			adaptersRef.current.clear();
		};
	}, []);

	return { registerChart };
}

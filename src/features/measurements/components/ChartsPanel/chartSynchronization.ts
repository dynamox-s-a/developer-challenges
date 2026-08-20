import type Highcharts from 'highcharts';

export interface SynchronizablePoint<T> {
	timestamp: number;
	value: T;
}

export interface SynchronizableChart<T> {
	drawCrosshair: (event: MouseEvent, point: T) => void;
	getEventTimestamp: (event: MouseEvent) => number | undefined;
	getPointsBySeries: () => Array<Array<SynchronizablePoint<T>>>;
	hideCrosshair: () => void;
	hideTooltip: () => void;
	refreshTooltip: (points: T[]) => void;
}

export function findClosestPoint<T>(
	points: ReadonlyArray<SynchronizablePoint<T>>,
	timestamp: number,
): SynchronizablePoint<T> | undefined {
	let closest: SynchronizablePoint<T> | undefined;
	let smallestDistance = Number.POSITIVE_INFINITY;

	for (const point of points) {
		const distance = Math.abs(point.timestamp - timestamp);
		if (distance < smallestDistance) {
			closest = point;
			smallestDistance = distance;
		}
	}

	return closest;
}

function getAllPoints<T>(chart: SynchronizableChart<T>): Array<SynchronizablePoint<T>> {
	return chart.getPointsBySeries().flat();
}

export function synchronizeCharts<T>(
	charts: ReadonlyArray<SynchronizableChart<T>>,
	sourceChart: SynchronizableChart<T>,
	event: MouseEvent,
): void {
	const eventTimestamp = sourceChart.getEventTimestamp(event);
	if (eventTimestamp === undefined) return;

	const sourcePoint = findClosestPoint(getAllPoints(sourceChart), eventTimestamp);
	if (!sourcePoint) return;

	for (const chart of charts) {
		const points = chart
			.getPointsBySeries()
			.map((seriesPoints) => findClosestPoint(seriesPoints, sourcePoint.timestamp))
			.filter((point) => point !== undefined);

		const crosshairPoint = points[0];
		if (!crosshairPoint) continue;

		chart.refreshTooltip(points.map((point) => point.value));
		chart.drawCrosshair(event, crosshairPoint.value);
	}
}

export function hideChartIndicators<T>(charts: ReadonlyArray<SynchronizableChart<T>>): void {
	for (const chart of charts) {
		chart.hideTooltip();
		chart.hideCrosshair();
	}
}

export function bindChartSynchronization<T>(
	container: HTMLElement,
	getCharts: () => ReadonlyArray<SynchronizableChart<T>>,
	sourceChart: SynchronizableChart<T>,
): () => void {
	const handleMouseMove = (event: MouseEvent) => {
		synchronizeCharts(getCharts(), sourceChart, event);
	};
	const handleMouseLeave = () => {
		hideChartIndicators(getCharts());
	};

	container.addEventListener('mousemove', handleMouseMove);
	container.addEventListener('mouseleave', handleMouseLeave);

	return () => {
		container.removeEventListener('mousemove', handleMouseMove);
		container.removeEventListener('mouseleave', handleMouseLeave);
	};
}

export function createHighchartsSyncAdapter(
	chart: Highcharts.Chart,
): SynchronizableChart<Highcharts.Point> {
	let activeTooltipPoints: Highcharts.Point[] = [];

	const resetTooltipPointStates = () => {
		for (const point of activeTooltipPoints) point.setState();
		for (const series of chart.series) series.setState('');
		activeTooltipPoints = [];
	};

	return {
		drawCrosshair: (event, point) => {
			const axis = chart.xAxis[0];
			if (!axis) return;
			axis.drawCrosshair(chart.pointer.normalize(event), point);
		},
		getEventTimestamp: (event) => {
			const axis = chart.xAxis[0];
			if (!axis) return undefined;
			return axis.toValue(chart.pointer.normalize(event).chartX);
		},
		getPointsBySeries: () =>
			chart.series
				.filter((series) => series.visible)
				.map((series) => series.points.map((point) => ({ timestamp: point.x, value: point }))),
		hideCrosshair: () => {
			chart.xAxis[0]?.hideCrosshair();
		},
		hideTooltip: () => {
			resetTooltipPointStates();
			chart.tooltip.hide(0);
		},
		refreshTooltip: (points) => {
			resetTooltipPointStates();
			chart.tooltip.refresh(points);
			activeTooltipPoints = [...points];
		},
	};
}

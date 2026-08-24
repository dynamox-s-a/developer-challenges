import type Highcharts from 'highcharts';
import {
	bindChartSynchronization,
	createHighchartsSyncAdapter,
	findClosestPoint,
	hideChartIndicators,
	synchronizeCharts,
	type SynchronizableChart,
	type SynchronizablePoint,
} from './chartSynchronization';

function point(timestamp: number, value: string): SynchronizablePoint<string> {
	return { timestamp, value };
}

function createChart(
	series: Array<Array<SynchronizablePoint<string>>>,
	eventTimestamp: number | null = 0,
) {
	return {
		drawCrosshair: vi.fn(),
		getEventTimestamp: vi.fn(() => eventTimestamp ?? undefined),
		getPointsBySeries: vi.fn(() => series),
		hideCrosshair: vi.fn(),
		hideTooltip: vi.fn(),
		refreshTooltip: vi.fn(),
	} satisfies SynchronizableChart<string>;
}

describe('chartSynchronization', () => {
	it('finds the point nearest to a timestamp', () => {
		expect(
			findClosestPoint([point(100, 'first'), point(180, 'closest'), point(300, 'last')], 200),
		).toEqual(point(180, 'closest'));
		expect(findClosestPoint([], 200)).toBeUndefined();
	});

	it('refreshes tooltip and crosshair on all charts using each series nearest point', () => {
		const event = new MouseEvent('mousemove');
		const acceleration = createChart(
			[
				[point(100, 'acc-x-100'), point(200, 'acc-x-200')],
				[point(195, 'acc-y-195')],
				[point(210, 'acc-z-210')],
			],
			190,
		);
		const temperature = createChart([[point(220, 'temperature-220')]]);
		const velocity = createChart([
			[point(180, 'vel-x-180')],
			[point(205, 'vel-y-205')],
			[point(400, 'vel-z-400')],
		]);

		synchronizeCharts([acceleration, temperature, velocity], acceleration, event);

		expect(acceleration.refreshTooltip).toHaveBeenCalledWith([
			'acc-x-200',
			'acc-y-195',
			'acc-z-210',
		]);
		expect(temperature.refreshTooltip).toHaveBeenCalledWith(['temperature-220']);
		expect(velocity.refreshTooltip).toHaveBeenCalledWith(['vel-x-180', 'vel-y-205', 'vel-z-400']);
		expect(acceleration.drawCrosshair).toHaveBeenCalledWith(event, 'acc-x-200');
		expect(temperature.drawCrosshair).toHaveBeenCalledWith(event, 'temperature-220');
		expect(velocity.drawCrosshair).toHaveBeenCalledWith(event, 'vel-x-180');
	});

	it('does nothing when the source timestamp or points are unavailable', () => {
		const event = new MouseEvent('mousemove');
		const target = createChart([[point(100, 'target')]]);
		const missingAxis = createChart([[point(100, 'source')]], null);
		const missingSeries = createChart([], 100);

		synchronizeCharts([target], missingAxis, event);
		synchronizeCharts([target], missingSeries, event);

		expect(target.refreshTooltip).not.toHaveBeenCalled();
		expect(target.drawCrosshair).not.toHaveBeenCalled();
	});

	it('hides every tooltip and crosshair', () => {
		const first = createChart([]);
		const second = createChart([]);

		hideChartIndicators([first, second]);

		expect(first.hideTooltip).toHaveBeenCalledOnce();
		expect(first.hideCrosshair).toHaveBeenCalledOnce();
		expect(second.hideTooltip).toHaveBeenCalledOnce();
		expect(second.hideCrosshair).toHaveBeenCalledOnce();
	});

	it('resets previously active Highcharts points before refreshing and hiding the tooltip', () => {
		const firstPoint = { setState: vi.fn() } as unknown as Highcharts.Point;
		const secondPoint = { setState: vi.fn() } as unknown as Highcharts.Point;
		const series = { setState: vi.fn() };
		const tooltip = { hide: vi.fn(), refresh: vi.fn() };
		const chart = {
			series: [series],
			tooltip,
		} as unknown as Highcharts.Chart;
		const adapter = createHighchartsSyncAdapter(chart);

		adapter.refreshTooltip([firstPoint]);
		adapter.refreshTooltip([secondPoint]);

		expect(firstPoint.setState).toHaveBeenCalledWith();
		expect(tooltip.refresh).toHaveBeenNthCalledWith(1, [firstPoint]);
		expect(tooltip.refresh).toHaveBeenNthCalledWith(2, [secondPoint]);

		adapter.hideTooltip();

		expect(secondPoint.setState).toHaveBeenCalledWith();
		expect(series.setState).toHaveBeenCalledWith('');
		expect(tooltip.hide).toHaveBeenCalledWith(0);
	});

	it('registers mouse listeners and removes them during cleanup', () => {
		const container = document.createElement('div');
		const chart = createChart([[point(100, 'value')]], 100);
		const cleanup = bindChartSynchronization(container, () => [chart], chart);

		container.dispatchEvent(new MouseEvent('mousemove'));
		expect(chart.refreshTooltip).toHaveBeenCalledWith(['value']);

		container.dispatchEvent(new MouseEvent('mouseleave'));
		expect(chart.hideTooltip).toHaveBeenCalledOnce();
		expect(chart.hideCrosshair).toHaveBeenCalledOnce();

		cleanup();
		chart.refreshTooltip.mockClear();
		chart.hideTooltip.mockClear();
		container.dispatchEvent(new MouseEvent('mousemove'));
		container.dispatchEvent(new MouseEvent('mouseleave'));

		expect(chart.refreshTooltip).not.toHaveBeenCalled();
		expect(chart.hideTooltip).not.toHaveBeenCalled();
	});
});

import { groupByMetric } from '../groupByMetric';
import type { RawSeries } from '../types';

const mockSeries: RawSeries[] = [
    { name: 'accelerationRms/x', data: [] },
    { name: 'accelerationRms/y', data: [] },
    { name: 'accelerationRms/z', data: [] },
    { name: 'velocityRms/x', data: [] },
    { name: 'velocityRms/y', data: [] },
    { name: 'velocityRms/z', data: [] },
    { name: 'temperature', data: [] },
];

describe('groupByMetric', () => {
    it('should return three groups', () => {
        expect(groupByMetric(mockSeries)).toHaveLength(3);
    });

    it('should group acceleration series correctly', () => {
        const groups = groupByMetric(mockSeries);

        const acceleration = groups.find((group) => group.title === 'Aceleração RMS');

        expect(acceleration?.series).toHaveLength(3);
        expect(
            acceleration?.series.every((serie) => serie.name.startsWith('accelerationRms'))
        ).toBe(true);
    });

    it('should group velocity series correctly', () => {
        const groups = groupByMetric(mockSeries);

        const velocity = groups.find((group) => group.title === 'Velocidade RMS');

        expect(velocity?.series).toHaveLength(3);
        expect(velocity?.series.every((serie) => serie.name.startsWith('velocityRms'))).toBe(true);
    });

    it('should group temperature series correctly', () => {
        const groups = groupByMetric(mockSeries);

        const temperature = groups.find((group) => group.title === 'Temperatura');

        expect(temperature?.series).toHaveLength(1);
        expect(temperature?.series[0].name).toBe('temperature');
    });
});

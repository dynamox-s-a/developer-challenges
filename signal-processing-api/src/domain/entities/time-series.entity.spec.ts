import { TimeSeries } from './time-series.entity';
import { SensorName } from '../value-objects/sensor-name.vo';
import { Timestamp } from '../value-objects/timestamp.vo';
import { MeasurementUnit } from '../value-objects/measurement-unit.vo';

describe('TimeSeries Entity & Value Objects', () => {
  describe('Value Objects', () => {
    it('should create valid SensorName', () => {
      expect(() => new SensorName('accelerationRms/x')).not.toThrow();
    });

    it('should throw for invalid SensorName', () => {
      expect(() => new SensorName('invalid-name!')).toThrow(/SensorName validation failed/);
    });

    it('should create valid Timestamp', () => {
      expect(() => new Timestamp('2023-11-07T11:53:38.187Z')).not.toThrow();
    });

    it('should throw for invalid Timestamp', () => {
      expect(() => new Timestamp('not-a-date')).toThrow(/Timestamp validation failed/);
    });

    it('should create valid MeasurementUnit', () => {
      expect(() => new MeasurementUnit('g')).not.toThrow();
    });
  });

  describe('TimeSeries Entity', () => {
    it('should create a valid TimeSeries', () => {
      const series = new TimeSeries(
        new SensorName('accelerationRms/x'),
        'sensor-001',
        1000,
        new MeasurementUnit('g'),
        [
          { datetime: new Timestamp('2023-11-07T11:53:38.187Z'), value: 0.0023 }
        ]
      );

      expect(series).toBeDefined();
      expect(series.getTotalMeasurements()).toBe(1);
    });

    it('should throw if sample rate is invalid', () => {
      expect(() => new TimeSeries(
        new SensorName('test'),
        'sensor-1',
        0,
        new MeasurementUnit('g'),
        [{ datetime: new Timestamp('2023-11-07T11:53:38.187Z'), value: 1 }]
      )).toThrow('Sample rate must be greater than 0');
    });

    it('should throw if data points are empty', () => {
      expect(() => new TimeSeries(
        new SensorName('test'),
        'sensor-1',
        1000,
        new MeasurementUnit('g'),
        []
      )).toThrow('Time series must contain at least one data point');
    });
  });
});

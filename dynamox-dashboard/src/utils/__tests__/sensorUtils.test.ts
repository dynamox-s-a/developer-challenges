import { describe, it, expect } from 'vitest';
import {
  filterSensorsByType,
  getSensorTypes,
  getSensorColor,
  getSensorDisplayName,
} from '../sensorUtils';
import type { SensorData } from '../../types/sensor';

const mockSensorData: SensorData[] = [
  {
    name: 'Acceleration Sensor 1',
    data: [
      { datetime: '2024-01-01T00:00:00Z', max: 10.5 },
      { datetime: '2024-01-01T01:00:00Z', max: 12.3 },
    ],
  },
  {
    name: 'Velocity Sensor 1',
    data: [
      { datetime: '2024-01-01T00:00:00Z', max: 25.0 },
      { datetime: '2024-01-01T01:00:00Z', max: 27.8 },
    ],
  },
  {
    name: 'Temperature Sensor 1',
    data: [
      { datetime: '2024-01-01T00:00:00Z', max: 22.5 },
      { datetime: '2024-01-01T01:00:00Z', max: 23.1 },
    ],
  },
  {
    name: 'Acceleration Sensor 2',
    data: [
      { datetime: '2024-01-01T00:00:00Z', max: 8.2 },
      { datetime: '2024-01-01T01:00:00Z', max: 9.1 },
    ],
  },
];

describe('sensorUtils', () => {
  describe('filterSensorsByType', () => {
    it('should filter acceleration sensors', () => {
      const result = filterSensorsByType(mockSensorData, 'acceleration');
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toContain('Acceleration');
      expect(result[1].name).toContain('Acceleration');
    });

    it('should filter velocity sensors', () => {
      const result = filterSensorsByType(mockSensorData, 'velocity');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toContain('Velocity');
    });

    it('should filter temperature sensors', () => {
      const result = filterSensorsByType(mockSensorData, 'temperature');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toContain('Temperature');
    });

    it('should return empty array for unknown type', () => {
      const result = filterSensorsByType(mockSensorData, 'unknown');
      
      expect(result).toHaveLength(0);
    });

    it('should handle empty data array', () => {
      const result = filterSensorsByType([], 'acceleration');
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getSensorTypes', () => {
    it('should return all sensor types', () => {
      const result = getSensorTypes(mockSensorData);
      
      expect(result).toHaveLength(3);
      expect(result).toContain('acceleration');
      expect(result).toContain('velocity');
      expect(result).toContain('temperature');
    });

    it('should return empty array for empty data', () => {
      const result = getSensorTypes([]);
      
      expect(result).toHaveLength(0);
    });

    it('should handle mixed case sensor names', () => {
      const mixedCaseData: SensorData[] = [
        { name: 'ACCELERATION sensor', data: [] },
        { name: 'velocity SENSOR', data: [] },
        { name: 'Temperature Sensor', data: [] },
      ];
      
      const result = getSensorTypes(mixedCaseData);
      
      expect(result).toHaveLength(3);
      expect(result).toContain('acceleration');
      expect(result).toContain('velocity');
      expect(result).toContain('temperature');
    });
  });

  describe('getSensorColor', () => {
    it('should return correct colors for known types', () => {
      expect(getSensorColor('acceleration')).toBe('#e74c3c');
      expect(getSensorColor('velocity')).toBe('#3498db');
      expect(getSensorColor('temperature')).toBe('#f39c12');
    });

    it('should return default color for unknown type', () => {
      expect(getSensorColor('unknown')).toBe('#1976d2');
    });
  });

  describe('getSensorDisplayName', () => {
    it('should return correct display names for known types', () => {
      expect(getSensorDisplayName('acceleration')).toBe('Aceleração');
      expect(getSensorDisplayName('velocity')).toBe('Velocidade');
      expect(getSensorDisplayName('temperature')).toBe('Temperatura');
    });

    it('should return type name for unknown type', () => {
      expect(getSensorDisplayName('unknown')).toBe('unknown');
    });
  });
});

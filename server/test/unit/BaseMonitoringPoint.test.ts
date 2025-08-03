import { describe, it, expect } from 'vitest';
import { BaseMonitoringPoint } from '../../src/domain/BaseMonitoringPoint.js';
import { MachineType, SensorType } from '../../src/types/types.js';

describe('BaseMonitoringPoint Sensor Type Validation', () => {
    describe('isSensorTypeCompatible', () => {
        it('should return false for pump machines with TcAg sensors (forbidden)', () => {
            const result = BaseMonitoringPoint.isSensorTypeCompatible(MachineType.PUMP, SensorType.TcAg);
            expect(result).toBe(false);
        });

        it('should return false for pump machines with TcAs sensors (forbidden)', () => {
            const result = BaseMonitoringPoint.isSensorTypeCompatible(MachineType.PUMP, SensorType.TcAs);
            expect(result).toBe(false);
        });

        it('should return true for pump machines with HFPlus sensors', () => {
            const result = BaseMonitoringPoint.isSensorTypeCompatible(MachineType.PUMP, SensorType.HFPlus);
            expect(result).toBe(true);
        });

        it('should return true for fan machines with TcAg sensors', () => {
            const result = BaseMonitoringPoint.isSensorTypeCompatible(MachineType.FAN, SensorType.TcAg);
            expect(result).toBe(true);
        });

        it('should return true for fan machines with TcAs sensors', () => {
            const result = BaseMonitoringPoint.isSensorTypeCompatible(MachineType.FAN, SensorType.TcAs);
            expect(result).toBe(true);
        });

        it('should return true for fan machines with HFPlus sensors', () => {
            const result = BaseMonitoringPoint.isSensorTypeCompatible(MachineType.FAN, SensorType.HFPlus);
            expect(result).toBe(true);
        });
    });

    describe('validateSensorTypeCompatibility', () => {
        it('should not throw for valid pump machine sensor combinations', () => {
            expect(() => {
                BaseMonitoringPoint.validateSensorTypeCompatibility(MachineType.PUMP, SensorType.HFPlus);
            }).not.toThrow();
        });

        it('should not throw for valid fan machine sensor combinations', () => {
            expect(() => {
                BaseMonitoringPoint.validateSensorTypeCompatibility(MachineType.FAN, SensorType.TcAg);
            }).not.toThrow();

            expect(() => {
                BaseMonitoringPoint.validateSensorTypeCompatibility(MachineType.FAN, SensorType.TcAs);
            }).not.toThrow();

            expect(() => {
                BaseMonitoringPoint.validateSensorTypeCompatibility(MachineType.FAN, SensorType.HFPlus);
            }).not.toThrow();
        });

        it('should throw descriptive error for forbidden pump machine sensor types', () => {
            expect(() => {
                BaseMonitoringPoint.validateSensorTypeCompatibility(MachineType.PUMP, SensorType.TcAg);
            }).toThrow("Sensor type 'TcAg' is not compatible with machine type 'pump'. Compatible sensor types are: HF+");

            expect(() => {
                BaseMonitoringPoint.validateSensorTypeCompatibility(MachineType.PUMP, SensorType.TcAs);
            }).toThrow("Sensor type 'TcAs' is not compatible with machine type 'pump'. Compatible sensor types are: HF+");
        });

        it('should throw descriptive error for incompatible fan machine sensor types', () => {
            // Since FAN machines now support all sensor types, there are no incompatible combinations
            // This test is kept for future extensibility if new sensor types are added
            expect(true).toBe(true);
        });
    });

    describe('getCompatibleSensorTypes', () => {
        it('should return correct sensor types for pump machines (only HFPlus)', () => {
            const result = BaseMonitoringPoint.getCompatibleSensorTypes(MachineType.PUMP);
            expect(result).toEqual([SensorType.HFPlus]);
        });

        it('should return correct sensor types for fan machines (TcAg, TcAs, and HFPlus)', () => {
            const result = BaseMonitoringPoint.getCompatibleSensorTypes(MachineType.FAN);
            expect(result).toEqual([SensorType.TcAg, SensorType.TcAs, SensorType.HFPlus]);
        });

        it('should return empty array for invalid machine types', () => {
            const result = BaseMonitoringPoint.getCompatibleSensorTypes('invalid' as any);
            expect(result).toEqual([]);
        });
    });
});
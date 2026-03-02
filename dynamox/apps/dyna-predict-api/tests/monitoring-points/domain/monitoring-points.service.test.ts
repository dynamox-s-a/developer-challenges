/**
 * @fileoverview Tests for the monitoring-points domain service.
 * Covers the isSensorForbiddenForMachine business rule:
 * Pump machines only accept HFPlus sensors; Fan machines accept any sensor.
 */
import { describe, expect } from 'vitest';
import { test } from '../../fixtures/fastify.fixture';
import { isSensorForbiddenForMachine } from '../../../src/monitoring-points/domain/monitoring-points.service';

describe('isSensorForbiddenForMachine', () => {
  describe('when machine is of type pump', () => {
    test('should return false for HFPlus sensor', () => {
      const result = isSensorForbiddenForMachine('Pump', 'HFPlus');

      expect(result).toBe(false);
    });

    test('should return true for TcAg sensor', () => {
      const result = isSensorForbiddenForMachine('Pump', 'TcAg');

      expect(result).toBe(true);
    });

    test('should return true for TcAs sensor', () => {
      const result = isSensorForbiddenForMachine('Pump', 'TcAs');

      expect(result).toBe(true);
    });
  });

  describe('when machine is of type fan', () => {
    (['HFPlus', 'TcAg', 'TcAs'] as const).forEach((sensorModel) => {
      test(`should return false for ${sensorModel} sensor`, () => {
        const result = isSensorForbiddenForMachine('Fan', sensorModel);

        expect(result).toBe(false);
      });
    });
  });
});

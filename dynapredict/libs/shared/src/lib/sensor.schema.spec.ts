import { isSensorModelAllowed, SENSOR_MODELS } from './sensor.schema.ts';

describe('isSensorModelAllowed', () => {
  it('should not allow TcAg or TcAs on a Pump', () => {
    expect(isSensorModelAllowed('Pump', 'TcAg')).toBe(false);
    expect(isSensorModelAllowed('Pump', 'TcAs')).toBe(false);
  });

  it('should allow HF+ on a Pump', () => {
    expect(isSensorModelAllowed('Pump', 'HF+')).toBe(true);
  });

  it('should allow every model on a Fan', () => {
    for (const model of SENSOR_MODELS) {
      expect(isSensorModelAllowed('Fan', model)).toBe(true);
    }
  });
});
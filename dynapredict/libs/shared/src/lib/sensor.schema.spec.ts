import {
  isSensorModelAllowed,
  SENSOR_MODELS,
  sensorSchema,
} from './sensor.schema.ts';

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

describe('sensorSchema', () => {
  it('should accept each model with its own serial number prefix', () => {
    const sensors = [
      { model: 'TcAg', serialNumber: 'DyL1.01.A0000' },
      { model: 'TcAs', serialNumber: 'DyL0.01.A0000' },
      { model: 'HF+', serialNumber: 'DyL4.01.A0000' },
    ];
    for (const sensor of sensors) {
      expect(sensorSchema.safeParse(sensor).success).toBe(true);
    }
  });

  it('should accept the serial number in any case and normalize it', () => {
    const sensor = sensorSchema.parse({
      model: 'TcAg',
      serialNumber: '  dyl1.02.b1234  ',
    });
    expect(sensor.serialNumber).toBe('DyL1.02.B1234');
  });

  it('should reject a serial number in the wrong format', () => {
    const serialNumbers = [
      'DyL4.1.A0000',
      'DyL4.01.00000',
      'DyL4.01.A000',
      'ABC4.01.A0000',
      'DyL4-01-A0000',
    ];
    for (const serialNumber of serialNumbers) {
      const result = sensorSchema.safeParse({ model: 'HF+', serialNumber });
      expect(result.success).toBe(false);
    }
  });

  it('should show a single message when the format is wrong', () => {
    const result = sensorSchema.safeParse({
      model: 'HF+',
      serialNumber: 'abc',
    });
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Use o formato DyL4.01.A0000',
    ]);
  });

  it('should reject a serial number from another model', () => {
    const result = sensorSchema.safeParse({
      model: 'TcAg',
      serialNumber: 'DyL4.01.A0000',
    });
    expect(result.error?.issues).toMatchObject([
      {
        path: ['serialNumber'],
        message: 'O número de série de um sensor TcAg começa com DyL1',
      },
    ]);
  });

  it('should reject an unknown model', () => {
    const result = sensorSchema.safeParse({
      model: 'TcXX',
      serialNumber: 'DyL4.01.A0000',
    });
    expect(result.success).toBe(false);
  });
});

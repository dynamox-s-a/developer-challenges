import { buildMachineTag } from './tag.js';

describe('buildMachineTag', () => {
  it('builds the tag from sector, type and number', () => {
    expect(buildMachineTag('DRY', 'Fan', 1)).toBe('DRY-FAN-01');
    expect(buildMachineTag('DRY', 'Pump', 12)).toBe('DRY-PUMP-12');
  });

  it('pads to two digits without truncating longer numbers', () => {
    expect(buildMachineTag('DRY', 'Fan', 9)).toBe('DRY-FAN-09');
    expect(buildMachineTag('DRY', 'Fan', 100)).toBe('DRY-FAN-100');
    expect(buildMachineTag('DRY', 'Fan', 999)).toBe('DRY-FAN-999');
  });

  it('accepts 1 and 999 and rejects 0, 1000, negatives and fractions', () => {
    expect(buildMachineTag('DRY', 'Fan', 1)).toBe('DRY-FAN-01');
    expect(() => buildMachineTag('DRY', 'Fan', 0)).toThrow(RangeError);
    expect(() => buildMachineTag('DRY', 'Fan', 1000)).toThrow(RangeError);
    expect(() => buildMachineTag('DRY', 'Fan', -1)).toThrow(RangeError);
    expect(() => buildMachineTag('DRY', 'Fan', 1.5)).toThrow(RangeError);
  });
});

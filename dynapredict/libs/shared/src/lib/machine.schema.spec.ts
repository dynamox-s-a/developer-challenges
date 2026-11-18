import { machineSchema } from './machine.schema.ts';

describe('machineSchema', () => {
  it('should accept a valid machine', () => {
    const result = machineSchema.safeParse({ name: 'Bomba 01', type: 'Pump' });
    expect(result.success).toBe(true);
  });

  it('should trim the name', () => {
    const machine = machineSchema.parse({ name: '  Bomba 01  ', type: 'Pump' });
    expect(machine.name).toBe('Bomba 01');
  });

  it('should reject a blank name', () => {
    const result = machineSchema.safeParse({ name: '   ', type: 'Fan' });
    expect(result.success).toBe(false);
  });

  it('should reject a name longer than 100 characters', () => {
    const result = machineSchema.safeParse({
      name: 'a'.repeat(101),
      type: 'Fan',
    });
    expect(result.success).toBe(false);
  });

  it('should reject an unknown type', () => {
    const result = machineSchema.safeParse({ name: 'Motor 01', type: 'Motor' });
    expect(result.success).toBe(false);
  });
});
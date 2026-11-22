import { monitoringPointSchema } from './monitoring-point.schema.ts';

describe('monitoringPointSchema', () => {
  it('should accept a valid monitoring point', () => {
    const result = monitoringPointSchema.safeParse({ name: 'Mancal LA' });
    expect(result.success).toBe(true);
  });

  it('should trim the name', () => {
    const point = monitoringPointSchema.parse({ name: '  Mancal LA  ' });
    expect(point.name).toBe('Mancal LA');
  });

  it('should reject a blank name', () => {
    const result = monitoringPointSchema.safeParse({ name: '   ' });
    expect(result.success).toBe(false);
  });

  it('should reject a name longer than 100 characters', () => {
    const result = monitoringPointSchema.safeParse({ name: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });
});

import {
  monitoringPointListQuerySchema,
  monitoringPointSchema,
} from './monitoring-point.schema.ts';

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

describe('monitoringPointListQuerySchema', () => {
  it('should use the defaults when the url has no parameters', () => {
    expect(monitoringPointListQuerySchema.parse({})).toEqual({
      page: 1,
      pageSize: 5,
      sortBy: 'machineName',
      order: 'asc',
    });
  });

  it('should convert the numbers that come as text in the url', () => {
    const query = monitoringPointListQuerySchema.parse({
      page: '2',
      pageSize: '10',
      sortBy: 'sensorModel',
      order: 'desc',
    });
    expect(query).toEqual({
      page: 2,
      pageSize: 10,
      sortBy: 'sensorModel',
      order: 'desc',
    });
  });

  it('should reject invalid parameters', () => {
    const invalid = [
      { page: '0' },
      { page: 'abc' },
      { page: '1.5' },
      { pageSize: '51' },
      { sortBy: 'id' },
      { order: 'up' },
    ];
    for (const query of invalid) {
      const result = monitoringPointListQuerySchema.safeParse(query);
      expect(result.success).toBe(false);
    }
  });
});

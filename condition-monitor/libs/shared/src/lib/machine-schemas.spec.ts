import {
  createMachineSchema,
  listMachinesQuerySchema,
  nextNumberQuerySchema,
  updateMachineSchema,
} from './machine-schemas.js';

const sectorId = '11111111-1111-4111-8111-111111111111';

function errorsOf(
  schema: { safeParse: (input: unknown) => { success: boolean; error?: unknown } },
  input: unknown,
) {
  const result = schema.safeParse(input) as {
    success: boolean;
    error?: { issues: { path: PropertyKey[]; message: string }[] };
  };
  return result.success
    ? []
    : (result.error?.issues ?? []).map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
}

describe('createMachineSchema', () => {
  const valid = { sectorId, type: 'Fan', number: 1, name: 'Hood exhaust fan' };

  it('accepts a machine and trims its name', () => {
    expect(createMachineSchema.parse({ ...valid, name: '  Hood exhaust fan ' })).toEqual(valid);
  });

  it('accepts numbers 1 and 999 and rejects 0, 1000 and fractions', () => {
    expect(errorsOf(createMachineSchema, { ...valid, number: 999 })).toEqual([]);
    for (const number of [0, 1000, 1.5]) {
      expect(errorsOf(createMachineSchema, { ...valid, number })).toEqual([
        { field: 'number', message: 'Must be a whole number from 1 to 999.' },
      ]);
    }
  });

  it('accepts only the types of the challenge', () => {
    expect(errorsOf(createMachineSchema, { ...valid, type: 'Pump' })).toEqual([]);
    expect(errorsOf(createMachineSchema, { ...valid, type: 'Compressor' })).toEqual([
      { field: 'type', message: 'Must be one of: Pump, Fan.' },
    ]);
  });

  it('accepts a name of 100 characters and rejects 101 or only spaces', () => {
    expect(errorsOf(createMachineSchema, { ...valid, name: 'N'.repeat(100) })).toEqual([]);
    expect(errorsOf(createMachineSchema, { ...valid, name: 'N'.repeat(101) })).toHaveLength(1);
    expect(errorsOf(createMachineSchema, { ...valid, name: '  ' })).toEqual([
      { field: 'name', message: 'Required.' },
    ]);
  });

  it('rejects a sector id that is not a UUID', () => {
    expect(errorsOf(createMachineSchema, { ...valid, sectorId: 'DRY' })).toEqual([
      { field: 'sectorId', message: 'Must be a valid id.' },
    ]);
  });
});

describe('updateMachineSchema', () => {
  it('accepts a single field, and rejects an empty change', () => {
    expect(updateMachineSchema.parse({ type: 'Pump' })).toEqual({ type: 'Pump' });
    expect(errorsOf(updateMachineSchema, {})).toEqual([
      { field: '', message: 'Send at least one field to change.' },
    ]);
  });
});

describe('listMachinesQuerySchema', () => {
  it('applies the contract defaults: page 1 of 10, sorted by tag, ascending', () => {
    expect(listMachinesQuerySchema.parse({})).toEqual({
      page: 1,
      pageSize: 10,
      sort: 'tag',
      order: 'asc',
    });
  });

  it('reads numbers from the text of a URL', () => {
    expect(
      listMachinesQuerySchema.parse({ page: '3', pageSize: '100', sort: 'name', order: 'desc' }),
    ).toMatchObject({ page: 3, pageSize: 100, sort: 'name', order: 'desc' });
  });

  it('rejects page 0, a page size over 100 and unknown sort keys, naming each', () => {
    expect(errorsOf(listMachinesQuerySchema, { page: '0' })).toEqual([
      { field: 'page', message: 'Must be a whole number from 1.' },
    ]);
    expect(errorsOf(listMachinesQuerySchema, { pageSize: '101' })).toEqual([
      { field: 'pageSize', message: 'Must be a whole number from 1 to 100.' },
    ]);
    expect(errorsOf(listMachinesQuerySchema, { page: 'abc' })).toEqual([
      { field: 'page', message: 'Must be a whole number from 1.' },
    ]);
    expect(errorsOf(listMachinesQuerySchema, { sort: 'number' })).toEqual([
      { field: 'sort', message: 'Must be one of: tag, name, type, sector.' },
    ]);
  });
});

describe('nextNumberQuerySchema', () => {
  it('needs a sector and a type', () => {
    expect(nextNumberQuerySchema.parse({ sectorId, type: 'Fan' })).toEqual({
      sectorId,
      type: 'Fan',
    });
    expect(errorsOf(nextNumberQuerySchema, {}).map((error) => error.field)).toEqual([
      'sectorId',
      'type',
    ]);
  });
});

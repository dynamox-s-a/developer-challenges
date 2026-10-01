import { createSectorSchema, updateSectorSchema } from './sector.js';

function errorsOf(schema: typeof createSectorSchema | typeof updateSectorSchema, input: unknown) {
  const result = schema.safeParse(input);
  return result.success
    ? []
    : result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
}

describe('createSectorSchema', () => {
  it('trims and uppercases the code, and trims the name', () => {
    expect(createSectorSchema.parse({ code: ' dry ', name: '  Drying section ' })).toEqual({
      code: 'DRY',
      name: 'Drying section',
    });
  });

  it('accepts codes of 2 and 10 characters and rejects 1 and 11', () => {
    expect(errorsOf(createSectorSchema, { code: 'DR', name: 'A' })).toEqual([]);
    expect(errorsOf(createSectorSchema, { code: 'PM1DRY2026', name: 'A' })).toEqual([]);
    for (const code of ['D', 'PM1DRY20261']) {
      expect(errorsOf(createSectorSchema, { code, name: 'A' })).toEqual([
        { field: 'code', message: 'Must be 2 to 10 letters or digits.' },
      ]);
    }
  });

  it('rejects symbols and inner spaces in the code', () => {
    for (const code of ['PM-1', 'DR Y', 'DRÝ']) {
      expect(errorsOf(createSectorSchema, { code, name: 'A' })).toHaveLength(1);
    }
  });

  it('accepts a name of 100 characters and rejects 101 or only spaces', () => {
    expect(errorsOf(createSectorSchema, { code: 'DRY', name: 'N'.repeat(100) })).toEqual([]);
    expect(errorsOf(createSectorSchema, { code: 'DRY', name: 'N'.repeat(101) })).toEqual([
      { field: 'name', message: 'Must be at most 100 characters.' },
    ]);
    expect(errorsOf(createSectorSchema, { code: 'DRY', name: '   ' })).toEqual([
      { field: 'name', message: 'Required.' },
    ]);
  });
});

describe('updateSectorSchema', () => {
  it('accepts a single field', () => {
    expect(updateSectorSchema.parse({ name: 'Paper machine 1 drying' })).toEqual({
      name: 'Paper machine 1 drying',
    });
    expect(updateSectorSchema.parse({ code: 'pm1' })).toEqual({ code: 'PM1' });
  });

  it('rejects a body with nothing to change', () => {
    expect(errorsOf(updateSectorSchema, {})).toEqual([
      { field: '', message: 'Send at least one field to change.' },
    ]);
  });

  it('still validates the fields it receives', () => {
    expect(errorsOf(updateSectorSchema, { code: 'D' })).toHaveLength(1);
  });
});

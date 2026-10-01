import {
  createPositionsSchema,
  installSensorSchema,
  listPointsQuerySchema,
  updatePointSchema,
} from './point-schemas.js';

function errorsOf(
  schema: { safeParse: (input: unknown) => { success: boolean } },
  input: unknown,
): { field: string; message: string }[] {
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

describe('createPositionsSchema', () => {
  it('accepts several positions, with or without a name, and trims names', () => {
    expect(
      createPositionsSchema.parse({
        positions: [{ location: 'PUMP_MOTOR_DE' }, { location: 'OTHER', name: '  Casing ' }],
      }),
    ).toEqual({
      positions: [{ location: 'PUMP_MOTOR_DE' }, { location: 'OTHER', name: 'Casing' }],
    });
  });

  it('rejects an empty selection', () => {
    expect(errorsOf(createPositionsSchema, { positions: [] })).toEqual([
      { field: 'positions', message: 'Select at least one position.' },
    ]);
  });

  it('rejects the same position twice in one request, but lets OTHER repeat', () => {
    expect(
      errorsOf(createPositionsSchema, {
        positions: [{ location: 'OTHER' }, { location: 'OTHER' }],
      }),
    ).toEqual([]);
    expect(
      errorsOf(createPositionsSchema, {
        positions: [{ location: 'FAN_SHAFT_DE' }, { location: 'FAN_SHAFT_DE' }],
      }),
    ).toEqual([{ field: 'positions.1.location', message: 'This position is selected twice.' }]);
  });

  it('rejects an unknown position and a name over 100 characters', () => {
    expect(
      errorsOf(createPositionsSchema, {
        positions: [{ location: 'TAIL_BEARING' }, { location: 'OTHER', name: 'N'.repeat(101) }],
      }),
    ).toEqual([
      { field: 'positions.0.location', message: 'Must be a known position.' },
      { field: 'positions.1.name', message: 'Must be at most 100 characters.' },
    ]);
  });
});

describe('updatePointSchema', () => {
  it('accepts a single field and rejects an empty change', () => {
    expect(updatePointSchema.parse({ name: 'Motor, coupling side' })).toEqual({
      name: 'Motor, coupling side',
    });
    expect(errorsOf(updatePointSchema, {})).toEqual([
      { field: '', message: 'Send at least one field to change.' },
    ]);
  });
});

describe('installSensorSchema', () => {
  it('trims and uppercases the serial number', () => {
    expect(installSensorSchema.parse({ serialNumber: ' dx-0012 ', model: 'HF+' })).toEqual({
      serialNumber: 'DX-0012',
      model: 'HF+',
    });
  });

  it('accepts serials of 3 and 40 characters and rejects 2, 41 and other symbols', () => {
    for (const serialNumber of ['DX1', 'D'.repeat(40)]) {
      expect(errorsOf(installSensorSchema, { serialNumber, model: 'TcAg' })).toEqual([]);
    }
    for (const serialNumber of ['DX', 'D'.repeat(41), 'DX 0012', 'DX_0012']) {
      expect(errorsOf(installSensorSchema, { serialNumber, model: 'TcAg' })).toEqual([
        { field: 'serialNumber', message: 'Must be 3 to 40 letters, digits or hyphens.' },
      ]);
    }
  });

  it('accepts only the three challenge models', () => {
    expect(errorsOf(installSensorSchema, { serialNumber: 'DX-1', model: 'HF' })).toEqual([
      { field: 'model', message: 'Must be one of: TcAg, TcAs, HF+.' },
    ]);
  });
});

describe('listPointsQuerySchema', () => {
  it('shows 5 points per page by default, sorted by machine name (the challenge list)', () => {
    expect(listPointsQuerySchema.parse({})).toEqual({
      page: 1,
      pageSize: 5,
      sort: 'machineName',
      order: 'asc',
    });
  });

  it('sorts by each of the four required columns, and rejects other keys', () => {
    for (const sort of ['machineName', 'machineType', 'monitoringPointName', 'sensorModel']) {
      expect(listPointsQuerySchema.parse({ sort })).toMatchObject({ sort });
    }
    expect(errorsOf(listPointsQuerySchema, { sort: 'serialNumber' })).toHaveLength(1);
  });
});

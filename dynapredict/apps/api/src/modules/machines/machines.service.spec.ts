import {
  createMachine,
  deleteMachine,
  getMachine,
  listMachines,
  updateMachine,
} from './machines.service.ts';

// As funções falsas do banco (prisma.machine.*), criadas antes do vi.mock
const db = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../../lib/prisma.ts', () => ({ prisma: { machine: db } }));

const machine = {
  id: 'machine-1',
  name: 'Bomba 01',
  type: 'Pump',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('machines service', () => {
  // Zera as respostas e o histórico de chamadas de todas as funções falsas
  beforeEach(() => vi.resetAllMocks());

  it('should list the machines, newest first', async () => {
    db.findMany.mockResolvedValue([machine]);

    await expect(listMachines()).resolves.toEqual([machine]);
    expect(db.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should return the machine when it exists', async () => {
    db.findUnique.mockResolvedValue(machine);

    await expect(getMachine('machine-1')).resolves.toEqual(machine);
    expect(db.findUnique).toHaveBeenCalledWith({ where: { id: 'machine-1' } });
  });

  it('should reject with 404 when the machine does not exist', async () => {
    db.findUnique.mockResolvedValue(null);

    await expect(getMachine('nao-existe')).rejects.toMatchObject({
      statusCode: 404,
      code: 'NOT_FOUND',
    });
  });

  it('should create a machine with the validated data', async () => {
    db.create.mockResolvedValue(machine);

    await createMachine({ name: 'Bomba 01', type: 'Pump' });

    expect(db.create).toHaveBeenCalledWith({
      data: { name: 'Bomba 01', type: 'Pump' },
    });
  });

  it('should update a machine that exists', async () => {
    db.findUnique.mockResolvedValue(machine);
    db.update.mockResolvedValue({ ...machine, name: 'Bomba 02' });

    const result = await updateMachine('machine-1', {
      name: 'Bomba 02',
      type: 'Pump',
    });

    expect(result.name).toBe('Bomba 02');
    expect(db.update).toHaveBeenCalledWith({
      where: { id: 'machine-1' },
      data: { name: 'Bomba 02', type: 'Pump' },
    });
  });

  it('should not update a machine that does not exist', async () => {
    db.findUnique.mockResolvedValue(null);

    await expect(
      updateMachine('nao-existe', { name: 'Bomba 02', type: 'Pump' }),
    ).rejects.toMatchObject({ statusCode: 404 });
    expect(db.update).not.toHaveBeenCalled();
  });

  it('should delete a machine that exists', async () => {
    db.findUnique.mockResolvedValue(machine);

    await deleteMachine('machine-1');

    expect(db.delete).toHaveBeenCalledWith({ where: { id: 'machine-1' } });
  });

  it('should not delete a machine that does not exist', async () => {
    db.findUnique.mockResolvedValue(null);

    await expect(deleteMachine('nao-existe')).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(db.delete).not.toHaveBeenCalled();
  });
});

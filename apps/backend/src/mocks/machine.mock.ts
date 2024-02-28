export const mockedMachines = [
  {
    id: 1,
    name: 'Machine 1',
    type: 'Pump',
    userId: 1,
  },
  {
    id: 2,
    name: 'Machine 2',
    type: 'Pump',
    userId: 1,
  },
  {
    id: 3,
    name: 'Machine 3',
    type: 'Fan',
    userId: 1,
  },
];

export const mockedMachinesPrisma = {
  machine: {
    create: jest.fn().mockReturnValue(mockedMachines[1]),
    findUnique: jest.fn().mockImplementation(args => {
      if (args.where.id >= mockedMachines.length) {
        return null;
      }
      return mockedMachines[0];
    }),
    findFirst: jest.fn().mockImplementation(args => {
      if (args.where.id >= mockedMachines.length) {
        return null;
      }
      return mockedMachines[0];
    }),
    findMany: jest.fn().mockResolvedValue(mockedMachines),
    update: jest.fn().mockResolvedValue(mockedMachines[0]),
    delete: jest.fn(),
  },
};

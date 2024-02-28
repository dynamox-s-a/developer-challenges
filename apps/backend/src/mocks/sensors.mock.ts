export const mockedSensors = [
  {
    id: 1,
    model: 'TcAg',
  },
  {
    id: 2,
    model: 'TcAs',
  },
  {
    id: 3,
    model: 'HF+',
  },
];

export const mockedSensorsPrisma = {
  sensor: {
    create: jest.fn().mockReturnValue(mockedSensors[1]),
    findUnique: jest.fn().mockImplementation(args => {
      if (args.where.id >= mockedSensors.length) {
        return null;
      }
      return mockedSensors[0];
    }),
    findMany: jest.fn().mockResolvedValue(mockedSensors),
    update: jest.fn().mockResolvedValue(mockedSensors[0]),
    delete: jest.fn(),
  },
};

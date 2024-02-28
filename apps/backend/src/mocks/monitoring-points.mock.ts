const mockedSensors = [
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
  {
    id: 4,
    model: 'TcAg',
  },
  {
    id: 5,
    model: 'TcAs',
  },
  {
    id: 6,
    model: 'HF+',
  },
];

const mockedMachines = [
  {
    id: 1,
    name: 'Machine 1',
  },
  {
    id: 2,
    name: 'Machine 2',
  },
  {
    id: 3,
    name: 'Machine 3',
  },
  {
    id: 4,
    name: 'Machine 4',
  },
  {
    id: 5,
    name: 'Machine 5',
  },
  {
    id: 6,
    name: 'Machine 6',
  },
];

export const mockedMonitoringPoints = [
  {
    id: 1,
    name: 'Monitoring Point 1',
    machineId: 1,
    sensorId: 1,
  },
  {
    id: 2,
    name: 'Monitoring Point 2',
    machineId: 1,
    sensorId: 2,
  },
  {
    id: 3,
    name: 'Monitoring Point 3',
    machineId: 2,
    sensorId: 3,
  },
  {
    id: 4,
    name: 'Monitoring Point 4',
    machineId: 2,
    sensorId: 4,
  },
];

export const mockedMonitoringPointsPrisma = {
  monitoringPoint: {
    create: jest.fn().mockReturnValue(mockedMonitoringPoints[0]),
    findUnique: jest.fn().mockImplementation(args => {
      if (args.where.id >= mockedMonitoringPoints.length) {
        return null;
      }
      return mockedMonitoringPoints[0];
    }),
    findFirst: jest.fn().mockImplementation(args => {
      if (args.where.sensorId === 1) {
        return null;
      }
      return mockedMonitoringPoints[0];
    }),
    findMany: jest.fn().mockResolvedValue(mockedMonitoringPoints),
    update: jest.fn().mockResolvedValue(mockedMonitoringPoints[0]),
    delete: jest.fn(),
  },
  sensor: {
    findUnique: jest.fn().mockImplementation(args => {
      if (args.where.id >= mockedSensors.length) {
        return null;
      }
      return mockedSensors[1];
    }),
  },
  machine: {
    findUnique: jest.fn().mockImplementation(args => {
      if (args.where.id >= mockedMachines.length) {
        return null;
      }
      return mockedMachines[1];
    }),
  }
};

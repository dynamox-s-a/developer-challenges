import { Simulator } from './main';
import * as amqp from 'amqplib';
import { prisma } from '@source/persistence';

jest.mock('amqplib');
jest.mock('@source/persistence', () => ({
  prisma: {
    sensor: {
      findMany: jest.fn(),
    },
  },
}));

describe('Simulator', () => {
  let simulator: Simulator;
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(() => {
    simulator = new Simulator();
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue({}),
      sendToQueue: jest.fn(),
    };
    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };
    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    simulator.stop();
    jest.useRealTimers();
  });

  it('should start and send telemetry data', async () => {
    const sensors = [{ id: 'sensor-1' }, { id: 'sensor-2' }];
    (prisma.sensor.findMany as jest.Mock).mockResolvedValue(sensors);

    await simulator.start();

    expect(amqp.connect).toHaveBeenCalled();
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('telemetry_queue', { durable: true });
    expect(prisma.sensor.findMany).toHaveBeenCalled();

    // Advance timers by 2 seconds
    jest.advanceTimersByTime(2000);

    expect(mockChannel.sendToQueue).toHaveBeenCalledTimes(2);
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'telemetry_queue',
      expect.any(Buffer)
    );
  });

  it('should log error if connection fails', async () => {
    (amqp.connect as jest.Mock).mockRejectedValue(new Error('Connection Error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await simulator.start();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Simulator error:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  it('should exit if no sensors found', async () => {
    (prisma.sensor.findMany as jest.Mock).mockResolvedValue([]);
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await simulator.start();

    expect(processExitSpy).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('No sensors found'));

    processExitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

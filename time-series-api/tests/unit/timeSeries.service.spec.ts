import { AppError } from '../../src/errors/app-error';
import { timeSeriesService } from '../../src/services/timeSeries.service';
import { timeSeriesRepository } from '../../src/repositories/timeSeries.repository';

jest.mock('../../src/repositories/timeSeries.repository', () => ({
  timeSeriesRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
    deleteById: jest.fn(),
  },
}));

describe('TimeSeriesService', () => {
  const mockedRepository = timeSeriesRepository as jest.Mocked<typeof timeSeriesRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a time series', async () => {
    const input = {
      name: 'sensor-a',
      samples: [
        { timestamp: new Date('2026-04-11T10:00:00.000Z'), value: 10 },
      ],
    };

    mockedRepository.create.mockResolvedValue({
      _id: 'abc123',
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await timeSeriesService.create(input);

    expect(mockedRepository.create).toHaveBeenCalledWith(input);
    expect(result.name).toBe('sensor-a');
  });

  it('should return time series by id', async () => {
    mockedRepository.findById.mockResolvedValue({
      _id: 'abc123',
      name: 'sensor-a',
      samples: [{ timestamp: new Date('2026-04-11T10:00:00.000Z'), value: 10 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await timeSeriesService.getById('abc123');

    expect(mockedRepository.findById).toHaveBeenCalledWith('abc123');
    expect(result._id).toBe('abc123');
  });

  it('should throw not found when getById does not find a time series', async () => {
    mockedRepository.findById.mockResolvedValue(null);

    await expect(timeSeriesService.getById('abc123')).rejects.toEqual(
      new AppError('Time series not found', 404)
    );
  });

  it('should return count', async () => {
    mockedRepository.count.mockResolvedValue(5);

    const result = await timeSeriesService.count();

    expect(result).toBe(5);
  });

  it('should delete a time series by id', async () => {
    mockedRepository.deleteById.mockResolvedValue({
      _id: 'abc123',
    } as any);

    await expect(timeSeriesService.deleteById('abc123')).resolves.toBeUndefined();
    expect(mockedRepository.deleteById).toHaveBeenCalledWith('abc123');
  });

  it('should throw not found when deleteById does not find a time series', async () => {
    mockedRepository.deleteById.mockResolvedValue(null);

    await expect(timeSeriesService.deleteById('abc123')).rejects.toEqual(
      new AppError('Time series not found', 404)
    );
  });

  it('should return metrics by id', async () => {
    mockedRepository.findById.mockResolvedValue({
      _id: 'abc123',
      name: 'sensor-a',
      samples: [
        { timestamp: new Date('2026-04-11T10:00:00.000Z'), value: 10 },
        { timestamp: new Date('2026-04-11T10:00:01.000Z'), value: 20 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await timeSeriesService.getMetricsById('abc123');

    expect(result).toEqual({
      count: 2,
      min: 10,
      max: 20,
      sum: 30,
      average: 15,
      range: 10,
      firstTimestamp: new Date('2026-04-11T10:00:00.000Z'),
      lastTimestamp: new Date('2026-04-11T10:00:01.000Z'),
    });
  });
});
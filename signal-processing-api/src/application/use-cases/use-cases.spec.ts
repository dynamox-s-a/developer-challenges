import { Test, TestingModule } from '@nestjs/testing';
import { StoreTimeSeriesUseCase } from './store-time-series.use-case';
import { TIME_SERIES_REPOSITORY, ITimeSeriesRepository } from '../../domain/repositories/time-series.repository';
import { StoreTimeSeriesDto } from '../dtos/store-time-series.dto';
import { GetMetricsUseCase } from './get-metrics.use-case';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  save: jest.fn(),
  getMetrics: jest.fn(),
  count: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
});

describe('Application Use Cases', () => {
  let storeUseCase: StoreTimeSeriesUseCase;
  let metricsUseCase: GetMetricsUseCase;
  let repository: jest.Mocked<ITimeSeriesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreTimeSeriesUseCase,
        GetMetricsUseCase,
        { provide: TIME_SERIES_REPOSITORY, useFactory: mockRepository },
      ],
    }).compile();

    storeUseCase = module.get<StoreTimeSeriesUseCase>(StoreTimeSeriesUseCase);
    metricsUseCase = module.get<GetMetricsUseCase>(GetMetricsUseCase);
    repository = module.get(TIME_SERIES_REPOSITORY);
  });

  describe('StoreTimeSeriesUseCase', () => {
    it('should correctly save a valid time series via repository', async () => {
      const dto: StoreTimeSeriesDto = {
        name: 'acc/x',
        sensorId: 's1',
        sampleRate: 1000,
        unit: 'g',
        data: [{ datetime: '2023-11-07T11:53:38.187Z', value: 0.1 }]
      };

      repository.save.mockResolvedValue('new-id');

      const id = await storeUseCase.execute(dto);

      expect(id).toBe('new-id');
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('GetMetricsUseCase', () => {
    it('should return metrics for a valid ID', async () => {
      repository.getMetrics.mockResolvedValue([{
        name: 'acc/x',
        data: [{ datetime: '2023-11-07T11:53:38.187Z', max: 10 }]
      }]);

      const result = await metricsUseCase.execute('valid-id');

      expect(result[0].name).toBe('acc/x');
      expect(result[0].data[0].max).toBe(10);
    });

    it('should throw NotFoundException for invalid ID', async () => {
      repository.getMetrics.mockResolvedValue([]);
      await expect(metricsUseCase.execute('not-exists')).rejects.toThrow(NotFoundException);
    });
  });
});

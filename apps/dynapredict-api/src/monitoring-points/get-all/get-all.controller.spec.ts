import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointsService } from '../monitoring-points.service';
import { GetAllController } from './get-all.controller';
import { QueryDto } from './query.dto';

class MockMonitoringPointsService {
  findAll = jest.fn();
  findAllPaginated = jest.fn();
}

describe('GetAllController', () => {
  let controller: GetAllController;
  let service: MockMonitoringPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllController],
      providers: [
        {
          provide: MonitoringPointsService,
          useClass: MockMonitoringPointsService,
        },
      ],
    }).compile();

    controller = module.get<GetAllController>(GetAllController);
    service = module.get<MockMonitoringPointsService>(MonitoringPointsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMonitoringPoints', () => {
    it('should call monitoringPointsService.findAll with correct parameters and return the result', async () => {
      const user = { id: 1, email: 'test@test.com' };
      const expectedResult = [
        { id: 'Monitoring Point A' },
        { id: 'Monitoring Point B' },
      ];

      service.findAll.mockResolvedValue(expectedResult);

      const result = await controller.getMonitoringPoints(user);

      expect(service.findAll).toHaveBeenCalledWith(user.id);
      expect(result).toBe(expectedResult);
    });

    it('should handle empty results gracefully', async () => {
      const user = { id: 1, email: 'test@test.com' };
      const expectedResult = [];

      service.findAll.mockResolvedValue(expectedResult);

      const result = await controller.getMonitoringPoints(user);

      expect(service.findAll).toHaveBeenCalledWith(user.id);
      expect(result).toBe(expectedResult);
    });

    it('should throw an error if monitoringPointsService.findAll fails', async () => {
      const user = { id: 1, email: 'test@test.com' };
      const error = new Error('Service failure');

      service.findAll.mockRejectedValue(error);

      await expect(controller.getMonitoringPoints(user)).rejects.toThrow(
        'Service failure'
      );
      expect(service.findAll).toHaveBeenCalledWith(user.id);
    });
  });

  describe('getPaginatedMonitoringPoints', () => {
    it('should call monitoringPointsService.findAllPaginated with correct parameters and return the result', async () => {
      const query: QueryDto = {
        page: 2,
        sortBy: 'machine_type',
        sortOrder: 'asc',
      };
      const user = { id: 1, email: 'test@test.com' };
      const expectedResult = [
        { id: 'Monitoring Point A' },
        { id: 'Monitoring Point B' },
      ];

      service.findAllPaginated.mockResolvedValue(expectedResult);

      const result = await controller.getPaginatedMonitoringPoints(query, user);

      expect(service.findAllPaginated).toHaveBeenCalledWith(query, user.id);
      expect(result).toBe(expectedResult);
    });

    it('should handle empty results gracefully', async () => {
      const query: QueryDto = {};
      const user = { id: 1, email: 'test@test.com' };
      const expectedResult = [];

      service.findAllPaginated.mockResolvedValue(expectedResult);

      const result = await controller.getPaginatedMonitoringPoints(query, user);

      expect(service.findAllPaginated).toHaveBeenCalledWith(query, user.id);
      expect(result).toBe(expectedResult);
    });

    it('should throw an error if monitoringPointsService.findAllPaginated fails', async () => {
      const query: QueryDto = {};
      const user = { id: 1, email: 'test@test.com' };
      const error = new Error('Service failure');

      service.findAllPaginated.mockRejectedValue(error);

      await expect(
        controller.getPaginatedMonitoringPoints(query, user)
      ).rejects.toThrow('Service failure');
      expect(service.findAllPaginated).toHaveBeenCalledWith(query, user.id);
    });
  });
});

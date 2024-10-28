import { Test, TestingModule } from '@nestjs/testing';
import { AuthUser } from '../auth/user.decorator';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MonitoringPointsService } from './monitoring-points.service';

class MockMonitoringPointsService {
  create = jest.fn();
  remove = jest.fn();
}

describe('MonitoringPointsController', () => {
  let controller: MonitoringPointsController;
  let service: MockMonitoringPointsService;

  const mockUser: AuthUser = { id: 1, email: 'test@test.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringPointsController],
      providers: [
        {
          provide: MonitoringPointsService,
          useClass: MockMonitoringPointsService,
        },
      ],
    }).compile();

    controller = module.get<MonitoringPointsController>(
      MonitoringPointsController
    );
    service = module.get<MockMonitoringPointsService>(MonitoringPointsService);
  });

  describe('create', () => {
    it('should call MonitoringPointsService.create with correct parameters', async () => {
      const machineId = 1;
      const dto: CreateMonitoringPointDto = {
        name: 'Test',
      };
      const result = { id: 1, ...dto };

      service.create.mockResolvedValue(result);

      const response = await controller.create(machineId, mockUser, dto);

      expect(service.create).toHaveBeenCalledWith(machineId, mockUser.id, dto);
      expect(response).toEqual(result);
    });

    it('should handle service exceptions', async () => {
      const machineId = 1;
      const dto: CreateMonitoringPointDto = {
        name: 'Test',
      };
      const error = new Error('Service error');

      service.create.mockRejectedValue(error);

      await expect(controller.create(machineId, mockUser, dto)).rejects.toThrow(
        'Service error'
      );
      expect(service.create).toHaveBeenCalledWith(machineId, mockUser.id, dto);
    });
  });

  describe('remove', () => {
    it('should call MonitoringPointsService.remove with correct parameters', async () => {
      const machineId = 1;
      const monitoringPointId = 2;
      const result = { success: true };

      service.remove.mockResolvedValue(result);

      const response = await controller.remove(
        machineId,
        monitoringPointId,
        mockUser
      );

      expect(service.remove).toHaveBeenCalledWith(
        machineId,
        mockUser.id,
        monitoringPointId
      );
      expect(response).toEqual(result);
    });

    it('should handle service exceptions', async () => {
      const machineId = 1;
      const monitoringPointId = 2;
      const error = new Error('Service error');

      service.remove.mockRejectedValue(error);

      await expect(
        controller.remove(machineId, monitoringPointId, mockUser)
      ).rejects.toThrow('Service error');
      expect(service.remove).toHaveBeenCalledWith(
        machineId,
        mockUser.id,
        monitoringPointId
      );
    });
  });
});

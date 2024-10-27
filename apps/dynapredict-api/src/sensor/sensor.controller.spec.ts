import { Test, TestingModule } from '@nestjs/testing';
import { AuthUser } from '../auth/user.decorator';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

class MockSensorService {
  create = jest.fn();
}

describe('SensorController', () => {
  let controller: SensorController;
  let service: MockSensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorController],
      providers: [
        {
          provide: SensorService,
          useClass: MockSensorService,
        },
      ],
    }).compile();

    controller = module.get<SensorController>(SensorController);
    service = module.get<MockSensorService>(SensorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call sensorService.create with correct parameters and return the result', async () => {
      const createSensorDto: CreateSensorDto = {
        model: 'HFPlus',
      };
      const monitoringPointId = 1;
      const user: AuthUser = { id: 123, email: 'test@test.com' };
      const expectedResult = {
        id: 1,
        ...createSensorDto,
        monitoringPointId,
        userId: user.id,
      };

      service.create.mockResolvedValue(expectedResult);

      const result = await controller.create(
        createSensorDto,
        monitoringPointId,
        user
      );

      expect(service.create).toHaveBeenCalledWith(
        createSensorDto,
        monitoringPointId,
        user.id
      );
      expect(result).toEqual(expectedResult);
    });
  });
});

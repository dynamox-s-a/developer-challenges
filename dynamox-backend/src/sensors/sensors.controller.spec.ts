import { Test, TestingModule } from '@nestjs/testing';
import { SensorsController } from './sensors.controller';
import { IsString, IsIn } from 'class-validator';
import { SensorsService } from './sensors.service';

export class AssignSensorDto {
  @IsString()
  monitoringPoint: string;

  @IsIn(['TcAg', 'TcAs', 'HF+'])
  model: string;

  @IsString()
  machineId: string;
}

describe('SensorsController', () => {
  let controller: SensorsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SensorsController],
      providers: [
        {
          provide: SensorsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SensorsController>(SensorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

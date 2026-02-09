import { Test, TestingModule } from '@nestjs/testing';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';

jest.mock('@source/persistence', () => ({
  prisma: {},
  MachineType: { Pump: 'Pump', Fan: 'Fan' },
  SensorModel: { TcAg: 'TcAg', TcAs: 'TcAs', HF_Plus: 'HF_Plus' },
}));

describe('MachinesController', () => {
  let controller: MachinesController;
  let service: MachinesService;

  const mockMachinesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
      providers: [
        {
          provide: MachinesService,
          useValue: mockMachinesService,
        },
      ],
    }).compile();

    controller = module.get<MachinesController>(MachinesController);
    service = module.get<MachinesService>(MachinesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll service method', async () => {
    mockMachinesService.findAll.mockResolvedValue([]);
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call findOne service method', async () => {
    mockMachinesService.findOne.mockResolvedValue({});
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call create service method', async () => {
    const dto = { name: 'Test' };
    mockMachinesService.create.mockResolvedValue({});
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call update service method', async () => {
    const dto = { name: 'Test' };
    mockMachinesService.update.mockResolvedValue({});
    await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call remove service method', async () => {
    mockMachinesService.remove.mockResolvedValue({});
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});

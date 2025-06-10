import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';

describe('MachinesService', () => {
  let service: MachinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachinesService],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

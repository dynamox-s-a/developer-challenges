import { Test, TestingModule } from '@nestjs/testing';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('src/auth/jwt-auth.guard', () => ({
  JwtAuthGuard: {
    canActivate: jest.fn(() => true),
  },
}));

describe('MachinesController', () => {
  let controller: MachinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
      providers: [
        {
          provide: MachinesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<MachinesController>(MachinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

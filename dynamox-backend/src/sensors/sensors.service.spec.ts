import { Test } from '@nestjs/testing';
import { SensorsService } from './sensors.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SensorsService', () => {
  let service: SensorsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SensorsService,
        {
          provide: PrismaService,
          useValue: {
            sensor: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SensorsService>(SensorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Injectable } from '@nestjs/common';
import { SensorModel } from '@prisma/client';

@Injectable()
export class SensorModelService {
  findAll(): string[] {
    return Object.values(SensorModel);
  }
}

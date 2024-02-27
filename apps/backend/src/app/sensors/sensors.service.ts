import {
  CreateSensorDto,
  createSensorDto,
  UpdateSensorDto,
  updateSensorDto
} from '@dynamox-challenge/dto';
import { PrismaError } from '@dynamox-challenge/prisma';
import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/PrismaService';

@Injectable()
export class SensorsService {
  constructor(private prisma: PrismaService) {}
  async create(body: CreateSensorDto): Promise<{
    statusCode: number;
    data: string | { model: string; id: number };
  }> {
    const validation = createSensorDto.safeParse(body);

    if (!validation.success) {
      console.log(validation.error.flatten().formErrors);
      if (validation.error.flatten().fieldErrors.model) {
        return {
          statusCode: 400,
          data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+", we got: ' + body.model
        };
      } else {
        return {
          statusCode: 400,
          data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+"'
        };
      }
    }

    const data: CreateSensorDto = validation.data;

    try {
      const sensor = await this.prisma.sensor.create({
        data
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: sensor
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }

  async findAll(): Promise<{
    statusCode: number;
    data: string | Array<{ model: string; id: number }>;
  }> {
    try {
      const sensors = await this.prisma.sensor.findMany();
      return {
        statusCode: HttpStatus.OK,
        data: sensors
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }

  async findOne(id: number): Promise<{
    statusCode: number;
    data: string | { model: string; id: number };
  }> {
    try {
      const sensor = await this.prisma.sensor.findUnique({
        where: { id }
      });

      if (!sensor) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          data: 'Sensor not found'
        };
      }

      return {
        statusCode: HttpStatus.OK,
        data: sensor
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }

  async update(id: number, body: UpdateSensorDto): Promise<{
    statusCode: number;
    data: string | { model: string; id: number };
  }> {
    const validation = updateSensorDto.safeParse(body);

    if (!validation.success) {
      console.log(validation.error.flatten().formErrors);
      if (validation.error.flatten().fieldErrors.model) {
        return {
          statusCode: 400,
          data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+", we got: ' + body.model
        };
      } else {
        return {
          statusCode: 400,
          data: 'Invalid model, expected: "TcAg", "TcAs" or "HF+"'
        };
      }
    }

    const data: UpdateSensorDto = validation.data;

    try {
      const sensor = await this.prisma.sensor.update({
        where: { id },
        data
      });

      return {
        statusCode: HttpStatus.OK,
        data: sensor
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }

  async remove(id: number): Promise<{
    statusCode: number;
    data: string;
  }> {
    try {
      await this.prisma.sensor.delete({
        where: { id }
      });

      return {
        statusCode: HttpStatus.NO_CONTENT,
        data: 'Sensor deleted'
      };
    } catch (error) {
      return PrismaError.handle(error);
    }
  }
}

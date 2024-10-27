import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { SensorModel } from '@prisma/client';
import { CreateSensorDto } from './create-sensor.dto';

describe('CreateSensorDto', () => {
  let validationPipe: ValidationPipe;
  let metadata: ArgumentMetadata;
  const sensorModelValues = Object.values(SensorModel).join(', ');

  beforeEach(() => {
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
    metadata = {
      type: 'body',
      metatype: CreateSensorDto,
      data: '',
    };
  });

  it('should pass validation with valid data', async () => {
    const dto = { model: SensorModel.HFPlus };
    const result = await validationPipe.transform(dto, metadata);
    expect(result).toEqual(dto);
  });

  it('should fail validation with empty model', async () => {
    const dto = { model: '' };
    await expect(validationPipe.transform(dto, metadata)).rejects.toThrow();
  });

  it('should fail validation with invalid model', async () => {
    const dto = { model: 'InvalidModel' };
    await validationPipe.transform(dto, metadata).catch((err) => {
      expect(err.getResponse().message).toContain(
        `Invalid sensor model. Should be one of: ${sensorModelValues}`
      );
    });
  });

  it('should fail validation when model is missing', async () => {
    const dto = {};
    await validationPipe.transform(dto, metadata).catch((err) => {
      const messages = err.getResponse().message;
      expect(messages).toContain('model should not be empty');
      expect(messages).toContain(
        `Invalid sensor model. Should be one of: ${sensorModelValues}`
      );
    });
  });
});

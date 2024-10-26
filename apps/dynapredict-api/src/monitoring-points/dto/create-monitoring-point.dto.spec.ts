import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateMonitoringPointDto } from './create-monitoring-point.dto';

describe('CreateMonitoringPointDto', () => {
  let validationPipe: ValidationPipe;
  let metadata: ArgumentMetadata;

  beforeEach(() => {
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
    metadata = {
      type: 'body',
      metatype: CreateMonitoringPointDto,
      data: '',
    };
  });

  it('should pass validation with valid data', async () => {
    const dto = { name: 'Test Monitoring Point', machineId: 1 };
    const result = await validationPipe.transform(dto, metadata);
    expect(result).toEqual(dto);
  });

  describe('name property', () => {
    it('should fail validation if name is empty', async () => {
      const dto = { name: '', machineId: 1 };
      await validationPipe.transform(dto, metadata).catch((err) => {
        const messages = err.getResponse().message;
        expect(messages).toContain('name should not be empty');
      });
    });

    it('should fail validation if name is not a string', async () => {
      const dto = { name: 123, machineId: 1 };
      await validationPipe.transform(dto, metadata).catch((err) => {
        const messages = err.getResponse().message;
        expect(messages).toContain('name must be a string');
      });
    });
  });

  describe('machineId property', () => {
    it('should fail validation if machineId is not a number', async () => {
      const dto = { name: 'Test Monitoring Point', machineId: 'not a number' };
      await validationPipe.transform(dto, metadata).catch((err) => {
        const messages = err.getResponse().message;
        expect(messages).toContain(
          'machineId must be a number conforming to the specified constraints'
        );
      });
    });

    it('should fail validation if machineId is empty', async () => {
      const dto = { name: 'Test Monitoring Point', machineId: null };
      await validationPipe.transform(dto, metadata).catch((err) => {
        const messages = err.getResponse().message;
        expect(messages).toContain('machineId should not be empty');
      });
    });
  });

  it('should fail validation with missing fields', async () => {
    const dto = {};
    await validationPipe.transform(dto, metadata).catch((err) => {
      const messages = err.getResponse().message;
      expect(messages).toContain('name should not be empty');
      expect(messages).toContain('machineId should not be empty');
    });
  });
});

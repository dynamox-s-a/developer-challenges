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
    const dto = { name: 'Test Monitoring Point' };
    const result = await validationPipe.transform(dto, metadata);
    expect(result).toEqual(dto);
  });

  describe('name property', () => {
    it('should fail validation if name is empty', async () => {
      const dto = { name: '' };
      await validationPipe.transform(dto, metadata).catch((err) => {
        const messages = err.getResponse().message;
        expect(messages).toContain('name should not be empty');
      });
    });

    it('should fail validation if name is not a string', async () => {
      const dto = { name: 123 };
      await validationPipe.transform(dto, metadata).catch((err) => {
        const messages = err.getResponse().message;
        expect(messages).toContain('name must be a string');
      });
    });
  });
});

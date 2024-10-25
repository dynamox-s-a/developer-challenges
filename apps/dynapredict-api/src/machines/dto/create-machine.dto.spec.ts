import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { MachineType } from '@prisma/client';
import { CreateMachineDto } from './create-machine.dto';

describe('CreateMachineDto', () => {
  let validationPipe: ValidationPipe;
  let metadata: ArgumentMetadata;
  const machineTypeValues = Object.values(MachineType).join(', ');

  beforeEach(() => {
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
    metadata = {
      type: 'body',
      metatype: CreateMachineDto,
      data: '',
    };
  });

  it('should pass validation with valid data', async () => {
    const dto = { name: 'Pump A', type: MachineType.Pump };
    const result = await validationPipe.transform(dto, metadata);
    expect(result).toEqual(dto);
  });

  it('should fail validation with empty name', async () => {
    const dto = { name: '', type: MachineType.Pump };
    await expect(validationPipe.transform(dto, metadata)).rejects.toThrow();
  });

  it('should fail validation with invalid type', async () => {
    const dto = { name: 'Pump A', type: 'InvalidType' };
    await validationPipe.transform(dto, metadata).catch((err) => {
      expect(err.getResponse().message).toContain(
        `Invalid machine type. Should be one of: ${machineTypeValues}`
      );
    });
  });

  it('should fail validation with missing fields', async () => {
    const dto = {};
    await validationPipe.transform(dto, metadata).catch((err) => {
      const messages = err.getResponse().message;
      expect(messages).toContain('name should not be empty');
      expect(messages).toContain(
        `Invalid machine type. Should be one of: ${machineTypeValues}`
      );
    });
  });
});

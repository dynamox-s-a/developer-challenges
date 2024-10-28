import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { QueryDto } from './query.dto';

describe('QueryDto', () => {
  let validationPipe: ValidationPipe;
  let metadata: ArgumentMetadata;

  beforeEach(() => {
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
    metadata = {
      type: 'query',
      metatype: QueryDto,
      data: '',
    };
  });

  it('should pass validation with default values', async () => {
    const dto = {};
    const result = await validationPipe.transform(dto, metadata);
    expect(result).toEqual({
      page: 1,
      sortBy: 'machine_name',
      sortOrder: 'asc',
    });
  });

  it('should pass validation with valid data', async () => {
    const dto = {
      page: '2',
      sortBy: 'sensor_model',
      sortOrder: 'desc',
    };
    const result = await validationPipe.transform(dto, metadata);
    expect(result).toEqual({
      page: 2,
      sortBy: 'sensor_model',
      sortOrder: 'desc',
    });
  });

  it('should fail validation with invalid page (non-integer)', async () => {
    const dto = { page: 'abc' };
    await expect(validationPipe.transform(dto, metadata)).rejects.toThrow();
  });

  it('should fail validation with invalid page (less than 1)', async () => {
    const dto = { page: 0 };
    await expect(validationPipe.transform(dto, metadata)).rejects.toThrow();
  });

  it('should fail validation with invalid sortBy value', async () => {
    const dto = { sortBy: 'invalid_field' };
    await expect(validationPipe.transform(dto, metadata)).rejects.toThrow();
  });

  it('should fail validation with invalid sortOrder value', async () => {
    const dto = { sortOrder: 'ascending' };
    await expect(validationPipe.transform(dto, metadata)).rejects.toThrow();
  });

  it('should pass validation with partial data', async () => {
    const dto = { sortBy: 'monitoring_point_name' };
    const result = await validationPipe.transform(dto, metadata);
    expect(result).toEqual({
      sortBy: 'monitoring_point_name',
      page: 1,
      sortOrder: 'asc',
    });
  });
});

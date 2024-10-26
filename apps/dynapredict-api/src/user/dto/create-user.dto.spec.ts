import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let validationPipe: ValidationPipe;
  let metadata: ArgumentMetadata;

  beforeEach(() => {
    validationPipe = new ValidationPipe({ transform: true, whitelist: true });
    metadata = {
      type: 'body',
      metatype: CreateUserDto,
      data: '',
    };
  });

  it('should pass validation with valid data', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    const result = await validationPipe.transform(dto, metadata);
    expect(result).toEqual(dto);
  });

  it('should fail validation with empty email', async () => {
    const dto = { email: '', password: 'password123' };
    await expect(validationPipe.transform(dto, metadata)).rejects.toThrow();
  });

  it('should fail validation with empty password', async () => {
    const dto = { email: 'test@example.com', password: '' };
    await expect(validationPipe.transform(dto, metadata)).rejects.toThrow();
  });

  it('should fail validation with short password', async () => {
    const dto = { email: 'test@example.com', password: 'short' };
    await validationPipe.transform(dto, metadata).catch((err) => {
      expect(err.getResponse().message).toContain(
        'password must be longer than or equal to 8 characters'
      );
    });
  });

  it('should fail validation with invalid email format', async () => {
    const dto = { email: 'invalid-email', password: 'password123' };
    await validationPipe.transform(dto, metadata).catch((err) => {
      expect(err.getResponse().message).toContain('email must be an email');
    });
  });

  it('should fail validation with missing fields', async () => {
    const dto = {};
    await validationPipe.transform(dto, metadata).catch((err) => {
      expect(err.getResponse().message).toContain('email should not be empty');
      expect(err.getResponse().message).toContain(
        'password should not be empty'
      );
    });
  });
});

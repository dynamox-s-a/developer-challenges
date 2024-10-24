import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let target: ValidationPipe;
  let metadata: ArgumentMetadata;

  beforeEach(() => {
    target = new ValidationPipe({ transform: true, whitelist: true });
    metadata = {
      type: 'body',
      metatype: CreateUserDto,
      data: '',
    };
  });

  it('should pass validation with valid data', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    const result = await target.transform(dto, metadata);
    expect(result).toEqual(dto);
  });

  it('should fail validation with empty email', async () => {
    const dto = { email: '', password: 'password123' };
    await expect(target.transform(dto, metadata)).rejects.toThrow();
  });

  it('should fail validation with empty password', async () => {
    const dto = { email: 'test@example.com', password: '' };
    await expect(target.transform(dto, metadata)).rejects.toThrow();
  });

  it('should fail validation with short password', async () => {
    const dto = { email: 'test@example.com', password: 'short' };
    await target.transform(dto, metadata).catch((err) => {
      expect(err.getResponse().message).toContain(
        'password must be longer than or equal to 8 characters'
      );
    });
  });

  it('should fail validation with invalid email format', async () => {
    const dto = { email: 'invalid-email', password: 'password123' };
    await target.transform(dto, metadata).catch((err) => {
      expect(err.getResponse().message).toContain('email must be an email');
    });
  });

  it('should fail validation with missing fields', async () => {
    const dto = {};
    await target.transform(dto, metadata).catch((err) => {
      expect(err.getResponse().message).toContain('email should not be empty');
      expect(err.getResponse().message).toContain(
        'password should not be empty'
      );
    });
  });
});

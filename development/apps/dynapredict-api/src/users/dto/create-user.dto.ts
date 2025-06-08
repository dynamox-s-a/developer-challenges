import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-user.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}

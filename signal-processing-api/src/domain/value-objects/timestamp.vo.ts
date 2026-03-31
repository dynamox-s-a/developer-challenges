import { IsDateString, IsNotEmpty, validateSync } from 'class-validator';

export class Timestamp {
  @IsDateString({}, { message: 'Must be a valid ISO 8601 date string' })
  @IsNotEmpty()
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(`Timestamp validation failed: ${Object.values(errors[0].constraints || {}).join(', ')}`);
    }
  }
}

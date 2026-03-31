import { IsString, IsNotEmpty, validateSync } from 'class-validator';

export class MeasurementUnit {
  @IsString()
  @IsNotEmpty()
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(`MeasurementUnit validation failed: ${Object.values(errors[0].constraints || {}).join(', ')}`);
    }
  }
}

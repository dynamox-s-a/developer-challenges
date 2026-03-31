import { IsString, IsNotEmpty, Matches, validateSync } from 'class-validator';

export class SensorName {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_\/]+$/, { message: 'Invalid sensor name format' })
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(`SensorName validation failed: ${Object.values(errors[0].constraints || {}).join(', ')}`);
    }
  }
}

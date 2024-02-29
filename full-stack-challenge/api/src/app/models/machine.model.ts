import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import BaseModel from '../core/base.model';

export enum MachineTypes {
  PUMP = 'Pump',
  FAN = 'Fan',
}

@Schema({ id: false })
export default class Machine extends BaseModel {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @Prop({ required: true })
  createdAt: Date;

  @ApiProperty({ enum: Object.values(MachineTypes) })
  @Prop({ required: true, enum: Object.values(MachineTypes) })
  type: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @Prop({ required: true })
  updatedAt: Date;
}

const MachineSchema = SchemaFactory.createForClass(Machine);
MachineSchema.index({ name: 1 });

export { MachineSchema };

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import BaseModel from '../core/base.model';

@Schema({ id: false })
export default class Sensor extends BaseModel {
  @ApiProperty()
  @Prop({ required: true })
  modelName: string;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @Prop({ required: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @Prop({ required: true })
  updatedAt: Date;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);

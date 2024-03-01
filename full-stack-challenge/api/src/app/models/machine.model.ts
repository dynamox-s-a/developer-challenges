import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SchemaTypes, Types } from 'mongoose';
import BaseModel from '../core/base.model';
import Sensor from './sensor.model';
import User from './user.model';

export enum MachineTypes {
  PUMP = 'Pump',
  FAN = 'Fan',
}

export enum MachineStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ id: false })
export class MonitoringPoint {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty({ type: 'string', format: 'objectId' })
  @Prop({ required: true, ref: User.name, type: SchemaTypes.ObjectId })
  userId: Types.ObjectId;

  @ApiProperty({ type: 'string', format: 'objectId' })
  @Prop({ required: true, ref: Sensor.name, type: SchemaTypes.ObjectId })
  sensorId: Types.ObjectId;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @Prop({ required: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @Prop({ required: true })
  updatedAt: Date;
}

const MonitoringPointSchema = SchemaFactory.createForClass(MonitoringPoint);

@Schema({ id: false })
export default class Machine extends BaseModel {
  @ApiProperty()
  @Prop({ required: false })
  name: string;

  @ApiProperty({ enum: Object.keys(MachineStatus) })
  @Prop({ required: false, enum: Object.keys(MachineStatus) })
  status: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @Prop({ required: false })
  createdAt: Date;

  @ApiProperty({ enum: Object.values(MachineTypes) })
  @Prop({ required: false, enum: Object.values(MachineTypes) })
  type: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @Prop({ required: true })
  updatedAt: Date;

  @ApiProperty({
    type: 'array',
    oneOf: [{ $ref: getSchemaPath(MonitoringPoint) }],
  })
  @Prop({ required: false, type: [MonitoringPointSchema] })
  monitoringPoints: MonitoringPoint[];
}

const MachineSchema = SchemaFactory.createForClass(Machine);
MachineSchema.index({ name: 1 });

export { MachineSchema };

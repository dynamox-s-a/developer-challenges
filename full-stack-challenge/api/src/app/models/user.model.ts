import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import BaseModel from '../core/base.model';

@Schema({ id: false })
export default class User extends BaseModel {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: false })
  email: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  password: string;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @Prop({ required: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @Prop({ required: true })
  updatedAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ name: 1, email: 1 });

export { UserSchema };

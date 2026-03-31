import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class TimeSeriesMetadata {
  @Prop({ required: true, index: true })
  sensorId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sampleRate: number;

  @Prop({ required: true })
  unit: string;
}

export type TimeSeriesDocument = TimeSeriesSchemaClass & Document;

@Schema({
  timeseries: {
    timeField: 'datetime',
    metaField: 'metadata',
    granularity: 'seconds',
  },
  collection: 'timeSeries',
})
export class TimeSeriesSchemaClass {
  @Prop({ required: true })
  datetime: Date;

  @Prop({ type: TimeSeriesMetadata, required: true })
  metadata: TimeSeriesMetadata;

  @Prop({ required: true })
  value: number;
}

export const TimeSeriesSchema = SchemaFactory.createForClass(TimeSeriesSchemaClass);
// Creating an index on sensorId and datetime is crucial for queries
TimeSeriesSchema.index({ 'metadata.sensorId': 1, datetime: 1 });

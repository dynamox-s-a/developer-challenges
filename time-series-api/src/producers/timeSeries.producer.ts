import { env } from '../config/env';
import { sendKafkaMessage } from '../config/kafka';

interface TimeSeriesCreatedEvent {
  timeSeriesId: string;
  name?: string;
  sampleCount: number;
  createdAt: Date;
}

interface TimeSeriesDeletedEvent {
  timeSeriesId: string;
  deletedAt: Date;
}

export async function publishTimeSeriesCreated(
  event: TimeSeriesCreatedEvent
): Promise<void> {
  await sendKafkaMessage(env.kafkaTopicTimeSeriesCreated, event.timeSeriesId, {
    eventType: 'time-series.created',
    timeSeriesId: event.timeSeriesId,
    name: event.name,
    sampleCount: event.sampleCount,
    createdAt: event.createdAt.toISOString(),
  });
}

export async function publishTimeSeriesDeleted(
  event: TimeSeriesDeletedEvent
): Promise<void> {
  await sendKafkaMessage(env.kafkaTopicTimeSeriesDeleted, event.timeSeriesId, {
    eventType: 'time-series.deleted',
    timeSeriesId: event.timeSeriesId,
    deletedAt: event.deletedAt.toISOString(),
  });
}
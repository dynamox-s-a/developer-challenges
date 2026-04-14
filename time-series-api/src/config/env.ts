import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/time-series-api',
  nodeEnv: process.env.NODE_ENV || 'development',
  kafkaEnabled: process.env.KAFKA_ENABLED === 'true',
  kafkaClientId: process.env.KAFKA_CLIENT_ID || 'time-series-api',
  kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092')
    .split(',')
    .map((broker) => broker.trim())
    .filter(Boolean),
  kafkaTopicTimeSeriesCreated:
    process.env.KAFKA_TOPIC_TIME_SERIES_CREATED || 'time-series.created',
  kafkaTopicTimeSeriesDeleted:
    process.env.KAFKA_TOPIC_TIME_SERIES_DELETED || 'time-series.deleted',
};
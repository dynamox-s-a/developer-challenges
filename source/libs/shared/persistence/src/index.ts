import 'dotenv/config';
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis';
import * as amqp from 'amqplib';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ 
  connectionString: process.env['DATABASE_URL'] 
});

export const prisma = new PrismaClient({ adapter });

// Redis Client
export const redis = new Redis(process.env['REDIS_URL'] || 'redis://localhost:6379');

redis.on('error', (err) => {
  console.warn('Redis connection error:', err.message);
});

// RabbitMQ Utils
export async function createRabbitMQConnection() {
  const connection = await amqp.connect(process.env['RABBITMQ_URL'] || 'amqp://localhost:5672');
  const channel = await connection.createChannel();
  return { connection, channel };
}

export * from '@prisma/client';

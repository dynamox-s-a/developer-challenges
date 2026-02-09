import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
      queue: 'telemetry_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.listen();
  console.log('Worker is listening for RabbitMQ messages...');
}
bootstrap();

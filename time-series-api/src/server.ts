import { app } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';
import { disconnectKafkaProducer } from './config/kafka';

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();

    const server = app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });

    const shutdown = async (): Promise<void> => {
      server.close(async () => {
        await disconnectKafkaProducer();
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start application', error);
    process.exit(1);
  }
}

bootstrap();

import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function connectDatabase(): Promise<void> {
  let currentAttempt = 0;

  while (currentAttempt < MAX_RETRIES) {
    try {
      await mongoose.connect(env.mongoUri);
      console.log('Connected to MongoDB');
      return;
    } catch (error) {
      currentAttempt += 1;

      console.error(
        `Failed to connect to MongoDB (attempt ${currentAttempt}/${MAX_RETRIES})`,
        error
      );

      if (currentAttempt >= MAX_RETRIES) {
        throw error;
      }

      await delay(RETRY_DELAY_MS);
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export async function clearDatabase(): Promise<void> {
  const collections = mongoose.connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}
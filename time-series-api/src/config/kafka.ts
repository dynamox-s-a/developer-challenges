import { Kafka, Producer } from 'kafkajs';
import { env } from './env';

let producer: Producer | null = null;
let isConnected = false;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getProducer(): Producer {
  if (!producer) {
    const kafka = new Kafka({
      clientId: env.kafkaClientId,
      brokers: env.kafkaBrokers,
    });

    producer = kafka.producer();
  }

  return producer;
}

export async function connectKafkaProducer(): Promise<void> {
  if (!env.kafkaEnabled || isConnected) {
    return;
  }

  let currentAttempt = 0;

  while (currentAttempt < MAX_RETRIES) {
    try {
      const kafkaProducer = getProducer();
      await kafkaProducer.connect();
      isConnected = true;
      return;
    } catch (error) {
      currentAttempt += 1;
      isConnected = false;

      if (currentAttempt >= MAX_RETRIES) {
        throw error;
      }

      await delay(RETRY_DELAY_MS);
    }
  }
}

export async function disconnectKafkaProducer(): Promise<void> {
  if (!producer || !isConnected) {
    return;
  }

  await producer.disconnect();
  isConnected = false;
}

export async function sendKafkaMessage(
  topic: string,
  key: string,
  payload: object
): Promise<void> {
  if (!env.kafkaEnabled) {
    return;
  }

  let currentAttempt = 0;

  while (currentAttempt < MAX_RETRIES) {
    try {
      if (!isConnected) {
        await connectKafkaProducer();
      }

      const kafkaProducer = getProducer();

      await kafkaProducer.send({
        topic,
        messages: [
          {
            key,
            value: JSON.stringify(payload),
          },
        ],
      });

      return;
    } catch (error) {
      currentAttempt += 1;
      isConnected = false;

      if (currentAttempt >= MAX_RETRIES) {
        throw error;
      }

      await delay(RETRY_DELAY_MS);
    }
  }
}

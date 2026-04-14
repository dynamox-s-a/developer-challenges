import { Kafka, Producer } from 'kafkajs';
import { env } from './env';

let producer: Producer | null = null;
let isConnected = false;

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

  const kafkaProducer = getProducer();
  await kafkaProducer.connect();
  isConnected = true;
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
  } catch (error) {
    isConnected = false;
    throw error;
  }
}
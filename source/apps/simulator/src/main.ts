import * as amqp from 'amqplib';
import { prisma } from '@source/persistence';

const RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672';
const QUEUE = 'telemetry_queue';

async function simulate() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    // Fetch existing sensor IDs from the database
    const dbSensors = await prisma.sensor.findMany({
      select: { id: true }
    });

    if (dbSensors.length === 0) {
      console.error('No sensors found in database. Please create some sensors first.');
      process.exit(1);
    }

    const sensors = dbSensors.map(s => s.id);
    console.log(`Simulator started with ${sensors.length} real sensors.`);

    console.log('Simulator started. Sending data every 2 seconds...');

    setInterval(async () => {
      for (let sensorId of sensors) {
        // const sensorId = sensors[Math.floor(Math.random() * sensors.length)];
        const accelerationValue = parseFloat((Math.random() * 2).toFixed(2));
        const velocityValue = parseFloat((Math.random() * 10).toFixed(2));
        const temperatureValue = parseFloat((20 + Math.random() * 60).toFixed(2));
        
        const payload = {
          pattern: 'telemetry_data',
          data: {
            sensorId,
            accelerationValue,
            velocityValue,
            temperatureValue,
            timestamp: new Date().toISOString(),
          }
        };
  
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(payload)));
        console.log(`Sent: ${sensorId} -> A:${accelerationValue} V:${velocityValue} T:${temperatureValue}`);
      }
    }, 2000);

  } catch (error) {
    console.error('Simulator error:', error);
  }
}

simulate();

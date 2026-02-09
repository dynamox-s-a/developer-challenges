import * as amqp from 'amqplib';
import { prisma } from '@source/persistence';

export class Simulator {
  private RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672';
  private QUEUE = 'telemetry_queue';
  private interval: NodeJS.Timeout | null = null;

  async start() {
    try {
      const connection = await amqp.connect(this.RABBITMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertQueue(this.QUEUE, { durable: true });

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

      this.interval = setInterval(async () => {
        for (const sensorId of sensors) {
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
    
          channel.sendToQueue(this.QUEUE, Buffer.from(JSON.stringify(payload)));
          console.log(`Sent: ${sensorId} -> A:${accelerationValue} V:${velocityValue} T:${temperatureValue}`);
        }
      }, 2000);

    } catch (error) {
      console.error('Simulator error:', error);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

if (require.main === module) {
  const simulator = new Simulator();
  simulator.start();
}

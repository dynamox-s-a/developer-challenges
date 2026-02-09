import * as amqp from 'amqplib';
import { prisma } from '@source/persistence';

export class Simulator {
  private RABBITMQ_URL = process.env['RABBITMQ_URL'] || 'amqp://localhost:5672';
  private QUEUE = 'telemetry_queue';
  private interval: NodeJS.Timeout | null = null;
  private intervalMS: number = 2000;
  private minimumSensorsTarget: number = 3;

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
      // If too few, it activates all the sensors
      const activeSensors = sensors.length > this.minimumSensorsTarget ? this.getRandomArraySlice(sensors) : sensors;

      console.log(`Simulator started with ${activeSensors.length} real sensors.`);
      console.log(`Simulator started. Sending data every ${ this.intervalMS } milliseconds...`);

      this.interval = setInterval(async () => {
        for (const sensorId of activeSensors) {
          const accelerationValue = parseFloat((Math.random() * 20).toFixed(2));
          const velocityValue = parseFloat((Math.random() * 100).toFixed(2));
          const temperatureValue = parseFloat((20 + Math.random() * 200).toFixed(2));
          
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
      }, this.intervalMS);

    } catch (error) {
      console.error('Simulator error:', error);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getRandomArraySlice (arr) {
    // Determines how many sensors are going to activate and send data
    const amount = Math.ceil(Math.random() * arr.length);
    // Guarantees a small amount of randomness
    const offset = Math.ceil(Math.random() * Math.floor(arr.length / 3));  

    const slice = arr.slice(offset, amount + offset);
    
    // It'll try to get the minimum amount of sensors, if possible
    if (arr.length > this.minimumSensorsTarget && slice.length < this.minimumSensorsTarget) {
      console.warn('Array slice too short. Slicing again...');
      return this.getRandomArraySlice(arr);
    } else {
      return slice;
    }
  }
}

const simulator = new Simulator();
simulator.start();

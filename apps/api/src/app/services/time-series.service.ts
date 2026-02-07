import { TimeSeriesRepository } from '../repositories/time-series.repository';
import { SensorRepository } from '../repositories/sensor.repository';

export function createTimeSeriesService(
  timeSeriesRepository: TimeSeriesRepository,
  sensorRepository: SensorRepository
) {
  return {
    create: async (data: { sensorId: string; value: number; timestamp: string }) => {
      const sensor = await sensorRepository.findById(data.sensorId);
      if (!sensor) {
        throw { statusCode: 404, message: 'Sensor not found' };
      }

      return timeSeriesRepository.create({
        ...data,
        timestamp: new Date(data.timestamp),
      });
    },

    createMany: async (data: { sensorId: string; value: number; timestamp: string }[]) => {
      if (data.length === 0) return { count: 0 };
      
      const sensorId = data[0].sensorId;
      // Validate that all points belong to the same sensor (optional, but good practice if batching per sensor)
      // Or just validate the sensor exists once
      const sensor = await sensorRepository.findById(sensorId);
      if (!sensor) {
        throw { statusCode: 404, message: 'Sensor not found' };
      }

      const formattedData = data.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));

      return timeSeriesRepository.createMany(formattedData);
    },

    findBySensorId: async (params: { sensorId: string; startDate?: string; endDate?: string }) => {
      const sensor = await sensorRepository.findById(params.sensorId);
      if (!sensor) {
        throw { statusCode: 404, message: 'Sensor not found' };
      }

      return timeSeriesRepository.findBySensorId({
        sensorId: params.sensorId,
        startDate: params.startDate ? new Date(params.startDate) : undefined,
        endDate: params.endDate ? new Date(params.endDate) : undefined,
      });
    },

    getMetrics: async (sensorId: string) => {
      const sensor = await sensorRepository.findById(sensorId);
      if (!sensor) {
        throw { statusCode: 404, message: 'Sensor not found' };
      }

      const count = await timeSeriesRepository.countBySensorId(sensorId);
      // We could add more metrics here like min, max, average if needed by using Prisma aggregations
      // For now, the requirement asks for "retrieve the number of time-series I've stored"
      
      return {
        sensorId,
        totalDataPoints: count,
      };
    },

    deleteBySensorId: async (sensorId: string) => {
      const sensor = await sensorRepository.findById(sensorId);
      if (!sensor) {
        throw { statusCode: 404, message: 'Sensor not found' };
      }
      return timeSeriesRepository.deleteBySensorId(sensorId);
    },

    predictNext: async (sensorId: string) => {
      const sensor = await sensorRepository.findById(sensorId);
      if (!sensor) {
        throw { statusCode: 404, message: 'Sensor not found' };
      }

      // Get last 50 points to calculate trend
      const data = await timeSeriesRepository.findLatest(sensorId, 50);
      
      if (data.length < 2) {
        throw { statusCode: 400, message: 'Not enough data points to predict' };
      }

      // Sort by timestamp ascending for calculation
      const sortedData = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // Simple Linear Regression
      // x = time (using index or relative time), y = value
      const n = sortedData.length;
      let sumX = 0;
      let sumY = 0;
      let sumXY = 0;
      let sumXX = 0;

      // Use relative time in seconds from first point to avoid huge numbers
      const startTime = sortedData[0].timestamp.getTime();
      
      const points = sortedData.map((point) => {
        const x = (point.timestamp.getTime() - startTime) / 1000; // seconds
        const y = point.value;
        return { x, y };
      });

      points.forEach((p) => {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumXX += p.x * p.x;
      });

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // Predict next point
      // Estimate average interval
      const lastPoint = points[points.length - 1];
      const avgInterval = lastPoint.x / (n - 1);
      const nextX = lastPoint.x + avgInterval;
      
      const nextValue = slope * nextX + intercept;
      const nextTimestamp = new Date(startTime + nextX * 1000);

      return {
        sensorId,
        predictedValue: Number(nextValue.toFixed(2)),
        nextTimestamp: nextTimestamp.toISOString(),
        confidence: 'Low (Simple Linear Regression)',
      };
    },
  };
}

export type TimeSeriesService = ReturnType<typeof createTimeSeriesService>;

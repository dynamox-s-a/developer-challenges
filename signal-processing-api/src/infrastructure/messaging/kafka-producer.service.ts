import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { StoreTimeSeriesDto } from '../../application/dtos/store-time-series.dto';

@Injectable()
export class KafkaProducerService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('signals.raw');
    await this.kafkaClient.connect();
  }

  async publishRawSignal(dto: StoreTimeSeriesDto) {
    // We partition Kafka by sensorId to guarantee event order for that sensor
    this.kafkaClient.emit('signals.raw', {
      key: dto.sensorId,
      value: dto
    });
  }
}

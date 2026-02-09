import { Module, forwardRef } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { RealTimeModule } from '../real-time/real-time.module';

@Module({
  imports: [forwardRef(() => RealTimeModule)],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}

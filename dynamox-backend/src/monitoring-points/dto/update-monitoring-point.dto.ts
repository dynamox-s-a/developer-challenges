import { PartialType } from '@nestjs/mapped-types';
import { CreateMonitoringPointDto } from './create-monitoring-point.dto';

export class UpdateMonitoringPointDto extends PartialType(
  CreateMonitoringPointDto,
) {}

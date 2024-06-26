import { CreateMonitorsDto } from './create-monitor.dto';
import { PartialType } from '@nestjs/mapped-types'

export class UpdateMonitorsDto extends PartialType(CreateMonitorsDto) {}

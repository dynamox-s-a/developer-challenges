import { Controller, Get } from '@nestjs/common';
import type { Overview, SessionUser } from '@condition-monitor/shared';
import { CurrentUser } from '../auth/current-user.decorator';
import { OverviewRepository } from './overview.repository';

/** What the user has stored, including the number of time-series (challenge, section 7). */
@Controller('overview')
export class OverviewController {
  constructor(private readonly overview: OverviewRepository) {}

  @Get()
  get(@CurrentUser() user: SessionUser): Promise<Overview> {
    return this.overview.countsOf(user.id);
  }
}

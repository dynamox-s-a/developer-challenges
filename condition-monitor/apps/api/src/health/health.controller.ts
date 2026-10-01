import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

/** Liveness check for Docker, CI and the web app, open without a session. */
@Public()
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: 'ok' } {
    return { status: 'ok' };
  }
}

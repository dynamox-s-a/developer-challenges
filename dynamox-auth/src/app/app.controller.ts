import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'modules/decorators/setMetadata.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getData() {
    return this.appService.getData();
  }
}

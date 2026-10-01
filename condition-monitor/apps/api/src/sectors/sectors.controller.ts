import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  createSectorSchema,
  updateSectorSchema,
  type Sector,
  type SessionUser,
} from '@condition-monitor/shared';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from '../auth/current-user.decorator';
import { uuidParam } from '../common/validation/uuid-param.pipe';
import { SectorsService } from './sectors.service';

class CreateSectorDto extends createZodDto(createSectorSchema) {}
class UpdateSectorDto extends createZodDto(updateSectorSchema) {}

/** Sector routes of the API contract. The list is not paginated: a plant has few sectors. */
@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectors: SectorsService) {}

  @Get()
  list(@CurrentUser() user: SessionUser): Promise<Sector[]> {
    return this.sectors.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: SessionUser, @Body() body: CreateSectorDto): Promise<Sector> {
    return this.sectors.create(user.id, body);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Sector')) id: string,
    @Body() body: UpdateSectorDto,
  ): Promise<Sector> {
    return this.sectors.update(user.id, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Sector')) id: string,
  ): Promise<void> {
    return this.sectors.delete(user.id, id);
  }
}

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
  createMachineSchema,
  listMachinesQuerySchema,
  nextNumberQuerySchema,
  updateMachineSchema,
  type Machine,
  type MachineDetail,
  type NextNumber,
  type Page,
  type SessionUser,
} from '@condition-monitor/shared';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from '../auth/current-user.decorator';
import { uuidParam } from '../common/validation/uuid-param.pipe';
import { MachinesService } from './machines.service';

class CreateMachineDto extends createZodDto(createMachineSchema) {}
class UpdateMachineDto extends createZodDto(updateMachineSchema) {}
class ListMachinesQueryDto extends createZodDto(listMachinesQuerySchema) {}
class NextNumberQueryDto extends createZodDto(nextNumberQuerySchema) {}

/** Machine routes of the API contract. */
@Controller('machines')
export class MachinesController {
  constructor(private readonly machines: MachinesService) {}

  @Get()
  list(
    @CurrentUser() user: SessionUser,
    @Query() query: ListMachinesQueryDto,
  ): Promise<Page<Machine>> {
    return this.machines.list(user.id, query);
  }

  // Declared before `:id`, which would otherwise take "next-number" as an id.
  @Get('next-number')
  nextNumber(
    @CurrentUser() user: SessionUser,
    @Query() query: NextNumberQueryDto,
  ): Promise<NextNumber> {
    return this.machines.nextNumber(user.id, query.sectorId, query.type);
  }

  @Get(':id')
  get(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Machine')) id: string,
  ): Promise<MachineDetail> {
    return this.machines.get(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: SessionUser, @Body() body: CreateMachineDto): Promise<Machine> {
    return this.machines.create(user.id, body);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Machine')) id: string,
    @Body() body: UpdateMachineDto,
  ): Promise<Machine> {
    return this.machines.update(user.id, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Machine')) id: string,
  ): Promise<void> {
    return this.machines.delete(user.id, id);
  }
}

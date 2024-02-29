import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBasicAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import Joi from 'joi';
import { ApiPageableParams } from '../core/decorators/api-pageable.decorator';
import { Page } from '../core/decorators/page.decorator';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { ValidationPipe } from '../core/pipes/validation.pipe';
import PageResult from '../core/types/page-result.type';
import Machine, { MachineStatus, MachineTypes } from '../models/machine.model';
import MachineService from '../services/machine.service';

@ApiExtraModels(Machine)
@ApiTags('Machines')
@Controller('machines')
@ApiBasicAuth('bearerAuth')
@UseGuards(AuthGuard('bearerAdmin'))
export default class MachineController {
  static schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(MachineTypes))
      .required(),
    status: Joi.string()
      .valid(...Object.keys(MachineStatus))
      .required(),
  });

  constructor(private readonly machineService: MachineService) {}

  @Get()
  @ApiQuery({
    name: 'criteria',
    type: 'string',
    description: 'param to filter results by text',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    type: 'string',
    enum: Object.values(MachineTypes),
    description: 'param to filter by type',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    type: 'string',
    enum: Object.keys(MachineStatus),
    description: 'param to filter by status',
    required: false,
  })
  @ApiPageableParams(Machine)
  async list(
    @Page() page,
    @Query('criteria') criteria: string,
    @Query('type') type: MachineTypes,
    @Query('status') status: MachineStatus
  ): Promise<PageResult<Machine>> {
    const where: any = {};
    if (criteria) {
      where.$or = [{ name: { $regex: criteria.trim(), $options: 'i' } }];
    }
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }
    return this.machineService.pageable({ ...page, where });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    schema: { type: 'string', format: 'objectID' },
  })
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(Machine),
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Machine not found.',
  })
  async findById(@Param('id', ParseObjectIdPipe) id: string): Promise<Machine> {
    const machine = await this.machineService.findById(id);
    if (!machine) {
      throw new NotFoundException(
        'Máquina não encontrada',
        'machine_not_found'
      );
    }
    return machine;
  }

  @Post()
  @HttpCode(201)
  @ApiConsumes('application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string', enum: Object.values(MachineTypes) },
        status: { type: 'string', enum: Object.keys(MachineStatus) },
      },
      required: ['name', 'type', 'status'],
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      $ref: getSchemaPath(Machine),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid body fields, Check the response for details.',
  })
  async insert(
    @Body(new ValidationPipe(MachineController.schema))
    body
  ): Promise<Machine> {
    return this.machineService.insert(body);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiConsumes('application/json')
  @ApiParam({
    name: 'id',
    schema: {
      type: 'string',
      format: 'objectID',
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: Object.values(MachineTypes),
        },
        status: {
          type: 'string',
          enum: Object.keys(MachineStatus),
        },
      },
      required: ['name', 'type', 'status'],
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(Machine),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid body fields, Check the response for details.',
  })
  @ApiResponse({
    status: 404,
    description: 'Machine not found.',
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body(new ValidationPipe(MachineController.schema))
    body
  ): Promise<Machine> {
    return this.machineService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    schema: { type: 'string', format: 'objectId' },
  })
  @ApiResponse({
    status: 200,
    description: 'Machine disabled',
  })
  @ApiResponse({
    status: 404,
    description: 'Machine not found.',
  })
  async delete(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    const machine = await this.machineService.findById(id);
    if (!machine) {
      throw new NotFoundException(
        'Máquina não encontrada',
        'machine_not_found'
      );
    }
    if (machine.status === MachineStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Máquina em uso, exclusão bloqueada',
        'machine_in_use'
      );
    }
    await this.machineService.disableById(machine._id);
  }

  @Patch(':id/restore')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    schema: { type: 'string', format: 'objectId' },
  })
  @ApiResponse({
    status: 200,
    description: 'Machine restored',
  })
  @ApiResponse({
    status: 404,
    description: 'Machine not found.',
  })
  async restore(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    await this.machineService.restoreById(id);
  }
}

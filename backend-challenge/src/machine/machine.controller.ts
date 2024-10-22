import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('machine')
@ApiBearerAuth()
@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new machine' })
  @ApiResponse({ status: 201, description: 'The machine has been successfully created.' })
  @ApiBody({ type: CreateMachineDto })
  create(@Body() createMachineDto: CreateMachineDto, @Request() req: any) {
    return this.machineService.create(createMachineDto, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all machines' })
  @ApiResponse({ status: 200, description: 'Return all machines.' })
  findAll() {
    return this.machineService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a machine by ID' })
  @ApiResponse({ status: 200, description: 'Return the machine.' })
  @ApiResponse({ status: 404, description: 'Machine not found.' })
  @ApiParam({ name: 'id', required: true, description: 'Machine ID' })
  findOne(@Param('id') id: string) {
    return this.machineService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update machine' })
  @ApiParam({ name: 'id', required: true, description: 'Machine ID' })
  update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
    return this.machineService.update(id, updateMachineDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete machine' })
  @ApiParam({ name: 'id', required: true, description: 'Machine ID' })
  remove(@Param('id') id: string) {
    return this.machineService.remove(id);
  }
}

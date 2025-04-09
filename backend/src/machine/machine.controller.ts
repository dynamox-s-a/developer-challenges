import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MachineService } from './machine.service';
import { CreateMachineDto, UpdateMachineDto } from './dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@ApiTags('Machines') // Agrupa os endpoints sob a tag "Machines" no Swagger
@UseGuards(JwtGuard)
@Controller('machines')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new machine' })
  @ApiResponse({ status: 201, description: 'Machine created successfully.' })
  @ApiBody({ type: CreateMachineDto })
  async createMachine(@Body() createMachineDto: CreateMachineDto) {
    return this.machineService.createMachine(createMachineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all machines' })
  @ApiResponse({ status: 200, description: 'List of all machines.' })
  async getMachines() {
    return this.machineService.getMachines();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a machine by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the machine' })
  @ApiResponse({ status: 200, description: 'Machine details.' })
  @ApiResponse({ status: 404, description: 'Machine not found.' })
  async getMachineById(@Param('id', ParseIntPipe) id: number) {
    return this.machineService.getMachineById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a machine by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the machine' })
  @ApiBody({ type: UpdateMachineDto })
  @ApiResponse({ status: 200, description: 'Machine updated successfully.' })
  @ApiResponse({ status: 404, description: 'Machine not found.' })
  async updateMachine(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMachineDto: UpdateMachineDto,
  ) {
    return this.machineService.updateMachine(id, updateMachineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a machine by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the machine' })
  @ApiResponse({ status: 200, description: 'Machine deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Machine not found.' })
  async deleteMachine(@Param('id', ParseIntPipe) id: number) {
    return this.machineService.deleteMachine(id);
  }
}

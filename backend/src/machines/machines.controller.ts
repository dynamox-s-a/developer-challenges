import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './create-machine.dto';
import { AddMonitoringPointsDto } from './add-monitoring-points.dto';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  async getMachines() {
    return this.machinesService.getMachines();
  }

  @Post()
  async createMachine(@Body() createMachineDto: CreateMachineDto) {
    return this.machinesService.createMachine(createMachineDto);
  }

  // @Post(':machineId/monitoring-points')
  // async addMonitoringPoints(
  //   @Param('machineId') machineId: string,
  //   @Body() addMonitoringPointsDto: AddMonitoringPointsDto,
  // ) {
  //   return this.machinesService.addMonitoringPoints(
  //     machineId,
  //     addMonitoringPointsDto,
  //   );
  // }

  @Post(':machineId/monitoring-points')
  async addMonitoringPoints(
    @Param('machineId') machineId: string,
    @Body() addMonitoringPointsDto: AddMonitoringPointsDto,
  ) {
    return this.machinesService.addMonitoringPoints(
      machineId,
      addMonitoringPointsDto,
    );
  }
}

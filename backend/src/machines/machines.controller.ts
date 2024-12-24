import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './create-machine.dto';
import { AddMonitoringPointsDto } from './add-monitoring-points.dto';
import { UpdateMachineDto } from './update-machine-dto';

/**
 * Controller for handling machine-related operations.
 */
@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  /**
   * Fetches a list of all machines.
   * @returns {Promise<Machine[]>} List of machines.
   */
  @Get()
  async getMachines() {
    return this.machinesService.getMachines();
  }

  /**
   * Creates a new machine.
   * @param {CreateMachineDto} createMachineDto - The data required to create a new machine.
   * @returns {Promise<Machine>} The newly created machine.
   */
  @Post()
  async createMachine(@Body() createMachineDto: CreateMachineDto) {
    return this.machinesService.createMachine(createMachineDto);
  }

  /**
   * Fetches a list of all sensors.
   * @returns {Promise<Sensor[]>} List of sensors.
   */
  @Get('sensors')
  async getSensors() {
    return this.machinesService.getSensors();
  }

  /**
   * Adds a new monitoring point to a machine.
   * @param {string} machineId - The ID of the machine to which the monitoring point will be added.
   * @param {AddMonitoringPointsDto} addMonitoringPointsDto - The data required to add a new monitoring point.
   * @returns {Promise<MonitoringPoint>} The newly added monitoring point.
   */
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

  /**
   * Deletes a machine by its ID.
   * @param {string} machineId - The ID of the machine to be deleted.
   * @returns {Promise<void>} A response indicating the machine was deleted.
   */
  @Delete(':machineId')
  async deleteMachine(@Param('machineId') machineId: string) {
    return this.machinesService.deleteMachine(machineId);
  }

  /**
   * Deletes a monitoring point from a machine.
   * @param {string} machineId - The ID of the machine from which the monitoring point will be deleted.
   * @param {string} monitoringPointId - The ID of the monitoring point to be deleted.
   * @returns {Promise<void>} A response indicating the monitoring point was deleted.
   */
  @Delete(':machineId/monitoring-points/:monitoringPointId')
  async deleteMonitoringPoint(
    @Param('machineId') machineId: string,
    @Param('monitoringPointId') monitoringPointId: string,
  ) {
    return this.machinesService.deleteMonitoringPoint(
      machineId,
      monitoringPointId,
    );
  }

  /**
   * Updates a machine's details.
   * @param {string} machineId - The ID of the machine to be updated.
   * @param {UpdateMachineDto} updateMachineDto - The data required to update the machine.
   * @returns {Promise<Machine>} The updated machine.
   */
  @Put(':machineId')
  async updateMachine(
    @Param('machineId') machineId: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ) {
    return this.machinesService.updateMachine(machineId, updateMachineDto);
  }
}

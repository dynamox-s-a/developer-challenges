import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { MachineRepository } from '../../repositories/machine.repository';
import type { CreateMachineDto, UpdateMachineDto } from './machine.dto';
import type { Response } from 'express';

@Controller('machines')
export class MachineController {
  constructor(private readonly machineRepository: MachineRepository) {}

  @Get()
  list(): any {
    return this.machineRepository.list();
  }

  @Get(':id')
  async find(@Param('id') id: string, @Res() response: Response) {
    if (!id) {
      return response.status(400).send('Machine id is required.');
    }

    if (!Number.isInteger(+id)) {
      return response.status(400).send('Machine id should be a number.');
    }

    const machine = await this.machineRepository.find(+id);

    if (!machine) {
      return response.status(500).send('Error on machine find.');
    }

    return response.status(200).send(machine);
  }

  @Post()
  async create(
    @Body() createMachineDto: CreateMachineDto,
    @Res() response: Response,
  ) {
    if (!createMachineDto) {
      return response.status(400).send('Machine body is required.');
    }

    if (!createMachineDto.name) {
      return response.status(400).send('Machine name is required.');
    }

    if (!createMachineDto.type) {
      return response.status(400).send('Machine type is required.');
    }

    if (createMachineDto.type !== 'Fan' && createMachineDto.type !== 'Pump') {
      return response
        .status(400)
        .send('Invalid machine type. Should be "Fan" or "Pump"');
    }

    const success = await this.machineRepository.create(
      createMachineDto.name,
      createMachineDto.type,
    );

    if (!success) {
      return response.status(500).send('Error on machine creation.');
    }

    return response.status(201).send();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMachineDto: UpdateMachineDto,
    @Res() response: Response,
  ) {
    if (!id) {
      return response.status(400).send('Machine id is required.');
    }

    if (!Number.isInteger(+id)) {
      return response.status(400).send('Machine id should be a number.');
    }

    if (!updateMachineDto) {
      return response.status(400).send('Machine body is required.');
    }

    const { name, type } = updateMachineDto;

    if (!name) {
      return response.status(400).send('Machine name is required.');
    }

    if (!type) {
      return response.status(400).send('Machine type is required.');
    }

    if (type !== 'Fan' && type !== 'Pump') {
      return response
        .status(400)
        .send('Invalid machine type. Should be "Fan" or "Pump"');
    }

    const machine = await this.machineRepository.find(+id);

    if (!machine) {
      return response.status(404).send('Machine not found.');
    }

    const success = await this.machineRepository.update(+id, name, type);

    if (!success) {
      return response.status(500).send('Error on machine update.');
    }

    return response.status(200).send({ id: +id, name, type });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() response: Response) {
    if (!id) {
      return response.status(400).send('Machine id is required.');
    }

    if (!Number.isInteger(+id)) {
      return response.status(400).send('Machine id should be a number.');
    }

    const machine = await this.machineRepository.find(+id);

    if (!machine) {
      return response.status(404).send('Machine not found.');
    }

    const success = await this.machineRepository.delete(+id);

    if (!success) {
      return response.status(500).send('Error on machine delete.');
    }

    return response.status(200).send();
  }
}

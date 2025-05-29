import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLinksDTO, CreateMachinesDto, CreatePointOfMonitoringDTO } from './dto/machine.dto';
import { StatusMachine, Type, SensorType } from '@prisma/client';
import { UpdateMachinesDTO } from './dto/updates-partial.dto';

@Injectable()
export class MachineService {
  constructor(private prismaService: PrismaService) { }

  async create(data: CreateMachinesDto) {

    const { name, typeOfMachine, statusMachine, pointmonitoring1, pointmonitoring2 } = data

    if (typeOfMachine === Type.PUMP) {
      if (pointmonitoring1 && pointmonitoring1.sensorType !== SensorType.HFp) {
        throw new InternalServerErrorException("Invalid sensor for this machine. Sensor 1.");
      }
      if (pointmonitoring2 && pointmonitoring2.sensorType !== SensorType.HFp) {
        throw new InternalServerErrorException("Invalid sensor for this machine. Sensor 2.");
      }
    }

    const machine = await this.prismaService.machine.create({
      data: {
        name,
        typeOfMachine,
        statusMachine: statusMachine as StatusMachine,
        pointmonitoring1: pointmonitoring1 ? { create: pointmonitoring1 } : undefined,
        pointmonitoring2: pointmonitoring2 ? { create: pointmonitoring2 } : undefined,

      },
      include: {
        pointmonitoring1: true,
        pointmonitoring2: true
      }

    });

    return { message: "Registro criado com sucesso", machine };

  }


  async updateName(id: number, name: string | undefined) {

    if (!id) {
      throw new NotFoundException();
    }

    if (!name) {
      throw new NotFoundException();
    }

    const machine = await this.prismaService.machine.findUnique({
      where: {
        id: id
      }
    })

    if (!machine) {
      throw new NotFoundException();
    }

    const newMachineValues = await this.prismaService.machine.update({
      where: { id },
      data: { name }
    });
    
    

    return { message: "Name changes", newMachineValues };

  }

  async updateType(id: number, UpdateMachinesDTO: UpdateMachinesDTO) {

    const { typeOfMachine, pointmonitoring1, pointmonitoring2 } = UpdateMachinesDTO;

    if (!id) {
      throw new NotFoundException();
    }

    if (!typeOfMachine) {
      throw new NotFoundException();
    }

    const machine = await this.prismaService.machine.findUnique({
      where: {
        id: id
      },
      include: {
        pointmonitoring1: true,
        pointmonitoring2: true
      }
    })

    if (!machine) {
      throw new NotFoundException();
    }


    if (typeOfMachine === Type.PUMP) {
      const sensorToCheck = SensorType.HFp;
      [pointmonitoring1, pointmonitoring2].forEach((pm, index) => {
        if (pm && pm.sensorType !== sensorToCheck) {
          throw new BadRequestException(`For PUMP, pointmonitoring${index + 1} must have sensorType = HFp.`);
        }
      });
    }

    if (typeOfMachine === Type.FAN) {
      const validSensors = [SensorType.TcAs, SensorType.TcAg];
      [pointmonitoring1, pointmonitoring2].forEach((pm, index) => {
        if (pm && !validSensors.includes(pm.sensorType as 'TcAs' | 'TcAg')) {
          throw new BadRequestException(`For FAN, pointmonitoring${index + 1} must have sensorType = TcAs or TcAg.`);
        }
      });

    }

    if ((machine.pointmonitoring1 && !pointmonitoring1) ||
      (machine.pointmonitoring2 && !pointmonitoring2)) {
      throw new BadRequestException('Machine has existing point monitoring. You must send update for these fields.');
    }

    const dataToUpdate: any = { typeOfMachine };

    if (pointmonitoring1 && machine.pointmonitoring1_id != null) {
      await this.prismaService.sensorMonitoring.update({
        where: { id: machine.pointmonitoring1_id },
        data: {
          sensorType: pointmonitoring1.sensorType,
          name: pointmonitoring1.name,
        }
      });

      dataToUpdate.pointmonitoring1 = { connect: { id: machine.pointmonitoring1_id } };
    }

    if (pointmonitoring2 && machine.pointmonitoring2_id != null) {
      await this.prismaService.sensorMonitoring.update({
        where: { id: machine.pointmonitoring2_id },
        data: {
          sensorType: pointmonitoring2.sensorType,
          name: pointmonitoring2.name,
        }
      });

      dataToUpdate.pointmonitoring2 = { connect: { id: machine.pointmonitoring2_id } };
    }

    const newMachineValues = await this.prismaService.machine.update({
      where: { id },
      data: dataToUpdate,
      include: {
        pointmonitoring1: true,
        pointmonitoring2: true
      }
    },
    );

    return { message: "Type's changes", newMachineValues };

  }

  async delete(id: number) {
    const deletedMachine = await this.prismaService.machine.delete({
      where: {
        id: id
      }
    })

    return { message: "Registro deletado com sucesso", deletedMachine };
  }

  async deleteSensor(id: number) {
    if (!id) {
      throw new NotFoundException('ID é obrigatório');
    }

    const sensor = await this.prismaService.sensorMonitoring.findUnique({
      where: { id }
    });

    if (!sensor) {
      throw new NotFoundException('Sensor não encontrado');
    }

    const deletedSensor = await this.prismaService.sensorMonitoring.delete({
      where: {
        id: id
      }
    });


    return { message: "Sensor deletado com sucesso", deletedSensor };
  }

  async updateSensor(id: number, data: CreatePointOfMonitoringDTO) {
    if (!id) {
      throw new NotFoundException('ID é obrigatório');
    }

    const sensor = await this.prismaService.sensorMonitoring.findUnique({
      where: { id }
    });

    if (!sensor) {
      throw new NotFoundException('Sensor não encontrado');
    }

    // Validar se o tipo de sensor pode ser alterado
    // Verificar se o sensor está vinculado a alguma máquina
    const linkedMachines = await this.prismaService.machine.findMany({
      where: {
        OR: [
          { pointmonitoring1_id: id },
          { pointmonitoring2_id: id }
        ]
      }
    });

    // Se o sensor está vinculado e o tipo está sendo alterado, validar compatibilidade
    if (linkedMachines.length > 0 && data.sensorType && data.sensorType !== sensor.sensorType) {
      for (const machine of linkedMachines) {
        this.valSensorCompatibility(machine.typeOfMachine, data.sensorType);
      }
    }

    const updatedSensor = await this.prismaService.sensorMonitoring.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : sensor.name,
        sensorType: data.sensorType !== undefined ? data.sensorType : sensor.sensorType
      }
    });

    return { message: "Sensor atualizado com sucesso", sensor: updatedSensor };
  }

  async createSensor(data: CreatePointOfMonitoringDTO) {


    const sensor = await this.prismaService.sensorMonitoring.create({ data })

    return { message: "Sensor created", sensor };
  }

  async linkMachineToSensor(id: number, LinksDTO: CreateLinksDTO) {
    if (!id) throw new NotFoundException()

    const machine = await this.prismaService.machine.findUnique({
      where: {
        id: id
      }
    })

    if (!machine) throw new NotFoundException('Invalid Machine ID');

    const dataUpdated: any = {};

    if (LinksDTO.id_pointmonitoring1) {
      const sensor1 = await this.prismaService.sensorMonitoring.findUnique({
        where: { id: LinksDTO.id_pointmonitoring1 }
      });

      if (!sensor1) throw new NotFoundException('Sensor 1 not found');

      this.valSensorCompatibility(machine.typeOfMachine, sensor1.sensorType);

      dataUpdated.pointmonitoring1 = { connect: { id: LinksDTO.id_pointmonitoring1 } };

    };

    if (LinksDTO.id_pointmonitoring2) {
      const sensor2 = await this.prismaService.sensorMonitoring.findUnique({
        where: { id: LinksDTO.id_pointmonitoring2 }
      });

      if (!sensor2) throw new NotFoundException('Sensor 2 not found');

      this.valSensorCompatibility(machine.typeOfMachine, sensor2.sensorType);

      dataUpdated.pointmonitoring2 = { connect: { id: LinksDTO.id_pointmonitoring2 } };

    };

    const updatedMachine = await this.prismaService.machine.update({
      where: { id },
      data: dataUpdated,
      include: {
        pointmonitoring1: true,
        pointmonitoring2: true,
      },
    });

    return { message: 'Machine linked with sensors successfully', updatedMachine };

  }

  private valSensorCompatibility(typeOfMachine: Type, sensorType: SensorType) {
    if (typeOfMachine === Type.PUMP) {
      if (sensorType !== SensorType.HFp) {
        throw new BadRequestException(`For PUMP, must have sensorType = HFp.`);
      }
    }

    if (typeOfMachine === Type.FAN) {
      const validSensors = [SensorType.TcAs, SensorType.TcAg];
      if (!validSensors.includes(sensorType as any)) {
        throw new BadRequestException(`For FAN, must have sensorType = TcAs or TcAg.`);
      }
    }
  }

  async findAllMachines() {
    const machines = await this.prismaService.machine.findMany({
      include: {
        pointmonitoring1: true,
        pointmonitoring2: true
      }
    });

    return { message: "Máquinas encontradas", machines };
  }

  async findMachineById(id: number) {
    if (!id) {
      throw new NotFoundException('ID é obrigatório');
    }

    const machine = await this.prismaService.machine.findUnique({
      where: { id },
      include: {
        pointmonitoring1: true,
        pointmonitoring2: true
      }
    });

    if (!machine) {
      throw new NotFoundException('Máquina não encontrada');
    }

    return { message: "Máquina encontrada", machine };
  }

  async findAllSensors() {
    const sensors = await this.prismaService.sensorMonitoring.findMany();

    return { message: "Sensores encontrados", sensors };
  }

  async findSensorById(id: number) {
    if (!id) {
      throw new NotFoundException('ID é obrigatório');
    }

    const sensor = await this.prismaService.sensorMonitoring.findUnique({
      where: { id }
    });

    if (!sensor) {
      throw new NotFoundException('Sensor não encontrado');
    }

    return { message: "Sensor encontrado", sensor };
  }
  async findMachinesPaginated(page: number = 1, limit: number = 5) {
    // Garantir que os valores sejam números
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 5;

    if (pageNum < 1) {
      throw new BadRequestException('Página deve ser maior que 0');
    }

    if (limitNum < 1 || limitNum > 100) {
      throw new BadRequestException('Limite deve ser entre 1 e 100');
    }

    const skip = (pageNum - 1) * limitNum;

    const [machines, total] = await Promise.all([
      this.prismaService.machine.findMany({
        skip,
        take: limitNum,
        include: {
          pointmonitoring1: true,
          pointmonitoring2: true
        }
      }),
      this.prismaService.machine.count()
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      message: "Máquinas paginadas encontradas",
      data: {
        machines,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPreviousPage: pageNum > 1
        }
      }
    };
  }
  async findSensorsPaginated(page: number = 1, limit: number = 5) {
    // Garantir que os valores sejam números
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 5;

    if (pageNum < 1) {
      throw new BadRequestException('Página deve ser maior que 0');
    }

    if (limitNum < 1 || limitNum > 100) {
      throw new BadRequestException('Limite deve ser entre 1 e 100');
    }

    const skip = (pageNum - 1) * limitNum;    const [sensors, total] = await Promise.all([
      this.prismaService.sensorMonitoring.findMany({
        skip,
        take: limitNum
      }),
      this.prismaService.sensorMonitoring.count()
    ]);

    // Para cada sensor, verificar se está vinculado a alguma máquina
    const sensorsWithLinkStatus = await Promise.all(
      sensors.map(async (sensor) => {
        const linkedMachines = await this.prismaService.machine.findMany({
          where: {
            OR: [
              { pointmonitoring1_id: sensor.id },
              { pointmonitoring2_id: sensor.id }
            ]
          },
          select: {
            id: true,
            name: true
          }
        });

        return {
          ...sensor,
          isLinked: linkedMachines.length > 0,
          linkedMachines: linkedMachines
        };
      })
    );

    const totalPages = Math.ceil(total / limitNum);    return {
      message: "Sensores paginados encontrados",
      data: {
        sensors: sensorsWithLinkStatus,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPreviousPage: pageNum > 1
        }
      }
    };
  }

}

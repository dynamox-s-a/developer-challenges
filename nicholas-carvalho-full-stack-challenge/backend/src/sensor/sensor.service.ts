import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SensorRepo } from "./repository/sensor.repository";
import { CreateSensorDTO } from "./dto/createSensor.dto";
import { UpdateSensorDTO } from "./dto/updateSensor.dto";
import { MonitoringPointRepo } from "src/monitoringPoint/repository/monitoringPoint.repository";
import { MachineRepo } from "src/machine/repository/machine.repository";

@Injectable()
export class SensorService {
    constructor(@Inject("SensorRepo") private readonly sensorRepo: SensorRepo, @Inject("MonitoringPointRepo") private readonly monitoringPoint: MonitoringPointRepo, @Inject("MachineRepo") private readonly machineRepo: MachineRepo) { }

    private validatePumpModel(machineType: string, model: string) {
        const isInvalid = machineType == "PUMP" && (model == "TCAG" || model == "TCAS");
        if (isInvalid) {
            throw new BadRequestException(`Machines of type 'Pump' can only be monitored by HF_PLUS sensors. Model ${model} is not allowed.`);
        }
    }

    async findManySensors() {
        return this.sensorRepo.findManySensors();
    }

    async findUniqueSensor(id: string) {
        const sensorExists = await this.sensorRepo.findUniqueSensor(id);
        if (sensorExists) {
            return sensorExists;
        }
        throw new NotFoundException(`Sensor with Id ${id} does not exists!`);
    }

    async createSensor(data: CreateSensorDTO) {
        const sensorAlreadyExists = await this.sensorRepo.findSensorByUid(data.sensorUid);
        if (sensorAlreadyExists) {
            throw new ConflictException(`Sensor with Uid ${data.sensorUid} already exists!`);
        }

        if (data.monitoringPointId) {
            const monitoringPointExists = await this.sensorRepo.findSensorByMonitoringPointId(data.monitoringPointId);
            if (monitoringPointExists) {
                throw new ConflictException(`Sensor with Monitoring Point Id ${data.monitoringPointId} already exists!`);
            }

            const monitorPoint = await this.monitoringPoint.findMonitoringPointById(data.monitoringPointId);
            if (!monitorPoint) {
                throw new NotFoundException(`Monitoring Point ${data.monitoringPointId} does not exist!`);
            }

            const machine = await this.machineRepo.findUniqueMachine(monitorPoint.machineId);
            if (!machine) {
                throw new NotFoundException(`Machine linked to point ${monitorPoint.id} not found!`);
            }

            this.validatePumpModel(machine.type, data.model);
        }

        return this.sensorRepo.createSensor(data);
    }

    async updateSensor(data: UpdateSensorDTO, id: string) {
        const sensorExists = await this.sensorRepo.findUniqueSensor(id);
        if (!sensorExists) {
            throw new NotFoundException(`Sensor with id ${id} does not exists!`);
        }

        if (data.sensorUid) {
            const sensorWithUid = await this.sensorRepo.findSensorByUid(data.sensorUid);
            if (sensorWithUid && sensorWithUid.id != id) {
                throw new ConflictException(`Sensor with Uid ${data.sensorUid} already exists!`);
            }
        }

        if (data.monitoringPointId) {
            const sensorInPoint = await this.sensorRepo.findSensorByMonitoringPointId(data.monitoringPointId);
            if (sensorInPoint && sensorInPoint.id != id) {
                throw new ConflictException(`Sensor with Monitoring Point Id ${data.monitoringPointId} already exists!`);
            }

            const point = await this.monitoringPoint.findMonitoringPointById(data.monitoringPointId);
            if (!point) {
                throw new NotFoundException(`Monitoring point with id ${data.monitoringPointId} does not exists!`);
            }

            const machine = await this.machineRepo.findUniqueMachine(point?.machineId);
            if (!machine) {
                throw new NotFoundException(`Machine with id ${point.machineId} does not exists!`);
            }
            const sensorModel = data.model || sensorExists.model;
            this.validatePumpModel(machine.type, sensorModel);
        }

        return await this.sensorRepo.updateSensor(data, id);
    }

    async deleteSensor(id: string) {
        const sensorExists = await this.sensorRepo.findUniqueSensor(id);
        if (sensorExists) {
            await this.sensorRepo.deleteSensor(id);
            return { message: "Sensor has been deleted sucessfully", statusCode: 200 }
        }
        throw new NotFoundException(`Sensor with id ${id} does not exists!`);
    }
}
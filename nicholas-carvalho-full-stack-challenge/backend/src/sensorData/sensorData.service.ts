import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SensorDataRepo } from "./repository/sensorData.repository";
import { CreateSensorDataDTO } from "./dto/createSensorData.dto";

@Injectable()
export class SensorDataService {
    constructor(@Inject("SensorDataRepo") private readonly sensorDataRepo: SensorDataRepo) { }

    async findAllSensorData() {
        return await this.sensorDataRepo.findAllSensorData();
    }

    async getMetrics(sensorId: string) {
        return await this.sensorDataRepo.getMetrics(sensorId);
    }

    async countSensorData(sensorId: string) {
        return await this.sensorDataRepo.countSensorData(sensorId);
    }

    async findManySensorData(sensorId: string, startTime?: Date, endTime?: Date) {
        return await this.sensorDataRepo.findManySensorData(sensorId, startTime, endTime);
    }

    async createSensorData(data: CreateSensorDataDTO) {
        return await this.sensorDataRepo.createSensorData(data);
    }

    async deleteSensorData(id: string) {
        const sensorDataExists = await this.sensorDataRepo.findUniqueSensorData(id);
        if (sensorDataExists) {
            await this.sensorDataRepo.deleteSensorData(id);
            return { message: "Sensor data has been deleted with sucess!", statusCode: 200 };
        }
        throw new NotFoundException(`Sensor with id ${id} does not exists!`);
    }
}
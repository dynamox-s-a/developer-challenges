import { Controller, Get } from "@nestjs/common";
import { Sensor } from "@prisma/client";
import { SensorsService } from "./sensors.service";

@Controller('sensors')
export class SensorsController {
    constructor(
        private readonly sensorsService: SensorsService,
    ) { }


    @Get()
    async getAll(): Promise<Sensor[]> {
        console.log('Controller method called');
        return this.sensorsService.getAll();
    }
}
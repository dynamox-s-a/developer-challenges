import { Module } from "@nestjs/common";
import { MachineController } from "./machine.controller";
import { MachineService } from "./machine.service";


/**
 * Modulo
 * Dentro do modulo temos os:
 * controllers: camada de exibição da api
 * providers: A lógica de negócio
 */
@Module({
  controllers: [MachineController],
  providers: [MachineService]
})

export class MachineModule { }


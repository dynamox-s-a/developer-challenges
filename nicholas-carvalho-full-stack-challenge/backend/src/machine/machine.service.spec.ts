import { Test, TestingModule } from "@nestjs/testing";
import { MachineService } from "./machine.service";
import { MachineType } from "@prisma/client";
import { NotFoundException } from "@nestjs/common";
import { UpdateMachineDTO } from "./dto/updateMachine.dto";

describe("MachineController", () => {
    let machineService: MachineService;
    let machineRepo: any;

    beforeEach(async () => {
        const mockMachineRepo = {
            findUniqueMachine: jest.fn(),
            findMachineByName: jest.fn(),
            createMachine: jest.fn(),
            updateMachine: jest.fn(),
            deleteMachine: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MachineService,
                { provide: "MachineRepo", useValue: mockMachineRepo }
            ]
        }).compile();

        machineService = module.get(MachineService);
        machineRepo = mockMachineRepo;
    });

    it("Should create a machine sucessfully", async () => {
        const dto = { name: "Bomba Principal 01", type: MachineType.PUMP, userId: "123" }
        machineRepo.createMachine.mockResolvedValue({ ...dto, id: "123-123-123" });

        const result = await machineService.createMachine(dto);
        expect(result).toHaveProperty("id");
        expect(machineRepo.createMachine).toHaveBeenCalledWith(dto);
    });

    it("Should launch NotFoundException by trying to update a machine that does not exist", async () => {
        machineRepo.updateMachine.mockResolvedValue(null);
        expect(machineService.updateMachine("invalid-id", {} as UpdateMachineDTO, "invalid-user-id")).rejects.toThrow(NotFoundException);
    })
})
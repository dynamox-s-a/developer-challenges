import { api } from "./api";

export class MachineService {
    async getManyMachines() {
        try {
            const response = await api.get("/machine");
            return response.data;
            
        } catch (error: any) {
            throw new Error(error);
        }
    }
}
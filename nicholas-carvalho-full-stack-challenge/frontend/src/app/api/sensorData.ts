import { api } from "./api";

export class SensorDataService {
    async getManySensorDataById(id: string) {
        try {
            const response = await api.get(`/sensor-data/${id}`);
            console.log(response);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
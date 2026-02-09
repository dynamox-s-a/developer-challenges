import { showToast } from "../redux/slices/snackSlice";
import { snackType } from "../types/enum";
import { CreateMonitoringPoint, UpdateMonitoringPoint } from "../types/monitoring";
import { api } from "./api";

export class MonitoringPoint {
    async getAllMonitoringPoints(page: number, search: string) {
        try {
            const response = await api.get(`/monitoring-point`, {
                params: {
                    page, search: search || ""
                }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async createMonitoringPoint(data: CreateMonitoringPoint, dispatch: any) {
        try {
            const response = await api.post("/monitoring-point", data);
            dispatch(showToast({ message: "Monitoring Point created successfully", severity: snackType.success }));
            return response.data;
        } catch (error: any) {
            dispatch(showToast({ message: error.message, severity: snackType.error }));
        }
    }

    async updateMonitoringPoint(id: string, data: UpdateMonitoringPoint, dispatch: any) {
        try {
            const response = await api.put(`/monitoring-point/${id}`, data);
            dispatch(showToast({message: "Changes have been made successfuly!"}));
            return response.data;
            
        } catch (error: any) {
            dispatch(showToast({message: error.message, severity: snackType.error}));
        }
    }

    async deleteMonitoringPoint(id: string, dispatch: any) {
        try {
            await api.delete(`/monitoring-point/${id}`);
            dispatch(showToast({ message: "Monitoring Point deleted successfully", severity: snackType.success }));
        } catch (error: any) {
            dispatch(showToast({ message: error.message, severity: snackType.error }));
        }
    }
}
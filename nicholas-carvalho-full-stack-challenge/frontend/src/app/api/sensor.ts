import { showToast } from "../redux/slices/snackSlice";
import { snackType } from "../types/enum";
import { SensorState, UpdateSensorForm } from "../types/sensor";
import { api } from "./api";
import { MonitoringPoint } from "./monitoringPoint";

export class SensorService {
    async getAllSensors() {
        try {
            const response = await api.get("/sensor");
            return response.data;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async updateSensor(sensorId: string, sensor: any, dispatch: any) {
        try {
            const response = await api.put(`/sensor/${sensorId}`, sensor);
            dispatch(showToast({ message: `Sensor conected to monitoring point successfully!`, severity: snackType.success }));
            return response.data;
        } catch (error: any) {
            dispatch(showToast({ message: error.message, severity: snackType.error }));
            throw new Error(error);
        }
    }

    async handleUpdateSensor(oldSensorId: string, form: UpdateSensorForm, dispatch: any) {
        const pointService = new MonitoringPoint();
        const newSensorId = form.sensor?.id;

        try {
            const monitoringPointData = { name: form.name, machineId: form.machineId }
            pointService.updateMonitoringPoint(form.monitoringPointId, monitoringPointData, dispatch);
            if (oldSensorId && oldSensorId != newSensorId) {
                await this.updateSensor(oldSensorId, { monitoringPointId: null }, dispatch);
            }

            if (newSensorId) {
                await this.updateSensor(newSensorId, { monitoringPointId: form.monitoringPointId }, dispatch);
            }
        } catch (error: any) {
            dispatch(showToast({ message: error.message, severity: snackType.error }));
            throw new Error(error);
        }
    }
}
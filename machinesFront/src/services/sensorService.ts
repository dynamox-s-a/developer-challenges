
import {http} from "./http.ts";
import {filterType} from "../utils/filterType.ts";
import {ISensor} from "../pages/Sensor/ISensor.ts";

export async function createSensor(sensorInfo: ISensor) {
    return await http.post(`/sensor`, sensorInfo);
}

export async function upDateSensor(sensorInfo: ISensor) {
    return await http.put(`/sensor/${sensorInfo._id}`, sensorInfo);
}

export async function getAllSensors(filter: filterType) {
    const { data } = await http.get(
        `/sensor?orderBy=${filter.sort.orderBy}&order=${filter.sort.order}`,
    );
    return data;
}

export async function deleteSensor(id: string) {
    await http.delete(`/sensor/${id}`);
}


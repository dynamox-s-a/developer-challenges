'use server'
import { SensorData } from '@/models/sensorModel'

export const createSensor = async (token: string, machine_id: number, monitoring_point_id: number, sensor_type: string) => {
    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL +
        `/sensor`
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                key: 'D-lRnkhY#',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ machine_id, monitoring_point_id, sensor_type })
        })
        const data = await response.json()
        console.log("data", data)

        return data
    } catch (error) {
        console.error('Error creating sensor:', error)
        throw error
    }
}

export const updateSensor = async ({monitoring_point_id, sensor_type, machine_id, sensor_id}: SensorData, token: string) => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/sensor/${sensor_id}`;
    const body: Partial<SensorData> = {};

    if (monitoring_point_id) {
        body.monitoring_point_id = monitoring_point_id;
    }

    if (machine_id) {
        body.machine_id = machine_id;
    }

    if (sensor_type) {
        body.sensor_type = sensor_type;
    }

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                key: 'D-lRnkhY#',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error updating sensor data:', error);
        throw error;
    }
};

export const deleteSensor = async (sensor_id: number, token: string) => {
    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL +
        `/sensor/${sensor_id}`
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                key: 'D-lRnkhY#',
                Authorization: `Bearer ${token}`
            },
        })
        const data = await response.json()

        return data
    } catch (error) {
        console.error('Error deleting sensor:', error)
        throw error
    }
}

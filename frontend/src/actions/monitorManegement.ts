'use server'
import { MonitorsData } from '@/models/monitorsModel'

export const createMonitor = async (token: string, machine_id: number, monitoring_point_name: string) => {
    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL +
        `/monitors`
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                key: 'D-lRnkhY#',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ machine_id, monitoring_point_name })
        })
        const data = await response.json()

        return data
    } catch (error) {
        console.error('Error creating monitor:', error)
        throw error
    }
}

export const updateMonitor = async ({monitoring_point_id, monitoring_point_name, machine_id}: MonitorsData, token: string) => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/monitors/${monitoring_point_id}`;
    const body: Partial<MonitorsData> = {};

    if (monitoring_point_name) {
        body.monitoring_point_name = monitoring_point_name;
    }

    if (machine_id) {
        body.machine_id = machine_id;
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
        console.error('Error updating monitor data:', error);
        throw error;
    }
};

export const deleteMonitor = async (monitoring_point_id: number, token: string) => {
    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL +
        `/monitors/${monitoring_point_id}`
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
        console.error('Error deleting monitor:', error)
        throw error
    }
}

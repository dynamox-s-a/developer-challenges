'use server'
import { MachineData } from '@/models/machineModel'

export const createMachine = async (token: string, { user_id, machine_name, machine_type }: MachineData) => {
    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL +
        `/machine`
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                key: 'D-lRnkhY#',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ user_id, machine_name, machine_type })
        })
        const data = await response.json()

        return data
    } catch (error) {
        console.error('Error creating machine:', error)
        throw error
    }
}

export const updateMachine = async ({machine_id, machine_name, machine_type}: MachineData, token: string) => {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + `/machine/${machine_id}`;
    const body: Partial<MachineData> = {};

    if (machine_name) {
        body.machine_name = machine_name;
    }

    if (machine_type) {
        body.machine_type = machine_type;
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
        console.error('Error fetching reel data:', error);
        throw error;
    }
};

export const deleteMachine = async (machine_id: MachineData, token: string) => {
    const url =
        process.env.NEXT_PUBLIC_API_BASE_URL +
        `/machine/${machine_id}`
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
        console.error('Error deleting machine:', error)
        throw error
    }
}

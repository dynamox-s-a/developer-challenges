import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchMachinesThunk = createAsyncThunk(
    'machines/fetch',
    async () => {
        return api.get<{ items: any[] }>('/machines');
    },
);

export const createMachineThunk = createAsyncThunk(
    'machines/create',
    async (payload: { name: string; type: 'Pump' | 'Fan' }) => {
        return api.post<any>('/machines', payload);
    },
);

export const updateMachineThunk = createAsyncThunk(
    'machines/update',
    async (payload: { id: number; name: string; type: 'Pump' | 'Fan' }) => {
        return await api.put<{ machine: any }>(`/machines/${payload.id}`, {
            name: payload.name,
            type: payload.type,
        });
    },
);

export const deleteMachineThunk = createAsyncThunk(
    'machines/delete',
    async (id: number) => {
        await api.delete<void>(`/machines/${id}`);
        return true;
    },
);

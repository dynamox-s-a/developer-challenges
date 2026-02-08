import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export type MPRow = {
    id: number;
    machineName: string;
    machineType: 'Pump' | 'Fan';
    monitoringPointName: string;
    sensorModel: 'TcAg' | 'TcAs' | 'HF_PLUS' | null;
};

export type MPListResponse = {
    page: number;
    pageSize: number;
    total: number;
    items: MPRow[];
};

export const fetchMonitoringPointsThunk = createAsyncThunk(
    'monitoringPoints/fetch',
    async (params: {
        page: number;
        pageSize: number;
        sort: string;
        dir: 'asc' | 'desc';
    }) => {
        const qs = new URLSearchParams({
            page: String(params.page),
            pageSize: String(params.pageSize),
            sort: params.sort,
            dir: params.dir,
        });
        return api.get<MPListResponse>(`/monitoring-points?${qs.toString()}`);
    },
);

export const createMonitoringPointThunk = createAsyncThunk(
    'monitoringPoints/create',
    async (payload: { machineId: number; name: string }) => {
        return api.post<{ id: number; machineId: number; name: string }>(
            `/monitoring-points`,
            payload,
        );
    },
);

export const attachSensorThunk = createAsyncThunk(
    'monitoringPoints/attachSensor',
    async (payload: {
        monitoringPointId: number;
        uid: string;
        model: 'TcAg' | 'TcAs' | 'HF_PLUS';
    }) => {
        return api.post(
            `/monitoring-points/${payload.monitoringPointId}/sensor`,
            {
                uid: payload.uid,
                model: payload.model,
            },
        );
    },
);

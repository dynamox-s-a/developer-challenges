import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const authThunk = createAsyncThunk(
    'auth/login',
    async (payload: { email: string; password: string }) => {
        return api.post<{
            accessToken: string;
            user: { id: number; email: string };
        }>('/auth/login', payload);
    },
);

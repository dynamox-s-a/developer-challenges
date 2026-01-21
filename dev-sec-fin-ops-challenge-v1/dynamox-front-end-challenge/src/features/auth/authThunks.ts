import { createAsyncThunk } from '@reduxjs/toolkit'
import type { LoginPayload } from './types'

const FIXED_EMAIL = 'admin@dynamox.com'
const FIXED_PASSWORD = '123456'

export const loginThunk = createAsyncThunk<string, LoginPayload>(
    'auth/login',
    async ({ email, password }) => {
        await new Promise((r) => setTimeout(r, 400))

        if (email !== FIXED_EMAIL || password !== FIXED_PASSWORD) {
            throw new Error('Email ou senha inválidos')
        }

        return 'ok'
    }
)

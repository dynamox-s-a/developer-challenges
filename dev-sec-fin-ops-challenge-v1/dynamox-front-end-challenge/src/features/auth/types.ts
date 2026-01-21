export type AuthState = {
    token: string | null
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

export type LoginPayload = {
    email: string
    password: string
}

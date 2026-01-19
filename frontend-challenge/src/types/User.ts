export type UserRole = 'admin' | 'reader'

export interface User {
    id: number
    email: string
    role: UserRole
}
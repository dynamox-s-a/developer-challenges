export interface UserToken {
    acessToken: string;
    user: {
        id: number;
        email: string;
        name: string;
    }
}
export interface UserToken {
    acessToken: string;
    userData: {
        id: number;
        email: string;
        name: string;
    }
}
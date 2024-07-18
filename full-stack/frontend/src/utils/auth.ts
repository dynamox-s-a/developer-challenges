import { setCookie, parseCookies, destroyCookie } from 'nookies';

export const saveToken = (token: string) => {
    setCookie(null, 'token', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: '/',
        sameSite: 'Lax', // Ajuste conforme necessário: 'Lax', 'Strict' ou 'None'
    });

};

export const getToken = (): string | null => {
    const cookies = parseCookies();
    return cookies.token || null;
};

export const removeToken = () => {
    destroyCookie(null, 'token');
    console.log('Token removido');
};

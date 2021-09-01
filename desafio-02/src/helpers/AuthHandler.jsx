import Cookies from 'js-cookie';

export const isLogged = () => {
    let token = Cookies.get('token');
    return (token) ? true : false;
}

export const doLogin = (token) => {       
        Cookies.set('token', token, {expires:999}); 
    }

export const doLogout = () => {
    Cookies.remove('token');
}
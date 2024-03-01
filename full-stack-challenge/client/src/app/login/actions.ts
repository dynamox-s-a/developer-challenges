import { handleError } from 'client/src/app/core/helpers/handle-error';
import { api } from 'client/src/app/core/libs/axios';
import { LoginFormType } from './types/login-form-type';

export const signIn = async (props: LoginFormType) => {
  try {
    const { email: username, password } = props;
    const { data } = await api.post(
      '/auth/login',
      {},
      {
        auth: { username, password },
      }
    );
    localStorage.setItem('credentials', JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

type SignOutType = () => Promise<any>;
export const signOut: SignOutType = async () => {
  try {
    const { data } = await api.post('/auth/logout');
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

// type RefreshTokenType = (props?: { refreshToken?: string }) => Promise<any>;
// export const refreshToken: RefreshTokenType = async (props) => {
//   let refreshToken = props?.refreshToken;
//   try {
//     if (!refreshToken) {
//       refreshToken = extractRefreshTokenFromCookie()?.refreshToken;
//     }
//     if (refreshToken) {
//       Cookies.remove(AUTH_KEY);
//       Cookies.remove(REFRESH_TOKEN_KEY);
//       const { data } = await api.post('/auth/refreshToken', { refreshToken });
//       return data;
//     }
//   } catch (error) {
//     await signOut();
//     throw handleError(error);
//   }
// };

'use client';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { sleep } from 'client/src/app/core/helpers/sleep-function';
import { ErrorType } from 'client/src/app/core/types/error-type';
import { differenceInSeconds } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { useCookies } from 'react-cookie';
import {
  // refreshToken as refreshTokenService,
  signIn as signInService,
  signOut as signOutService,
} from '../actions';
import { LoginFormType } from '../types/login-form-type';
import UserType from '../types/user-type';

type InitialStateType = {
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  user: UserType | null;
  signing: boolean;
  signIn: UseMutateFunction<any, ErrorType, LoginFormType, unknown>;
  signOut: () => void;
};

const initialState: InitialStateType = {
  isAuthenticating: false,
  isAuthenticated: false,
  user: {} as UserType,
  signing: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signIn: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut: () => {},
};

const Context = React.createContext(initialState);

type AuthProviderType = (props: {
  children: React.ReactNode | React.ReactNode[];
}) => JSX.Element;

export const AuthProvider: AuthProviderType = ({ children }) => {
  const [isAuthenticating, setIsAuthenticating] = React.useState(true);
  const [user, setUser] = React.useState<UserType | null>(null);
  const [cookies] = useCookies(['adminAccessToken']);

  const extractTokenFromCookie = () => {
    const accessToken = cookies['adminAccessToken'];

    if (accessToken) {
      return accessToken;
    }
    return undefined;
  };

  const { mutate: signIn, isPending: signing } = useMutation<
    any,
    ErrorType,
    LoginFormType
  >({
    mutationFn: signInService,
    onSuccess: () => {
      updateAuth();
    },
  });
  const { mutate: signOut } = useMutation({
    mutationFn: signOutService,
    onSettled: () => {
      setUser(null);
    },
  });
  const updateAuth = async () => {
    let authToken = extractTokenFromCookie();
    // const refreshToken = extractRefreshTokenFromCookie();
    const validAccessToken = isAccessTokenValid(authToken);

    // if (!validAccessToken && !!refreshToken) {
    if (!validAccessToken) {
      // await refreshTokenService();
      await sleep(50);
      authToken = extractTokenFromCookie();
    }

    if (authToken) {
      const decodedUser = jwtDecode(authToken) as UserType;

      setUser(decodedUser);
    }

    setIsAuthenticating(false);
  };

  React.useEffect(() => {
    updateAuth();
  }, []);

  return (
    <Context.Provider
      value={{
        isAuthenticating,
        isAuthenticated: !!user,
        user,
        signIn,
        signing,
        signOut,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const AUTH_KEY = 'credentials';

export const REFRESH_TOKEN_KEY =
  'refreshToken' + process.env.NEXT_PUBLIC_ENVIRONMENT;

// export const extractRefreshTokenFromCookie = () => {
//   const refreshTokenString = jsCookie.get(REFRESH_TOKEN_KEY);
//   if (refreshTokenString) {
//     const buffer = Buffer.from(refreshTokenString, 'base64').toString();
//     const refreshToken = JSON.parse(buffer);
//     return refreshToken?.message;
//   }
//   return undefined;
// };

export const isAccessTokenValid = (token: any) => {
  if (!token) {
    return false;
  }

  const diffInSeconds = differenceInSeconds(
    new Date(token.expiresAt),
    new Date()
  );

  return diffInSeconds > 0;
};

export const useAuthContext = () => React.useContext(Context);

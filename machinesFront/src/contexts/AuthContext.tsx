import { createContext, ReactNode, useEffect, useState } from "react";
import { decodeToken } from "../utils/jwtSolving.ts";

type AuthContextProviderProps = {
  children: ReactNode;
};

type AuthContextDataProps = {
  user: IUserContext | null;
  signIn: (token: string) => void;
  logOut: () => void;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
);

interface IUserContext {
  role: string;
  id?: string;
  email?: string;
}
export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<IUserContext | null>(null);

  function signIn(token: string) {
    const userInfos: any = decodeToken(token);

    setUser({
      role: userInfos.profile,
      id: userInfos._id,
      email: userInfos.email,
    });
  }

  function logOut() {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      signIn(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

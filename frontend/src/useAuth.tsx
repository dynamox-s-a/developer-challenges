import * as React from 'react';

export type UserType = {
  id: string;
  name: string;
  email: string;
};

interface AuthContextType {
  authed: boolean;
  user: UserType;
  login: (userData: UserType) => Promise<void>;
  logout: () => Promise<void>;
}

const authContext = React.createContext<AuthContextType | null>(null!);

function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [user, setUser] = React.useState({
    id: '',
    name: '',
    email: '',
  });

  return {
    authed,
    login(userData: UserType) {
      return new Promise<void>((res) => {
        setAuthed(true);
        setUser(userData);
        res();
      });
    },
    logout() {
      return new Promise<void>((res) => {
        setAuthed(false);
        setUser({} as UserType);
        res();
      });
    },
    user,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}

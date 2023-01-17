export interface IDataProps {
  email: string;
  password: string;
}

export interface AuthState {
  email: string | null;
  token: string | null;
}

export interface ResponseUserType {
  accessToken: string;
  user: User;
}

interface User {
  email: string;
  id?: number;
}

export interface ErrorType {
  status: number;
  data: string;
}

export interface IPrivateRouteProps {
  children: React.ReactNode;
}

export interface ResponseProductType {
  id: string;
  nome: string;
  data_de_fabricacao: string;
  produto_perecivel: boolean;
  data_de_validade?: string;
  preco: string;
}

export interface IInputProps {
  title: string;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
}

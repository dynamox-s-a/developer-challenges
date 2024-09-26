import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  // Defina as propriedades esperadas no seu token
  sub: string;
  name: string;
  exp: number;
  // Adicione outras propriedades conforme necessário
};

export const decodeToken = (token: string): DecodedToken => {
  try {
    return jwtDecode(token);
  } catch (error) {
    localStorage.removeItem("jwt");
    window.location.href = "/";
    console.error("Autenticação inválida");
    throw new Error("Token inválido");
  }
};

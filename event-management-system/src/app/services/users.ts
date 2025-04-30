import axios from "axios";
import { ROLES } from "../constants/roles";

const userApi = axios.create({
  baseURL: "http://localhost:3001",
});

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: (typeof ROLES)[keyof typeof ROLES];
  userId: number;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await userApi.get("/users", {
    params: {
      email: payload.email,
      password: payload.password,
    },
  });

  const users = response.data;

  if (users.length > 0) {
    const user = users[0];
    const fakeToken = generateFakeJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now(),
    });

    localStorage.setItem("token", fakeToken);
    localStorage.setItem("role", user.role);
    localStorage.setItem("userId", user.id.toString());

    return {
      token: fakeToken,
      role: user.role,
      userId: user.id,
    };
  } else {
    throw new Error("Credenciais inválidas");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};

function generateFakeJWT(payload: object): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));

  const fakeSignature = btoa("fake-signature-" + Date.now());

  return `${base64Header}.${base64Payload}.${fakeSignature}`;
}

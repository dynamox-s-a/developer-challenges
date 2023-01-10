import { IUser } from "../interfaces/IUser";

const FETCH_URL = "http://localhost:3000/users";
const APP_JSON = "application/json";

export const fetchUser = async (email: string): Promise<IUser | null> => {
  try {
    const response = await fetch(`${FETCH_URL}?email=${email}`, {
      method: "GET",
      headers: { "Content-Type": APP_JSON },
    });

    const data = await response.json();
    console.log("fetchAPI data result", data);

    if (data.length === 0) return null;

    const userInfo = {
      ...data[0],
      token: "@dynamox-desafio-02-token",
    };

    return userInfo satisfies IUser;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

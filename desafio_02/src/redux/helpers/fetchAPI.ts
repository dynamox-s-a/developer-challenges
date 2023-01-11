import { IProduct } from "../interfaces/IProducts";
import { IUser } from "../interfaces/IUser";

const FETCH_USER_URL = "http://localhost:3000/users";
const FETCH_PRODUCT_URL = "http://localhost:3000/products";
const APP_JSON = "application/json";

export const fetchUser = async (email: string): Promise<IUser | null> => {
  try {
    const response = await fetch(`${FETCH_USER_URL}?email=${email}`, {
      method: "GET",
      headers: { "Content-Type": APP_JSON },
    });

    const data = await response.json();

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

export const fetchProducts = async (): Promise<IProduct[] | null> => {
  try {
    const response = await fetch(`${FETCH_PRODUCT_URL}`, {
      method: "GET",
      headers: { "Content-Type": APP_JSON },
    });

    const data = await response.json();

    return data as IProduct[];
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

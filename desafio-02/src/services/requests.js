import axios from "axios";

const API = axios.create({
  baseURL: 'http://localhost:3001'
});

const userURL = "/users";
const productURL = "/products";

export const findUser = async (email) => {
  try {
    const { data } = await API.get(`${userURL}?email=${email}`, {
      headers: { "Content-Type": "application/json" }
    })

    if (data.length === 0) return null;
    const userInfo = {...data[0] };

    return userInfo;

  } catch (error) {
    console.log("error", error.response);
    return error.response;
  }
};
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
    });

    if (data.length === 0) return null;
    const userInfo = {...data[0] };

    return userInfo;  

  } catch (error) {
    console.log("request.js error", error.message);
    return error;
  }
};

export const fetchAllProducts = async () => {
  try {
    const { data } = await API.get(productURL, {
      headers: { "Content-Type": "application/json" }
    });

    if (data.length === 0) return null;
    return data;

  } catch (error) {
    console.log("request.js error", error.message);
    return error;
  }
};

export const addNewProduct = async (product) => {
  try {
    const { data } = await API.post(productURL, product, {
      headers: { "Content-Type": "application/json" }
    });

    if (data.length === 0) return null;
    return data;

  } catch (error) {
    console.log("request.js error", error.message);
    return error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const { data } = await API.put(`${productURL}/${id}`, product, {
      headers: { "Content-Type": "application/json" }
    });

    if (data.length === 0) return null;
    return data;

  } catch (error) {
    console.log("request.js error", error.message);
    return error;
  }
};

export const removeProduct = async (id) => {
  try {
    const { data } = await API.delete(`${productURL}/${id}`, {
      headers: { "Content-Type": "application/json" }
    });
    console.log(data)
    if (data.length === 0) return null;
    return data;

  } catch (error) {
    console.log("error", error.message);
    return error;
  }
};

export const findProduct = async (id) => {
  try {
    const { data } = await API.get(`${productURL}/${id}`, {
      headers: { "Content-Type": "application/json" }
    });
    // if (data.length === 0) return null;
    return data;

  } catch (error) {
    console.log("request.js error", error.message);
    return error;
  }
};
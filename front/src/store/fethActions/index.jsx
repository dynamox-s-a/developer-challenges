import api from "../../services/api";

import {login} from "../ducks/auth";
import {
  getProducts,
  addProduct,
  removeProduct,
  updateProduct,
} from "../ducks/products";

export const authLogin = (user) => {
  return (dispatch) => {
    api
      .post("/", user)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        dispatch(login());

        window.location.pathname = "/products";
      })
      .catch((error) => {
        const {message} = error.response.data;
        return alert(message);
      });
  };
};

export const getAllProducts = () => {
  return (dispatch) => {
    api
      .get("http://localhost:3000/products")
      .then((res) => {
        dispatch(getProducts(res.data));
      })
      .catch(console.log);
  };
};

export const addProductFetch = (product) => {
  return (dispatch) => {
    api
      .post("http://localhost:3000/products", product)
      .then((res) => dispatch(addProduct(res.data)))
      .catch(console.log);
  };
};

export const updateProductFetch = (id, data) => {
  return (dispatch) => {
    api
      .patch(`http://localhost:3000/products/${id}`, data)
      .then((res) => {
        dispatch(updateProduct(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const removeProductFetch = (id) => {
  return (dispatch) => {
    api
      .delete(`http://localhost:3000/products/${id}`)
      .then((res) => {
        dispatch(removeProduct(id));
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

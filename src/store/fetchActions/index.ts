import { AppDispatch } from '..'
import api from '../../services/api'
import {
  createProductAction,
  deleteProductAction,
  getAllProductsAction,
  updateProductAction,
} from '../ducks/products'

import { loginAction } from '../ducks/auth'
interface Product {
  id: string
  name: string
  manufacturingDate: string
  perishable: boolean
  expirationDate: string
  price: number
}

interface User {
  email: string
  password: string
}

// json-auth-server
// 660 -> User must be logged to write or read the resource.

export const getAllProducts = () => {
  return (dispatch: AppDispatch) => {
    api
      .get('/660/products', {
        headers: {
          Authorization: `Bearer ${
            sessionStorage.getItem('@dynamox-challenge-02-token') || ''
          }`,
        },
      })
      .then((res) => {
        dispatch(getAllProductsAction(res.data))
      })
      .catch((error) => {
        console.log(error)
        const { data } = error.response
        alert(data)
      })
  }
}

export const createProduct = (product: Product) => {
  return (dispatch: AppDispatch) => {
    api
      .post('/660/products', product, {
        headers: {
          Authorization: `Bearer ${
            sessionStorage.getItem('@dynamox-challenge-02-token') || ''
          }`,
        },
      })
      .then((res) => {
        dispatch(createProductAction(res.data))
      })
      .catch((error) => {
        const { data } = error.response
        alert(data)
      })
  }
}

export const updateProduct = (product: Product) => {
  return (dispatch: AppDispatch) => {
    api
      .put(`/660/products/${product.id}`, product, {
        headers: {
          Authorization: `Bearer ${
            sessionStorage.getItem('@dynamox-challenge-02-token') || ''
          }`,
        },
      })
      .then((res) => {
        dispatch(updateProductAction(product))
      })
      .catch((error) => {
        const { data } = error.response
        alert(data)
      })
  }
}

export const deleteProduct = (id: string) => {
  return (dispatch: AppDispatch) => {
    api
      .delete(`/660/products/${id}`, {
        headers: {
          Authorization: `Bearer ${
            sessionStorage.getItem('@dynamox-challenge-02-token') || ''
          }`,
        },
      })
      .then((res) => {
        dispatch(deleteProductAction(id))
      })
      .catch((error) => {
        const { data } = error.response
        alert(data)
      })
  }
}

export const authLogin = (user: User) => {
  return (dispatch: AppDispatch) => {
    api
      .post(`login/`, user)
      .then((res) => {
        console.log(res.data)
        sessionStorage.setItem(
          '@dynamox-challenge-02-token',
          res.data.accessToken,
        )
        dispatch(loginAction())
        window.location.pathname = '/'
      })
      .catch((error) => {
        const { data } = error.response
        alert(data)
      })
  }
}

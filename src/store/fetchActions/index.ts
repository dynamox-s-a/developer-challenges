import { AppDispatch } from '..'
import api from '../../services/api'
import {
  createProductAction,
  deleteProductAction,
  getAllProductsAction,
  updateProductAction,
} from '../ducks/products'

interface Product {
  id: string
  name: string
  manufacturingDate: string
  perishable: boolean
  expirationDate: string
  price: number
}

export const getAllProducts = () => {
  return (dispatch: AppDispatch) => {
    api
      .get('/products')
      .then((res) => {
        dispatch(getAllProductsAction(res.data))
      })
      .catch(console.log)
  }
}

export const createProduct = (product: Product) => {
  return (dispatch: AppDispatch) => {
    api
      .post('/products', product)
      .then((res) => {
        dispatch(createProductAction(res.data))
      })
      .catch(console.log)
  }
}

export const updateProduct = (product: Product) => {
  return (dispatch: AppDispatch) => {
    api
      .put(`/products/${product.id}`, product)
      .then((res) => {
        dispatch(updateProductAction(product))
      })
      .catch(console.log)
  }
}

export const deleteProduct = (id: string) => {
  return (dispatch: AppDispatch) => {
    api
      .delete(`/products/${id}`)
      .then((res) => {
        dispatch(deleteProductAction(id))
      })
      .catch(console.log)
  }
}

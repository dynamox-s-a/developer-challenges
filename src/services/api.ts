import axios from 'axios'

interface Product {
  id: string
  name: string
  manufacturingDate: string
  perishable: boolean
  expirationDate: string
  price: number
}

axios.defaults.baseURL = 'http://localhost:3333'

export async function getProducts() {
  return axios.get('/products')
}

export async function getProductById(id: string | undefined) {
  return axios.get(`/products/${id}`)
}

export async function createProduct(product: Product) {
  return axios.post('/products', product)
}

export async function updateProduct(product: Product) {
  return axios.put(`/products/${product.id}`, product)
}

export async function deleteProductById(id: string) {
  return axios.delete(`/products/${id}`)
}

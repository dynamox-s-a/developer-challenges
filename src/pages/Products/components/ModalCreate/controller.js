import { api } from 'src/services/api'

export const handleCreateProduct = async product => {
  const response = await api.post('/products', {
    ...product,
    expirationDate: product.perishable ? product.expirationDate : null,
  })
  return response.data
}

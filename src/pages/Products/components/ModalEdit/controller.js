import { api } from 'src/services/api'

export const handleEditProduct = async product => {
  const response = await api.put(`/products/${product.id}`, {
    ...product,
    expirationDate: product.perishable ? product.expirationDate : null,
  })
  return response.data
}

import api from './api'

export async function getProducts(config) {
  const response = await api.get("/products", config);
  return response.data;
}

export async function postNewProduct(values, config) {
  const response = await api.post("/products", values, config);
  return response.data;
}


// export async function deleteApplication(id, config) {
//   const response = await api.delete(`/applications/${id}/delete`, config);
//   return response.data;
// }

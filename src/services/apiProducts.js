import api from './api'

export async function getProducts() {
  const response = await api.get("/products");
  return response.data;
}

// export async function deleteApplication(id, config) {
//   const response = await api.delete(`/applications/${id}/delete`, config);
//   return response.data;
// }

const defaultUrl = "http://localhost:3000/produtos";
const loginUrl = 'https://rickmorty-api1.herokuapp.com/auth'

export const api = {

  createProduct: async (product) => {
    const response = await fetch(defaultUrl + "/", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(product),
    });
    const newProduct = await response.json();
    return newProduct;
  },

  getAllProducts: async () => {
    const response = await fetch(defaultUrl + "/");
    const allProducts = await response.json();
    return allProducts;
  },

  updateProduct: async (productUpdate, id) => {
    const response = await fetch(defaultUrl + "/" + id, {
      method: "PUT",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(productUpdate),
    });
    const productUpdated = await response.json();
    return productUpdated
  },

  deleteProduct: async (productId) => {
    const response = await fetch(defaultUrl + "/" + productId, {
      method: "DELETE",
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const productDeleted = await response.json();
    return productDeleted;
  },
};

export const apiLogin = {

  loginAPI: async (login) => {
    localStorage.removeItem("userToken");
    const response = await fetch(loginUrl + "/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(login),
    });
    const newLogin = await response.json();

    if (newLogin.token) {
      localStorage.setItem("userToken", newLogin.token);
      alert("Login efetuado com sucesso!!!")
      window.location.reload();
      return
    }
    alert("email ou senha incorretos")
    window.location.reload();
    return;
  }
}

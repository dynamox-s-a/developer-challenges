import { useEffect, useState } from "react";
import { getProducts } from "../../services/apiProducts";
import RenderProducts from "./renderProducts";

export default function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function ViewProducts() {
      try {
        const products = await getProducts();
        setProducts(products);
        console.log(products);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    }
    ViewProducts();
  }, []);

  
  return RenderProducts(products);
}

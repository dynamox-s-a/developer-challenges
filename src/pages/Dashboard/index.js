import { useEffect, useState } from "react";
import { getProducts } from "../../services/apiProducts";

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

  function RenderProducts() {
    if (products.length === 0) {
      return <p>Não há nenhum produto cadastrado ainda!</p>;
    }

    return products.map((product) => {
      return (
        <>
          <p> Nome: {product.name}</p>
          <p> Data de fabricação: {product.fabricationDate}</p>
          <p>
            {product.perishable
              ? `Data de validade: ${product.validationDate}`
              : null}
          </p>
          <p> Preço: {product.price}</p>
        </>
      );
    });
  }

  console.log("dash");
  return <RenderProducts />;
}

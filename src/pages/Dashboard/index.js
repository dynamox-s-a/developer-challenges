import { useEffect, useState } from "react";
import { getProducts } from "../../services/apiProducts";
import RenderProducts from "./renderProducts";
import { Header, Footer } from "./styles";
import { useNavigate } from "react-router-dom";
import OrderByMenu from "./orderByMenu";
import useConfigHeaders from "../../utils/useConfigHeaders";

export default function Dashboard() {
  const config = useConfigHeaders();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function ViewProducts() {
      try {
        const products = await getProducts(config);
        setProducts(products);
        console.log(products);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    }
    ViewProducts();
  }, []);

  return (
    <>
      <Header>
        <button onClick={() => navigate("/products/new")}>NOVO PRODUTO</button>
        <p>{OrderByMenu()}</p>
      </Header>
      {RenderProducts(products)}
      <Footer>
        <p>Próxima página</p>
      </Footer>
    </>
  );
}

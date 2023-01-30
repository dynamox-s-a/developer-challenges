import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "./styles";
import { getProducts } from "../../services/apiProducts";
import useConfigHeaders from "../../utils/useConfigHeaders";
import RenderProducts from "./renderProducts";
import OrderByMenu from "./orderByMenu";

export default function Dashboard() {
  const config = useConfigHeaders();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function ViewProducts() {
      try {
        const products = await getProducts(page, sort, config);
        setProducts(products);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    }
    ViewProducts();
  }, [page, sort]);

  return (
    <>
      <Header>
        <button onClick={() => navigate("/products/new")}>NOVO PRODUTO</button>
        <p>{OrderByMenu({sort, setSort})}</p>
      </Header>
      {RenderProducts(products)}
      <Footer>
        <p
          onClick={() => {
            if (page > 1) setPage(page - 1);
          }}
        >
          Página anterior
        </p>
        <p
          onClick={() => {
            setPage(page + 1);
          }}
        >
          Próxima página
        </p>
      </Footer>
    </>
  );
}

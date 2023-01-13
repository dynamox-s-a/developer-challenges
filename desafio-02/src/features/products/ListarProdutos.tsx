import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectProducts,
  listar,
  selectProductsCount,
  remover,
  selecionarProduto,
} from "./productsSlice";
import ReactPaginate from "react-paginate";
import {
  editarProduto,
  itemsPorPagina,
  Ordenacao,
  Produto,
} from "./productsAPI";
import { useNavigate } from "react-router-dom";

export function ListarProdutos() {
  const products = useAppSelector(selectProducts);
  const count = useAppSelector(selectProductsCount) || 0;
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<Ordenacao>({ order: "asc", sort: "nome" });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listar({ pagina: page, ordenacao: order }));
  }, [dispatch, page, order]);

  const handlePageClick = (event: any) => {
    setPage(event.selected + 1);
  };

  const handleOrder = (coluna: string) => {
    setOrder((o) => {
      if (o.sort !== coluna) return { order: "asc", sort: coluna };
      return { order: o.order === "asc" ? "desc" : "asc", sort: coluna };
    });
  };

  const handleDelete = async (id: number) => {
    await dispatch(remover(id));
    await dispatch(listar({ pagina: page, ordenacao: order }));
  };

  const handleEdit = async (produto: Produto) => {
    await dispatch(selecionarProduto(produto));
    navigate("/produtos/editar");
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleOrder("nome")}>Nome</th>
            <th onClick={() => handleOrder("fabricacao")}>Fabricação</th>
            <th onClick={() => handleOrder("perecivel")}>Perecivel</th>
            <th onClick={() => handleOrder("validade")}>Validade</th>
            <th onClick={() => handleOrder("valor")}>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {products?.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.fabricacao}</td>
              <td>{p.perecivel ? "Sim" : "Não"}</td>
              <td>{p.validade}</td>
              <td>
                {p.valor.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => p.id && handleDelete(p.id)}>
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        pageCount={Math.ceil(count / itemsPorPagina)}
        pageRangeDisplayed={itemsPorPagina}
        nextLabel=">"
        previousLabel="<"
        onPageChange={handlePageClick}
      />
    </>
  );
}

import { SyntheticEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Produto } from "./productsAPI";
import { editar, selectEditProduct } from "./productsSlice";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";

export function EditarProduto() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editProduct = useAppSelector(selectEditProduct);

  const [error, setError] = useState(false);

  const [produto, setProduto] = useState<Produto>({
    ...editProduct!,
    fabricacao: editProduct
      ? DateTime.fromFormat(editProduct.fabricacao, "dd/LL/yyyy").toISODate()
      : "",
    validade:
      editProduct && editProduct.validade
        ? DateTime.fromFormat(editProduct.validade, "dd/LL/yyyy").toISODate()
        : "",
  });

  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();
    const fabricacao = DateTime.fromISO(produto.fabricacao);
    const validade = produto.validade && DateTime.fromISO(produto.validade);

    if (produto.perecivel && validade && fabricacao > validade)
      return setError(true);

    await dispatch(
      editar({
        ...produto,
        fabricacao: fabricacao.toFormat("dd/LL/yyyy"),
        validade: validade && validade.toFormat("dd/LL/yyyy"),
      })
    );

    navigate("/produtos");
  };

  return (
    <div>
      {error && <p>Data de fabricação não pode ser maior que a de validade</p>}
      <form onSubmit={submitHandler}>
        <label>
          Nome:
          <input
            type="text"
            name="nome"
            value={produto.nome}
            onChange={(e) =>
              setProduto((p) => ({ ...p, nome: e.target.value }))
            }
          />
        </label>
        <label>
          Fabricação:
          <input
            type="date"
            name="fabricacao"
            value={produto.fabricacao}
            onChange={(e) =>
              setProduto((p) => ({
                ...p,
                fabricacao: e.target.value,
              }))
            }
          />
        </label>
        <label>
          Validade:
          <input
            type="date"
            disabled={!produto.perecivel}
            value={produto.validade}
            name="validade"
            onChange={(e) =>
              setProduto((p) => ({
                ...p,
                validade: e.target.value,
              }))
            }
          />
        </label>
        <label>
          Perecivel:
          <input
            type="checkbox"
            name="perecivel"
            checked={produto.perecivel}
            onChange={(e) => {
              setProduto((p) => ({
                ...p,
                perecivel: e.target.checked,
                validade: e.target.checked ? p.validade : "",
              }));
            }}
          />
        </label>
        <label>
          Valor:
          <input
            type="number"
            name="valor"
            value={produto.valor}
            onChange={(e) =>
              setProduto((p) => ({ ...p, valor: Number(e.target.value) }))
            }
          />
        </label>
        <input type="submit" value="Editar" />
      </form>
    </div>
  );
}

import { useState } from "react";
import { api } from "../../utils/Api/Api";
import "./Form.css"

export function Form() {
  const [newProduct, setNewProduct] = useState();

  async function handleSubmit(event) {
    event.preventDefault();

    setNewProduct({ ...newProduct });
    var qtdForm = 0;
    var key
    for (key in newProduct) {
      if (newProduct.hasOwnProperty(key)) {
        qtdForm++;
      }
    }

    if (newProduct.nome == "" || newProduct.dataFabricacao == "" || newProduct.perecivel == "" || newProduct.dataValidade == "" || newProduct.preco == "" || qtdForm < 5) {
      alert("Preencha todos os campos")
    } else if (newProduct.perecivel != "false" && newProduct.perecivel != "true") {
      alert("Informe 'false' ou 'true' no campo produto perecivel")
    } else if (newProduct.perecivel === "true" && newProduct.dataValidade < newProduct.dataFabricacao) {
      console.log(newProduct)
      alert("Data de validade deve ser maior que data de fabricação")
    } else {
      if (newProduct.perecivel === "false") {
        newProduct.dataValidade = ""
      }
      await api.createProduct(newProduct);
      window.location.reload();
    }
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit} className="form-inputs">
        <section>
          <span>Nome: </span>
          <input className='form-nome'
            type="text"
            name="nome"
            onChange={(event) => {
              setNewProduct({ ...newProduct, nome: event.target.value });
            }}
          ></input>
        </section>
        <section>
          <span>Data de fabricação: </span>
          <input className='form-dataFabricacao'
            type="text"
            name="dataFabricacao"
            onChange={(event) => {
              setNewProduct({ ...newProduct, dataFabricacao: +event.target.value });
            }}
          ></input>

        </section>
        <section>
          <span>Produto perecivel: </span>
          <input className='form-perecivel'
            type="text"
            name="perecivel"
            onChange={(event) => {
              setNewProduct({ ...newProduct, perecivel: event.target.value });
            }}
          ></input>

        </section>
        <section>
          <span>Data de validade: </span>
          <input className='form-dataValidade'
            type="text"
            name="dataValidade"
            onChange={(event) => {
              setNewProduct({ ...newProduct, dataValidade: +event.target.value });
            }}
          ></input>

        </section>
        <section>
          <span>Preço: R$</span>
          <input className='form-preco'
            type="text"
            name="preco"
            onChange={(event) => {
              setNewProduct({ ...newProduct, preco: +event.target.value });
            }}
          ></input>

        </section><br />
        <button type="submit" className="btn-submit">
          ADICIONAR
        </button>
      </form>
    </div>
  );
}
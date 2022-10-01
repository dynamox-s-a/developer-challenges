import React from 'react'
import { Card } from '../../components/Card/Card'
import { api } from '../../utils/Api/Api'
import { useState, useEffect } from 'react'
import Modal from "react-modal"
import { CgClose } from "react-icons/cg"
import { useDispatch, useSelector } from "react-redux"
import { addProducts } from '../../components/Features/productsSlice'
import './Home.css'
import Button from '@mui/material/Button'

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "45rem",
    height: "28rem",
    transform: "translate(-50%, -50%)",
    backgroundColor: " rgba(0, 0, 0, 0.8)",
    borderRadius: "15px",
    color: "white",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.4)",
  },
};

Modal.setAppElement("#root");

export function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uniqueProduct, setUniqueProduct] = useState({});
  const [editProduct, setEditProduct] = useState(false);
  const [page, setPage] = useState(0)
  const productsRedux = useSelector(state => state.products.value)

  const totalCards = productsRedux.length
  const dispatch = useDispatch()

  function handleModal() {
    setModalIsOpen(!modalIsOpen);
    setEditProduct(!true)
  }

  function returnPage() {
    if (page != 0) {
      setPage(page - 10)
    }
  }

  function nextPage() {
    if ((Math.floor(totalCards / 10)) != (page / 10)) {
      setPage(page + 10)
    }
  }

  async function getProduct() {
    if (localStorage.getItem("userToken")) {

      const products = await api.getAllProducts();

      dispatch(addProducts(products))

    }
  }

  async function deleteProduct(productId) {
    await api.deleteProduct(productId);
    getProduct()
    handleModal();
  }

  async function updateOneProduct(event) {
    event.preventDefault();

    const product = {
      id: event.target.id.value,
      nome: event.target.nome.value,
      dataFabricacao: event.target.dataFabricacao.value,
      perecivel: event.target.perecivel.value,
      dataValidade: event.target.dataValidade.value,
      preco: +event.target.preco.value,
    }

    if (product.perecivel === "false") {
      product.dataValidade = ""
    }

    if (product.nome === "" || product.dataFabricacao === "" || product.perecivel === "" || product.preco === "") {
      alert("Preencha todos os campos")
    } else if (product.perecivel !== "false" && product.perecivel !== "true") {
      alert("Informe 'Sim' ou 'Não' no campo produto perecivel")
    } else if (product.perecivel === "true" && product.dataValidade < product.dataFabricacao) {
      alert("Data de validade deve ser maior que data de fabricação")
    } else {
      await api.updateProduct(product, product.id);
      getProduct()
      handleModal();
    }
  }

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="Home">
      <div className="card-list">
        {productsRedux.map((item, index) => {
          if (index >= page && index < page + 10) {
            return (
              <button
                className="button-card"
                onClick={() => {
                  setUniqueProduct(item);
                  handleModal();
                }}
                key={index}
              >
                <Card
                  key={index}
                  nome={item.nome}
                  dataFabricacao={item.dataFabricacao}
                  perecivel={item.perecivel}
                  dataValidade={item.dataValidade}
                  preco={item.preco}
                />
              </button>
            )
          };
        })}
      </div>
      <div className='btn-pages'>
        <Button className="btn-return" variant="contained" component="label" size="large"
          onClick={() => {
            returnPage();
          }}>Anterior</Button>
        <Button className="btn-next" variant="contained" component="label" color="success" size="large"
          onClick={() => {
            nextPage();
          }}>Proximo</Button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModal}
        style={customStyles}
        contentLabel="Card details"
      >
        {editProduct ? (
          <>
            <div className="form-update">
              <form onSubmit={updateOneProduct} className="form-inputs-update">
                <section>
                  <span>Id: </span>
                  <input className="form-id-update"
                    disabled
                    type="text"
                    name="id"
                    defaultValue={uniqueProduct.id}
                  ></input>
                </section>
                <section>
                  <span>Título: </span>
                  <input className="form-nome-update"
                    type="text"
                    name="nome"
                    defaultValue={uniqueProduct.nome}
                  ></input>
                </section>
                <section>
                  <span>Data de fabricação: </span>
                  <input className="form-dataFabricacao-update"
                    type="month"
                    name="dataFabricacao"
                    defaultValue={uniqueProduct.dataFabricacao}
                  ></input>

                </section>
                <section>
                  <span>Produto perecivel: </span>
                  <select className="form-perecivel-update"
                    name="perecivel"
                    defaultValue={uniqueProduct.perecivel}
                  ><option value="true">Sim</option>
                    <option value="false">Não</option></select>

                </section>
                <section>
                  <span>Data de validade: </span>
                  <input className="form-dataValidade-update"
                    type="month"
                    name="dataValidade"
                    defaultValue={uniqueProduct.dataValidade}
                  ></input>

                </section>
                <section>
                  <span>Preço: R$</span>
                  <input className="form-preco-update"
                    type="number"
                    name="preco"
                    defaultValue={uniqueProduct.preco}
                  ></input>

                </section><br />
                <button type="submit-update" className="btn-submit-update">
                  EDITAR PRODUTO
                </button>
              </form>
            </div>

          </>
        ) : (
          <>
            <section>
              <section
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <button
                  style={{
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={handleModal}
                >
                  <CgClose size={28} color="red" />
                </button>
              </section>
              <section className='modal-link'>
                <h2>Nome: {uniqueProduct.nome}</h2>
                <h3>Data de fabricação: {uniqueProduct.dataFabricacao}</h3>
                <h3>perecivel: {uniqueProduct.perecivel}</h3>
                <h3>Data de validade: {uniqueProduct.dataValidade}</h3>
                <h3>Preço: R${uniqueProduct.preco}</h3>
                <br />
              </section>
            </section><br />
            <button className="btn-update"
              onClick={() => {
                setEditProduct(true);

              }}
            >
              EDITAR PRODUTO
            </button><br />
            <button className='btn-delete'
              onClick={() => {
                deleteProduct(uniqueProduct.id);
              }}
            >
              DELETAR PRODUTO
            </button>
          </>
        )
        }
      </Modal >

    </div >


  );
}
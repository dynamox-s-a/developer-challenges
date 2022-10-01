import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetProducts } from '../redux/actions';
import NavBar from '../components/NavBar';
import '../styles/Table.css'

function AllProducts() {
  const [allProducts, setAllProducts] = useState([])
  const dispatch = useDispatch();
  
  const arr = useSelector(({productsArr}) => productsArr)

  const listAll = async () => {
  const { data } = await getAllProducts();
  console.log(data)
  setAllProducts(data)

  dispatch(actionGetProducts(data))
}

useEffect(() => {
  setAllProducts(arr)
}, [])

  return (
    <main>
      <NavBar />
      <h1>Lista de Produtos</h1>
      <div className='button-container'>
        <button
          className='button-list'
          type='button'
          onClick={() => listAll()}
        >
          Listar Produtos do Banco de dados
        </button>
      </div>
      <table className="table-container">
        <thead className="table-header">
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Data de Fabricação</th>
            <th>Perecível</th>
            <th>Data de Validade</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          { allProducts && allProducts.map((product, index) => (
            <tr className="table-row" key={ index }>
              <td>
                {product.id}
              </td>
              <td>
                {product.nome}
              </td>
              <td>
                {product.fabricacao}
              </td>
              <td>
                {`${product.perecivel}`}
              </td>
              <td>
              {product.validade}
              </td>
              <td>
                {`R$ ${product.preco}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default AllProducts;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Products() {
  const [allProducts, setAllProducts] = useState([])
  const dispatch = useDispatch();


  return (
    <>
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
    </>
  )
}

export default Products
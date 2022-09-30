import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { actionGetProducts } from '../redux/actions';


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
      <h1>Lista de Produtos</h1>
      <button
      type='button'
      onClick={() => listAll()}
      >Listar</button>
      <table>
        <thead>
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
            <tr key={ index }>
              <td>
                {product.id}
              </td>
              <td>
                {product.nome}
              </td>
              <td>
                {moment((new Date(product.fabricacao)).toString()).format('DD/MM/yyyy')}
              </td>
              <td>
                {`${product.perecivel}`}
              </td>
              <td>
              {moment((new Date(product.validade)).toString()).format('DD/MM/yyyy')}
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

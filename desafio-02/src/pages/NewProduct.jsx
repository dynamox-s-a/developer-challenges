import React, { useState } from "react";
import { createProduct } from "../services/api";
import { useDispatch } from 'react-redux';
import { actionRegisterProduct } from "../redux/actions";
import NavBar from "../components/NavBar";


function NewProduct() {
  const [nome, setNome] = useState('');
  const [fabricacao, setFabricacao] = useState('');
  const [perecivel, setPerecivel] = useState();
  const [validade, setValidade] = useState('');
  const [preco, setPreco] = useState();
  const dispatch = useDispatch();

  const register = async () => {
    alert('Produto Cadastrado')
    await createProduct({nome, fabricacao, perecivel, validade, preco })
    dispatch(actionRegisterProduct({nome, fabricacao, perecivel, validade, preco }))
  }

  return (
    <>
      <NavBar />
      <h1>Cadastrar novo produto</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data de Fabricação</th>
            <th>Perecível</th>
            <th>Data de Validade</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
              name="nome"
              placeholder="Seu nome"
              type='text'
              value={ nome }
              onChange={ ({ target: { value } }) => setNome(value) }
              />
            </td>
            <td>
              <input
              name="fabricacao"
              placeholder="Data de Fabricação"
              type="date"
              value={ fabricacao }
              onChange={ ({ target: { value } }) => setFabricacao(value) }
              />
            </td>
            <td>
            <select onChange={ ({ target: { value } }) => setPerecivel(value) }>
            <option value={true} >Verdadeiro</option>
            <option value={false} >Falso</option>
            </select>
              {/* <input
              name="perecivel"
              placeholder="true or false"
              type="text"
              value={ perecivel }
              onChange={ ({ target: { value } }) => setPerecivel(value) }
              /> */}
            </td>
            <td>
              <input
              name="validade"
              placeholder="Data de Validade"
              type="date"
              value={ validade }
              onChange={ ({ target: { value } }) => setValidade(value) }
              />
            </td>

            <td>
              <input
              name="valor"
              placeholder="Preço (R$)"
              type='number'
              value={ preco }
              
              onChange={ ({ target: { value } }) => setPreco(value) }
              />
            </td>
          </tr>
        </tbody>
      </table>
        <button
          name="cadastro"
          type="submit"
          onClick={ () => register() }
        >
          Cadastrar
        </button>
    </>
  );

}

export default NewProduct;

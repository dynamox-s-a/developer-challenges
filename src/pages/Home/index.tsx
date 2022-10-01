import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { deleteProduct, getAllProducts } from '../../store/fetchActions'

import { Pencil, PlusCircle, Trash } from 'phosphor-react'
import * as S from './styles'

export function Home() {
  const navigate = useNavigate()

  const products = useAppSelector((state) => state.products)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  function handleDeleteProduct(id: string) {
    dispatch(deleteProduct(id))
  }

  return (
    <>
      <S.Header>
        <h1>Produtos</h1>
        <button onClick={() => navigate('/create')}>
          <PlusCircle size={16} />
          Criar
        </button>
      </S.Header>
      <S.TableContainer>
        {products.length === 0 ? (
          <span>Ainda não existem produtos cadastrados.</span>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Data de fabricação</th>
                <th>Produto perecível</th>
                <th>Data de validade</th>
                <th>Preço</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.manufacturingDate}</td>
                  <td>{product.perishable ? 'Sim' : 'Não'}</td>
                  <td>{product.expirationDate}</td>
                  <td>R${product.price}</td>
                  <td>
                    <S.EditProductContainer>
                      <S.IconContainer
                        title="Editar"
                        onClick={() => navigate(`/edit/${product.id}`)}
                      >
                        <Pencil size={24} />
                      </S.IconContainer>
                      <S.IconContainer
                        title="Excluir"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash size={24} />
                      </S.IconContainer>
                    </S.EditProductContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </S.TableContainer>
    </>
  )
}

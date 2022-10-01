import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { deleteProduct, getAllProducts } from '../../store/fetchActions'

import { Pagination } from '../../components/Pagination'

import { Pencil, PlusCircle, Trash } from 'phosphor-react'
import * as S from './styles'
import { getProductAction } from '../../store/ducks/products'

export function Home() {
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(10)

  const products = useAppSelector((state) => state.products.products)
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  function handleEditProduct(id: string) {
    dispatch(getProductAction(id))
    navigate(`/edit/${id}`)
  }

  function handleDeleteProduct(id: string) {
    dispatch(deleteProduct(id))
  }

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  )

  // Change page
  function paginate(pageNumber: number) {
    setCurrentPage(pageNumber)
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
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    {new Date(product.manufacturingDate).toLocaleDateString(
                      'pt-BR',
                    )}
                  </td>
                  <td>{product.perishable ? 'Sim' : 'Não'}</td>
                  <td>
                    {product.expirationDate
                      ? new Date(product.manufacturingDate).toLocaleDateString(
                          'pt-BR',
                        )
                      : '-'}
                  </td>
                  <td>R${product.price}</td>
                  <td>
                    <S.EditProductContainer>
                      <S.IconContainer
                        title="Editar"
                        onClick={() => handleEditProduct(product.id)}
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
      <Pagination
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </>
  )
}

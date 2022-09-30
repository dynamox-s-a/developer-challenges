import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, PlusCircle, Trash } from 'phosphor-react'
import * as S from './styles'
import { deleteProductById, getProducts } from '../../services/api'

interface Product {
  id: string
  name: string
  manufacturingDate: string
  perishable: boolean
  expirationDate: string
  price: number
}

export function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [errorLoading, setErrorLoading] = useState<boolean>(false)
  const [errorDeleting, setErrorDeleting] = useState<boolean>(false)

  const navigate = useNavigate()

  useEffect(() => {
    async function handleLoadingProducts() {
      try {
        const response = await getProducts()
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        setErrorLoading(true)
      }
    }

    handleLoadingProducts()
  }, [])

  async function handleDeleteProduct(id: string) {
    try {
      await deleteProductById(id)
      const response = await getProducts()
      setProducts(response.data)
    } catch (error) {
      setErrorDeleting(true)
    }
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
        {loading && !errorLoading && <span>Carregando...</span>}
        {errorLoading && (
          <span>Desculpe, não foi possível carregar os produtos.</span>
        )}
        {products.length !== 0 && (
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
      {errorDeleting && (
        <span>Desculpe, não foi possível deletar o produto.</span>
      )}
    </>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import { getProductById, updateProduct } from '../../services/api'

import * as S from './styles'

const schema = zod.object({
  name: zod.string().min(1),
  manufacturingDate: zod.string().min(1),
  expirationDate: zod.string().min(1),
  price: zod.string().min(1),
  perishable: zod.boolean(),
})

type ProductValidateSchema = zod.infer<typeof schema>
interface Product {
  id: string
  name: string
  manufacturingDate: string
  perishable: boolean
  expirationDate: string
  price: number
}

type Params = {
  id: string | undefined
}

export function Edit() {
  const { register, handleSubmit, reset } = useForm<ProductValidateSchema>({
    resolver: zodResolver(schema),
  })

  const [product, setProduct] = useState<Product | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingError, setLoadingError] = useState<boolean>(false)
  const [editingError, setEditingError] = useState<boolean>(false)

  const { id } = useParams<Params>()

  const navigate = useNavigate()

  useEffect(() => {
    async function handleFetchingProduct() {
      try {
        const response = await getProductById(id)
        setProduct(response.data)
        reset(response.data)
        setLoading(false)
      } catch (error) {
        setLoadingError(true)
      }
    }

    handleFetchingProduct()
  }, [id, reset])

  async function handleEditProduct(data: any) {
    try {
      await updateProduct({ id, ...data })
      navigate('/')
    } catch (error) {
      setEditingError(true)
    }
  }

  return (
    <>
      <h1>Editar produto</h1>
      {loading && !loadingError && <span>Carregando...</span>}
      {loadingError && <span>Não foi possível carregar o produto.</span>}
      {product && (
        <S.Form onSubmit={handleSubmit((data) => handleEditProduct(data))}>
          <S.InputContainer>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              placeholder="Ex: Sabão em pó"
              {...register('name')}
            />
          </S.InputContainer>
          <S.InputContainer>
            <label htmlFor="manufacturingDate">Data de fabricação</label>
            <input
              type="text"
              placeholder="Ex: 01/01/2022"
              {...register('manufacturingDate')}
            />
          </S.InputContainer>
          <S.InputContainer>
            <label htmlFor="expirationDate">Data de validade</label>
            <input
              type="text"
              placeholder="Ex: 01/01/2023"
              {...register('expirationDate')}
            />
          </S.InputContainer>
          <S.InputContainer>
            <label htmlFor="price">Preço</label>
            <input type="string" placeholder="R$4,00" {...register('price')} />
          </S.InputContainer>
          <S.CheckBoxContainer>
            <label htmlFor="perishable">Produto perecível</label>
            <input type="checkbox" {...register('perishable')} />
          </S.CheckBoxContainer>
          <button type="submit">Salvar</button>
          {editingError && <span>Não foi possível editar o produto.</span>}
        </S.Form>
      )}
    </>
  )
}

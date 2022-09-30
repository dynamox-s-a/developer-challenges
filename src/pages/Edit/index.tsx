import { useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../store/hooks'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import * as S from './styles'
import { useEffect, useState } from 'react'
import { updateProduct } from '../../store/fetchActions'

const schema = zod.object({
  id: zod.string(),
  name: zod.string().min(1),
  manufacturingDate: zod.string().min(1),
  expirationDate: zod.string().min(1),
  price: zod.number(),
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

  const { id } = useParams<Params>()

  const products = useAppSelector((state) => state.products)
  const dispatch = useAppDispatch()

  const [product, setProduct] = useState<Product | undefined>(undefined)

  useEffect(() => {
    setProduct(products.find((item) => item.id === id))

    reset(product)
  }, [id, products, product, reset])

  const navigate = useNavigate()

  async function handleEditProduct(data: Product) {
    dispatch(updateProduct(data))
    navigate('/')
  }

  return (
    <>
      <h1>Editar produto</h1>
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
          <input type="number" placeholder="R$4,00" {...register('price')} />
        </S.InputContainer>
        <S.CheckBoxContainer>
          <label htmlFor="perishable">Produto perecível</label>
          <input type="checkbox" {...register('perishable')} />
        </S.CheckBoxContainer>
        <button type="submit">Salvar</button>
      </S.Form>
    </>
  )
}

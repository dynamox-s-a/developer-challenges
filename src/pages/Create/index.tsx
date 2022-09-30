import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import InputMask from 'react-input-mask'

import { useState } from 'react'

import { createProduct } from '../../services/api'

import * as S from './styles'
import { useNavigate } from 'react-router-dom'

const schema = zod.object({
  name: zod.string().min(1),
  manufacturingDate: zod.string(),
  expirationDate: zod.string(),
  price: zod.string(),
  perishable: zod.boolean(),
})

// interface CreateProductProps {
//   name: string
//   manufacturingDate: string
//   perishable: boolean
//   expirationDate: string
//   price: number
// }

// interface Product {
//   id: string
//   name: string
//   manufacturingDate: string
//   perishable: boolean
//   expirationDate: string
//   price: number
// }

export function Create() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  })

  const navigate = useNavigate()

  const [error, setError] = useState<boolean>(false)

  async function handleCreateProduct(data: any) {
    try {
      const product = { id: String(Date.now()), ...data }
      await createProduct(product)
      navigate('/')
    } catch (error) {
      setError(true)
    }
  }

  return (
    <>
      <h1>Criar produto</h1>
      <S.Form onSubmit={handleSubmit((data) => handleCreateProduct(data))}>
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
          <InputMask
            mask="99/99/9999"
            type="text"
            placeholder="Ex: 01/01/2022"
            {...register('manufacturingDate')}
          />
        </S.InputContainer>
        <S.InputContainer>
          <label htmlFor="expirationDate">Data de validade</label>
          <InputMask
            mask="99/99/9999"
            type="text"
            placeholder="Ex: 01/01/2023"
            {...register('expirationDate')}
          />
        </S.InputContainer>
        <S.InputContainer>
          <label htmlFor="price">Preço</label>
          <InputMask
            mask="R$99,99"
            type="string"
            placeholder="R$4,00"
            {...register('price')}
          />
        </S.InputContainer>
        <S.CheckBoxContainer>
          <label htmlFor="perishable">Produto perecível</label>
          <input type="checkbox" {...register('perishable')} />
        </S.CheckBoxContainer>
        <button type="submit">Salvar</button>
        {error && <span>Desculpe, não foi possível criar o produto.</span>}
      </S.Form>
    </>
  )
}

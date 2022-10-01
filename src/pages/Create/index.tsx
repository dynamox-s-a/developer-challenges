import { useEffect, useState } from 'react'

import { useAppDispatch } from '../../store/hooks'
import { createProduct } from '../../store/fetchActions'

import { useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import InputMask from 'react-input-mask'

import * as S from './styles'

const schema = zod.object({
  name: zod.string().min(1),
  manufacturingDate: zod.string(),
  expirationDate: zod.string(),
  price: zod.string(),
  perishable: zod.boolean(),
})

export function Create() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  })

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  function handleCreateProduct(data: any) {
    dispatch(createProduct({ id: String(Date.now()), ...data }))
    navigate('/')
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
            type="text"
            placeholder="R$4,00"
            {...register('price')}
          />
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

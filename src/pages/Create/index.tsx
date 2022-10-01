import { useAppDispatch } from '../../store/hooks'
import { createProduct } from '../../store/fetchActions'

import { useNavigate } from 'react-router-dom'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import * as S from './styles'

const isNotPerishableSchema = zod.object({
  name: zod.string().min(1),
  manufacturingDate: zod.string(),
  price: zod.preprocess((arg) => Number(arg), zod.number()),
  perishable: zod.literal(false),
})

const isPerishableSchema = zod.object({
  name: zod.string().min(1),
  manufacturingDate: zod.string(),
  price: zod.preprocess((arg) => Number(arg), zod.number()),
  perishable: zod.literal(true),
  expirationDate: zod.string(),
})

const FormSchema = zod.discriminatedUnion('perishable', [
  isNotPerishableSchema,
  isPerishableSchema,
])

type FormSchemaType = zod.infer<typeof FormSchema>

export function Create() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
  })

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const handleCreateProduct: SubmitHandler<FormSchemaType> = (data) => {
    dispatch(createProduct({ id: String(Date.now()), ...data }))
    navigate('/')
  }

  const isProductPerishable = watch('perishable')
  const manufacturingDateValue = watch('manufacturingDate')

  return (
    <>
      <h1>Criar produto</h1>
      <S.Form onSubmit={handleSubmit((data) => handleCreateProduct(data))}>
        <S.CheckBoxContainer>
          <label htmlFor="perishable">Produto perecível</label>
          <input type="checkbox" {...register('perishable')} />
        </S.CheckBoxContainer>
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
            type="date"
            placeholder="Ex: 01/01/2022"
            {...register('manufacturingDate')}
          />
        </S.InputContainer>
        <S.InputContainer>
          <label htmlFor="price">Preço (R$)</label>
          <input
            type="number"
            placeholder="4.00"
            {...register('price')}
            step=".01"
          />
        </S.InputContainer>
        {isProductPerishable && (
          <S.InputContainer>
            <label htmlFor="expirationDate">Data de validade</label>
            <input
              type="date"
              placeholder="Ex: 01/01/2023"
              {...register('expirationDate', { shouldUnregister: true })}
              min={String(manufacturingDateValue)}
            />
          </S.InputContainer>
        )}
        <button type="submit" disabled={!isValid}>
          Salvar
        </button>
      </S.Form>
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </>
  )
}

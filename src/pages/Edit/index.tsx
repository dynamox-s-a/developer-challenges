import { useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../store/hooks'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import * as S from './styles'
import { updateProduct } from '../../store/fetchActions'
import { useEffect } from 'react'
import { getProductAction } from '../../store/ducks/products'

const isNotPerishableSchema = zod.object({
  id: zod.string(),
  name: zod.string().min(1),
  manufacturingDate: zod.string(),
  price: zod.preprocess((arg) => Number(arg), zod.number()),
  perishable: zod.literal(false),
})

const isPerishableSchema = zod.object({
  id: zod.string(),
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

// interface Product {
//   id: string
//   name: string
//   manufacturingDate: Date
//   perishable: boolean
//   expirationDate?: Date
//   price: number
// }

export function Edit() {
  const { id } = useParams()
  const product = useAppSelector((state) => state.products.selectedProduct)
  const dispatch = useAppDispatch()

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: product?.perishable
      ? { ...product, perishable: true }
      : { ...product, perishable: false },
  })

  useEffect(() => {
    if (id) dispatch(getProductAction(id))

    if (product?.perishable)
      reset({
        ...product,
        perishable: true,
      })
    else
      reset({
        ...product,
        perishable: false,
      })
  }, [id, product, reset, dispatch])

  const navigate = useNavigate()

  const handleEditProduct: SubmitHandler<FormSchemaType> = (data) => {
    dispatch(updateProduct(data))
    navigate('/')
  }

  const isProductPerishable = watch('perishable')
  const manufacturingDateValue = watch('manufacturingDate')

  return (
    <>
      <h1>Editar produto</h1>
      <S.Form onSubmit={handleSubmit((data) => handleEditProduct(data))}>
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

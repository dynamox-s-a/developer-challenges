import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import { createProduct } from '../redux/products/productsActions';
import { Header } from '../components/header'
import moment from 'moment'

const formatDate = (data) => {
  const originalFormat = 'YYYY-MM-DD';
  const newFormat = 'DD/MM/YYYY';
  const originalMomentObject = moment(data, originalFormat);
  return originalMomentObject.format(newFormat);
}


const notPerishableSchema = z.object({
  name: z.string().min(3),
  price: z.string().nonempty("O preço precisa possuir pelo menos 1 caractere com o valor").transform((arg) => Number(arg)),
  perishable: z.literal(false),
  manufactureDate: z.string().nonempty("Insira a data de fabricação do produto"),
})

const isPerishableSchema = z.object({
  name: z.string().min(3),
  price: z.string().nonempty("O preço precisa possuir pelo menos 1 caractere com o valor").transform((arg) => Number(arg)),
  perishable: z.literal(true),
  manufactureDate: z.string().nonempty("Insira a data de fabricação do produto"),
  expirationDate: z.string().nonempty("Insira a data de validade do produto"),
})

const creationSchema = z.discriminatedUnion('perishable', [
  notPerishableSchema,
  isPerishableSchema,
])

export default function AddProduct() {
  const { register, watch, handleSubmit, formState: { isValid, errors } } = useForm({
    mode: 'onChange',
    resolver: zodResolver(creationSchema),
  })

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreateProduct = (data) => {
    dispatch(createProduct({ 
      ...data,
      manufactureDate: formatDate(data.manufactureDate),
      expirationDate: data.expirationDate ? formatDate(data.expirationDate) : '-',
    }))
    navigate('/')
  }

  const isProductPerishable = watch('perishable')
  const manufacturingDateValue = watch('manufactureDate')

  return (
    <>
      <Header />
      <h1>Criar produto</h1>
      <form onSubmit={handleSubmit((data) => handleCreateProduct(data))}>
        <div>
          <label htmlFor="productName">Nome</label>
          <input
            type="text"
            name="name"
            id="productName"
            placeholder="Ex: Doritos"
            {...register('name')}
          />
        </div>
        {errors.name && <span>{errors.name.message}</span>} 
        <div>
          <label htmlFor="price">Preço (R$)</label>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="5.98"
            {...register('price')}
            required
            min="0"
            step=".01"
          />
        </div>
        {errors.price && <span>{errors.price.message}</span>} 
        <div>
          <label htmlFor="perishable">Produto perecível</label>
          <input 
          type="checkbox" 
          {...register('perishable')} />
        </div>
        <div>
          <label htmlFor="manufactureDate">Data de fabricação</label>
          <input
            type="date"
            name="manufactureDate"
            id="manufactureDate"
            required
            {...register('manufactureDate')}
          />
        </div>
        {errors.manufactureDate && <span>{errors.manufactureDate.message}</span>} 

        {isProductPerishable && (
          <div>
            <label htmlFor="expirationDate">Data de validade</label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              {...register(('expirationDate'), { shouldUnregister: true })}
              min={String(manufacturingDateValue)}
              required
            />
          </div>
        )}
        {errors.expirationDate && <span>{errors.expirationDate.message}</span>} 
        <button type="submit" disabled={!isValid}>
          Salvar
        </button>
      </form>
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </>
  )
}

import { useMutation } from '@tanstack/react-query'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'

import ReactDatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import { FiX } from 'react-icons/fi'
import ReactModal from 'react-modal'
import { toast } from 'react-toastify'
import { Button } from 'src/components/Button'
import { handleEditProduct } from './controller'

export const ModalEdit = ({ modalState, closeModal, product }) => {
  ReactModal.setAppElement('#modal')
  const [modalEditProduct, setModalEditProduct] = modalState
  const [expirationDate, setExpirationDate] = useState(null)
  const [manufactureDate, setManufactureDate] = useState(null)

  const { register, handleSubmit, watch, reset } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const expirationDateValidation = watch('perishable') ? !expirationDate : false

  const { mutate, isLoading } = useMutation(
    async data =>
      handleEditProduct({
        id: product.id,
        ...data,
      }),
    {
      onSuccess: () => {
        closeModal()
        toast('Produto Editado com sucesso!', {
          type: 'success',
        })
      },
    },
  )

  useEffect(() => {
    reset({
      name: product?.name,
      perishable: product?.perishable,
      price: String(product?.price),
    })
    setExpirationDate(
      product?.expirationDate ? new Date(product.expirationDate) : null,
    )
    setManufactureDate(
      product?.manufactureDate ? new Date(product.manufactureDate) : null,
    )
  }, [reset, product])

  return (
    <ReactModal
      isOpen={modalEditProduct.isOpen}
      onRequestClose={() =>
        setModalEditProduct({
          isOpen: false,
          data: null,
        })
      }
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-[1.5rem] mb-4">Modal</h2>
        <button
          onClick={() =>
            setModalEditProduct({
              isOpen: false,
              data: null,
            })
          }
        >
          <FiX
            className="absolute top-2 right-2"
            onClick={() => {
              closeModal()
              reset()
            }}
          />
        </button>
        <form
          className="w-full flex flex-col items-center justify-center gap-3"
          onSubmit={handleSubmit(inputData =>
            mutate({
              ...inputData,
              expirationDate,
              manufactureDate,
            }),
          )}
        >
          <input
            placeholder="Nome"
            className="border w-full px-2 rounded"
            {...register('name')}
          />
          <ReactDatePicker
            className="border w-full px-2 rounded"
            placeholderText="Data de fabricação"
            selected={manufactureDate}
            onChange={date => {
              setManufactureDate(date)
              setExpirationDate(null)
            }}
            maxDate={new Date()}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
          />
          {watch('perishable') && (
            <ReactDatePicker
              className="border w-full px-2 rounded"
              placeholderText="Data de validade"
              selected={expirationDate}
              onChange={date => setExpirationDate(date)}
              minDate={new Date()}
              locale={ptBR}
              dateFormat="dd/MM/yyyy"
            />
          )}
          <input
            placeholder="Preço"
            className="border w-full px-2 rounded"
            value={(watch('price') || '').replace(/\D/g, '')}
            {...register('price')}
          />

          <div className="flex gap-2">
            <label
              className="flex items-center gap-2 text-[1rem]"
              htmlFor="perishable"
            >
              Esse produto é perecível?
            </label>
            <input
              type="checkbox"
              id="perishable"
              defaultChecked={product?.perishable}
              {...register('perishable')}
            />
          </div>
          <Button
            disabled={
              isLoading ||
              !manufactureDate ||
              !watch('name') ||
              !watch('price') ||
              expirationDateValidation
            }
            title="Todos os campos devem ser preenchidos para que o botão seja habilitado"
            isLoading={isLoading}
            type="submit"
          >
            Criar produto
          </Button>
        </form>
      </div>
    </ReactModal>
  )
}

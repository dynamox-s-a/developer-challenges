'use client'

import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { getMachineById, resetError, updateMachine } from 'redux/slices/machinesSlice'
import { notify } from 'redux/slices/notificationSlice'
import MachineForm from 'components/machine-form/MachineForm'
import { Machine } from 'types/machine'
import { useEffect, useState } from 'react'
import PagesHeader from 'components/pages-header/PagesHeader'

export default function EditMachinesPage() {
  const [updateData, setUpdateData] = useState<Machine | undefined>(undefined)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const handleUpdate = async (data: Machine) => {
    try {
      const machine = await dispatch(updateMachine(data)).unwrap()
      if (machine) {
        dispatch(notify({ variant: 'success', message: `Success: ${machine.name} edited` }))
        router.push('/dashboard/machines')
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        enqueueSnackbar(`${error.message}`, {
          variant: 'error',
          anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
        })
        dispatch(resetError({}))
      }
    }
  }

  useEffect(() => {
    const getMachineData = async () => {
      try {
        const machine: Machine = await dispatch(getMachineById(`${id}`)).unwrap()
        setUpdateData(machine)
      } catch (error) {
        if (error && typeof error === 'object' && 'message' in error) {
          enqueueSnackbar(`${error.message}`, {
            variant: 'error',
            anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
          })
        }
      }
    }
    id && getMachineData()
  }, [dispatch, id])

  if (id && !updateData) return null

  return (
    <>
      <PagesHeader title="Edit Machine" />
      <MachineForm onSubmit={handleUpdate} updateData={updateData} />
      <SnackbarProvider />
    </>
  )
}

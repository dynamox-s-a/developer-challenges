'use client'

import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { createMachine, resetError } from 'redux/slices/machinesSlice'
import { notify } from 'redux/slices/notificationSlice'
import MachineForm from 'components/machine-form/MachineForm'
import { type Machine } from 'types/machine'
import PagesHeader from 'components/pages-header/PagesHeader'

export default function CreateMachinesPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleCreate = async (data: Machine) => {
    try {
      const machine = await dispatch(createMachine(data)).unwrap()
      dispatch(notify({ variant: 'success', message: `Success: ${machine.name} added` }))
      router.push('/dashboard/machines')
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

  return (
    <>
      <PagesHeader title="Add Machine" />
      <MachineForm onSubmit={handleCreate} />
      <SnackbarProvider />
    </>
  )
}

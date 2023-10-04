'use client'

import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { createSpot, resetError } from 'redux/slices/spotsSlice'
import { notify } from 'redux/slices/notificationSlice'
import SpotForm from 'components/spot-form/SpotForm'
import { type Spot } from 'types/spot'
import PagesHeader from 'components/pages-header/PagesHeader'

export default function CreateSpotsPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleCreate = async (data: Spot) => {
    try {
      const spot = await dispatch(createSpot(data)).unwrap()
      dispatch(notify({ variant: 'success', message: `Success: ${spot.name} added` }))
      router.push('/dashboard/spots')
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
      <PagesHeader title="Add Spot" />
      <SpotForm onSubmit={handleCreate} />
      <SnackbarProvider />
    </>
  )
}

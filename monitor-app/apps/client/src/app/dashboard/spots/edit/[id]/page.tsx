'use client'

import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { getSpotById, updateSpot } from 'redux/slices/spotsSlice'
import { notify } from 'redux/slices/notificationSlice'
import SpotForm from 'components/spot-form/SpotForm'
import { type Spot } from 'types/spot'
import { useEffect, useState } from 'react'
import PagesHeader from 'components/pages-header/PagesHeader'

export default function EditSpotsPage() {
  const [updateData, setUpdateData] = useState<Spot | undefined>(undefined)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const handleUpdate = async (data: Spot) => {
    try {
      const spot = await dispatch(updateSpot(data)).unwrap()
      if (spot) {
        dispatch(notify({ variant: 'success', message: `Success: ${spot.name} edited` }))
        router.push('/dashboard/spots')
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        enqueueSnackbar(`${error.message}`, {
          variant: 'error',
          anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
        })
      }
    }
  }

  useEffect(() => {
    const getSpotData = async () => {
      try {
        const spot: Spot = await dispatch(getSpotById(`${id}`)).unwrap()
        setUpdateData({ ...spot, sensorId: spot.sensorId.slice(4) })
      } catch (error) {
        if (error && typeof error === 'object' && 'message' in error) {
          enqueueSnackbar(`${error.message}`, {
            variant: 'error',
            anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
          })
        }
      }
    }
    id && getSpotData()
  }, [dispatch, id])

  if (id && !updateData) return null

  return (
    <>
      <PagesHeader title="Edit Spot" />
      <SpotForm onSubmit={handleUpdate} updateData={updateData} />
      <SnackbarProvider />
    </>
  )
}

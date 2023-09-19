'use client'

import { Alert, AlertTitle, Button, Stack } from '@mui/material'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { getSpotById, deleteSpot } from 'redux/slices/spotsSlice'
import { notify } from 'redux/slices/notificationSlice'
import { type Spot } from 'types/spot'
import { useEffect, useState } from 'react'
import PagesHeader from 'components/pages-header/PagesHeader'

export default function DeleteSpotsPage() {
  const [deleteData, setDeleteData] = useState<Spot | undefined>(undefined)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const handleBackClick = () => {
    router.back()
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSpot(id)).unwrap()
      dispatch(
        notify({
          variant: 'success',
          message: `Spot: ${deleteData?.name} deleted`
        })
      )
      router.push('/dashboard/spots')
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
        setDeleteData(spot)
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

  if (id && !deleteData) return null

  return (
    <>
      <PagesHeader title="Delete Spot" />
      <Stack spacing={2} sx={{ padding: '0 16px 16px 16px' }}>
        <Alert severity="warning" color="error">
          <AlertTitle>Warning</AlertTitle>
          Are you sure you want to delete? <br />
          <br /> Spot: {deleteData?.name}
          <br />
          <br />
          <strong>This action is irreversible.</strong>
        </Alert>
        <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button onClick={handleBackClick} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteData?.id as string)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </Stack>
      </Stack>
      <SnackbarProvider />
    </>
  )
}

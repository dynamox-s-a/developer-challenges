'use client'

import { Box, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { createSpot } from 'redux/slices/spotsSlice'
import { notify } from 'redux/slices/notificationSlice'
import SpotForm from 'components/spot-form/SpotForm'
import { Spot } from 'types/spot'

export default function CreateSpotsPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

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
      }
    }
  }

  return (
    <>
      <Box sx={{ backgroundColor: '#ffffff', flexGrow: 1 }}>
        <Stack
          sx={{
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 2
          }}
        >
          <Typography sx={{ flex: '1 1 100%' }} variant="h5" id="tableTitle" component="div">
            Add Spot
          </Typography>
          <IconButton aria-label="back" color="primary" onClick={handleBackClick}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Stack>
        <SpotForm onSubmit={handleCreate} />
        <SnackbarProvider />
      </Box>
    </>
  )
}

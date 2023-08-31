'use client'

import { Box, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { createMachine } from 'redux/slices/machinesSlice'
import { notify } from 'redux/slices/notificationSlice'
import MachineForm from 'components/machine-form/MachineForm'
import { Machine } from 'types/machine'

export default function Machines() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

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
            Add Machine
          </Typography>
          <IconButton aria-label="back" color="primary" onClick={handleBackClick}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Stack>
        <MachineForm onSubmit={handleCreate} />
        <SnackbarProvider />
      </Box>
    </>
  )
}

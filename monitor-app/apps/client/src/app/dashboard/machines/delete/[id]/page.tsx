'use client'

import { Alert, AlertTitle, Box, Button, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { getMachineById, deleteMachine } from 'redux/slices/machinesSlice'
import { notify } from 'redux/slices/notificationSlice'
import { Machine } from 'types/machine'
import { useEffect, useState } from 'react'

export default function DeleteMachinesPage() {
  const [deleteData, setDeleteData] = useState<Machine | undefined>(undefined)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const handleBackClick = () => {
    router.back()
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteMachine(id)).unwrap()
      dispatch(
        notify({
          variant: 'success',
          message: `Machine: ${deleteData?.name} - Type: ${deleteData?.type} deleted`
        })
      )
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

  useEffect(() => {
    const getMachineData = async () => {
      try {
        const machine: Machine = await dispatch(getMachineById(`${id}`)).unwrap()
        setDeleteData(machine)
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

  if (id && !deleteData) return null

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
            Delete Machine
          </Typography>
          <IconButton aria-label="back" color="primary" onClick={handleBackClick}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Stack>
        <Stack spacing={2} sx={{ padding: '0 16px 16px 16px' }}>
          <Alert severity="warning" color="error">
            <AlertTitle>Warning</AlertTitle>
            Are you sure you want to delete? <br />
            <br /> Machine: {deleteData?.name} <br /> Type: {deleteData?.type}
            <br />
            <br />
            <strong>
              All SPOTS associated with this machine will be deleted as well! This action is
              irreversible.
            </strong>
          </Alert>
          <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button onClick={handleBackClick} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(`${deleteData?.id}`)}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Stack>
        </Stack>
        <SnackbarProvider />
      </Box>
    </>
  )
}

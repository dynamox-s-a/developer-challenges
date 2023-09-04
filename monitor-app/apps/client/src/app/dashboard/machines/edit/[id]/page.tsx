'use client'

import { Box, IconButton, Stack, Typography } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { getMachineById, updateMachine } from 'redux/slices/machinesSlice'
import { notify } from 'redux/slices/notificationSlice'
import MachineForm from 'components/machine-form/MachineForm'
import { Machine } from 'types/machine'
import { useEffect, useState } from 'react'

export default function EditMachinesPage() {
  const [updateData, setUpdateData] = useState<Machine | undefined>(undefined)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const handleBackClick = () => {
    router.back()
  }

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
      }
    }
  }

  useEffect(() => {
    const getMachineData = async () => {
      try {
        const machine: Machine = await dispatch(getMachineById(id)).unwrap()
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
            Edit Machine
          </Typography>
          <IconButton aria-label="back" color="primary" onClick={handleBackClick}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Stack>
        <MachineForm onSubmit={handleUpdate} updateData={updateData} />
        <SnackbarProvider />
      </Box>
    </>
  )
}

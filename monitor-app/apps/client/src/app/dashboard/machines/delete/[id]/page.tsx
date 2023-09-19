'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertTitle, Button } from '@mui/material'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch } from 'redux/hooks'
import { getMachineById, deleteMachine } from 'redux/slices/machinesSlice'
import { notify } from 'redux/slices/notificationSlice'
import { type Machine } from 'types/machine'
import PagesHeader from 'components/pages-header/PagesHeader'
import { AlertWrapper } from 'components/alert-wrapper/AlertWrapper'
import { ActionsWrapper } from 'components/actions-wrapper/ActionsWrapper'

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
      <PagesHeader title="Delete Machine" />
      <AlertWrapper>
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
        <ActionsWrapper>
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
        </ActionsWrapper>
      </AlertWrapper>
      <SnackbarProvider />
    </>
  )
}

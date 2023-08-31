'use client'

import { useEffect } from 'react'
import { Box } from '@mui/material'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { getMachines } from 'redux/slices/machinesSlice'
import DataTable from 'components/data-table/DataTable'
import Loading from 'app/loading'
import { notify } from 'redux/slices/notificationSlice'

export default function Machines() {
  const machines = useAppSelector((state) => state.machines.machines)
  const getMachinesStatus = useAppSelector((state) => state.machines.status)
  const getMachinesError = useAppSelector((state) => state.machines.error)
  const notification = useAppSelector((state) => state.notification)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (getMachinesStatus === 'idle') {
      dispatch(getMachines())
    }
  }, [dispatch, getMachinesStatus])

  useEffect(() => {
    if (notification.message) {
      enqueueSnackbar(`${notification.message}`, {
        variant: notification.variant === 'success' ? 'success' : 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
      })
      dispatch(notify({ variant: '', message: '' }))
    }
  }, [dispatch, notification])

  return (
    <>
      <Box sx={{ background: '#ffffff', flexGrow: 1 }}>
        {getMachinesStatus === 'loading' && <Loading />}
        {getMachinesStatus === 'failed' && getMachinesError}
        {getMachinesStatus === 'succeeded' && (
          <DataTable data={[...machines].reverse()} tableTitle={'Machines'} />
        )}
        <SnackbarProvider />
      </Box>
    </>
  )
}

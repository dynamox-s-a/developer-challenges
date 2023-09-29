'use client'

import { useEffect } from 'react'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { getMachines } from 'redux/slices/machinesSlice'
import { notify } from 'redux/slices/notificationSlice'
import DataTable from 'components/data-table/DataTable'
import Loading from 'app/loading'
import NoRegister from 'components/no-register/NoRegister'

export default function Machines() {
  const machines = useAppSelector((state) => state.machines.machines)
  const getMachinesStatus = useAppSelector((state) => state.machines.status)
  const getMachinesError = useAppSelector((state) => state.machines.error)
  const notification = useAppSelector((state) => state.notification)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (machines.length === 0) {
      dispatch(getMachines())
    }
  }, [dispatch, machines.length])

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
      {getMachinesStatus === 'loading' && <Loading />}
      {getMachinesStatus === 'succeeded' && machines.length > 0 ? (
        <DataTable data={[...machines].reverse()} tableTitle={'Machines'} />
      ) : (
        <NoRegister item="machine" />
      )}
      {getMachinesStatus === 'failed' && getMachinesError + 'machines'}
      <SnackbarProvider />
    </>
  )
}

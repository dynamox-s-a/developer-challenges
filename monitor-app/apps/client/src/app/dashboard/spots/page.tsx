'use client'

import { useEffect } from 'react'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { getSpots } from 'redux/slices/spotsSlice'
import { getMachines } from 'redux/slices/machinesSlice'
import { notify } from 'redux/slices/notificationSlice'
import DataTable from 'components/data-table/DataTable'
import Loading from 'app/loading'
import NoRegister from 'components/no-register/NoRegister'

export default function Spots() {
  const spots = useAppSelector((state) => state.spots.spots)
  const getSpotsStatus = useAppSelector((state) => state.spots.status)
  const getSpotsError = useAppSelector((state) => state.spots.error)
  const notification = useAppSelector((state) => state.notification)
  const machines = useAppSelector((state) => state.machines.machines)

  const dispatch = useAppDispatch()

  const prepareToTable = () => {
    const prepared = spots.map((spot) => {
      const machine = machines.find((machine) => machine.id === spot.machineId)
      return {
        id: spot.id,
        name: spot.name,
        machine: machine?.name,
        type: machine?.type,
        sensor: spot.sensorId,
        model: spot.sensorModel
      }
    })
    return prepared
  }

  useEffect(() => {
    dispatch(getSpots())
    dispatch(getMachines())
  }, [dispatch])

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
      {getSpotsStatus === 'loading' && <Loading />}
      {getSpotsStatus === 'failed' && getSpotsError}
      {getSpotsStatus === 'succeeded' && spots.length > 0 && machines.length > 0 && (
        <DataTable data={prepareToTable().reverse()} tableTitle={'Spots'} />
      )}
      {getSpotsStatus === 'succeeded' && spots.length === 0 && <NoRegister item="spot" />}
      <SnackbarProvider />
    </>
  )
}

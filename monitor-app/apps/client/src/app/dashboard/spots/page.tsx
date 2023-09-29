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
  const machines = useAppSelector((state) => state.machines.machines)
  const getMachinesStatus = useAppSelector((state) => state.machines.status)
  const getMachinesError = useAppSelector((state) => state.machines.error)
  const notification = useAppSelector((state) => state.notification)

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
    if (machines.length === 0) {
      dispatch(getMachines())
    }
    if (spots.length === 0) {
      dispatch(getSpots())
    }
  }, [dispatch, machines.length, spots.length])

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
      {getMachinesStatus === 'loading' && <Loading />}

      {getSpotsStatus === 'succeeded' &&
      getMachinesStatus === 'succeeded' &&
      spots.length > 0 &&
      machines.length > 0 ? (
        <DataTable data={prepareToTable().reverse()} tableTitle={'Spots'} />
      ) : (
        <NoRegister item="spot" />
      )}

      {getSpotsStatus === 'failed' && getSpotsError + ' spots '}
      {getMachinesStatus === 'failed' && getMachinesError + ' machines '}
      <SnackbarProvider />
    </>
  )
}

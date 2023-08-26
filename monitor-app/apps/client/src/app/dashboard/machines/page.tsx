'use client'

import { useEffect } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { getMachines } from 'redux/slices/machinesSlice'
import DataTable from 'components/data-table/DataTable'
import Loading from 'app/loading'
import { theme } from 'theme'

export default function Machines() {
  const machines = useAppSelector((state) => state.machines.machines)
  const getMachinesStatus = useAppSelector((state) => state.machines.status)
  const getMachinesError = useAppSelector((state) => state.machines.error)
  const dispatch = useAppDispatch()

  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

  useEffect(() => {
    if (getMachinesStatus === 'idle') {
      dispatch(getMachines())
    }
  }, [dispatch])

  useEffect(() => {
    if (getMachinesError) {
      enqueueSnackbar(getMachinesError, {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
      })
    }
  }, [getMachinesError])

  return (
    <>
      <Box sx={{ backgroundColor: '#fff', flexGrow: 1 }}>
        <SnackbarProvider />
        {/* <h1>machines</h1>
        {machines.map((machine) => (
          <p key={machine.id}>{machine.name}</p>
        ))} */}
        {getMachinesStatus === 'loading' && <Loading />}
        {getMachinesStatus === 'failed' && getMachinesError}
        {getMachinesStatus === 'succeeded' && <DataTable data={machines} tableTitle={'Machines'} />}
      </Box>
    </>
  )
}

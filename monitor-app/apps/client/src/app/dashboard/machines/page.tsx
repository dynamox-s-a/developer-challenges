'use client'

import { useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { getMachines } from 'redux/slices/machinesSlice'
import { notify } from 'redux/slices/notificationSlice'
import DataTable from 'components/data-table/DataTable'
import Loading from 'app/loading'

export default function Machines() {
  const machines = useAppSelector((state) => state.machines.machines)
  const getMachinesStatus = useAppSelector((state) => state.machines.status)
  const getMachinesError = useAppSelector((state) => state.machines.error)
  const notification = useAppSelector((state) => state.notification)
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  useEffect(() => {
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
      <Box sx={{ background: '#ffffff', flexGrow: 1 }}>
        {getMachinesStatus === 'loading' && <Loading />}
        {getMachinesStatus === 'failed' && getMachinesError}
        {getMachinesStatus === 'succeeded' && machines.length > 0 && (
          <DataTable data={[...machines].reverse()} tableTitle={'Machines'} />
        )}
        {getMachinesStatus === 'succeeded' && machines.length === 0 && (
          <>
            <Typography sx={{ padding: 1 }}>
              No machines registered:{' '}
              <Button
                component={Link}
                href={`${pathname}/create`}
                variant="contained"
                startIcon={<AddIcon />}
              >
                machine
              </Button>
            </Typography>
          </>
        )}
        <SnackbarProvider />
      </Box>
    </>
  )
}

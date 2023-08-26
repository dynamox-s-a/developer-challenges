'use client'

import { useEffect } from 'react'
import { Box } from '@mui/material'
import { useSession } from 'next-auth/react'
import { setUser } from 'redux/slices/loginSlice'
import { useAppDispatch } from 'redux/hooks'

export default function Dashboard() {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  useEffect(() => {
    session && dispatch(setUser(session?.user))
  }, [dispatch, session])

  return (
    <>
      <Box sx={{ backgroundColor: '#fff', flexGrow: 1 }}>
        <h1>Dashboard</h1>
      </Box>
    </>
  )
}

'use client'

import { useSession } from 'next-auth/react'
import { Box } from '@mui/material'
import { setUser } from '../../redux/slices/loginSlice'
import { useAppDispatch } from '../../redux/hooks'
import { useEffect } from 'react'

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

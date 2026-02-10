import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { AppRoutes } from './routes/AppRoutes'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { selectAuthToken } from './features/auth/authSelectors'
import { meThunk } from './features/auth/authThunks'

export default function App() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectAuthToken)
  const [isInitialized, setIsInitialized] = useState(!token)

  useEffect(() => {
    if (token && !isInitialized) {
      dispatch(meThunk()).finally(() => {
        setIsInitialized(true)
      })
    }
  }, [token, dispatch, isInitialized])

  if (!isInitialized) {
    return (
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    )
  }

  return <AppRoutes />
}

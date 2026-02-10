import { useEffect } from 'react'
import { AppRoutes } from './routes/AppRoutes'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { selectAuthToken } from './features/auth/authSelectors'
import { meThunk } from './features/auth/authThunks'

export default function App() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectAuthToken)

  useEffect(() => {
    if (token) {
      dispatch(meThunk())
    }
  }, [token, dispatch])

  return <AppRoutes />
}

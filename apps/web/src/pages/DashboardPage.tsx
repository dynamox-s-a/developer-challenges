import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { selectAuthUser } from '../features/auth/authSelectors'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar>
          <Typography sx={{ flex: 1 }} fontWeight={700}>
            Dynamox
          </Typography>
          <Button color='inherit' onClick={() => dispatch(logout())}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Typography variant='h6' gutterBottom>
          Olá, {user?.name ?? 'usuário'}
        </Typography>
        <Typography color='text.secondary'>
          Email: {user?.email ?? '-'}
        </Typography>
      </Box>
    </Box>
  )
}

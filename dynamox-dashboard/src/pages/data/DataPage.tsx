import { useEffect } from 'react'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { loadMeasurements } from '../../modules/measurements/measurementsSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

export function DataPage() {
  const dispatch = useAppDispatch()
  const { error, isLoading } = useAppSelector((state) => state.measurements)

  useEffect(() => {
    dispatch(loadMeasurements())
  }, [dispatch])

  return (
    <Box
      component="main"
      sx={{ bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <Box
        component="header"
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'primary.light',
          padding: '21px 24px 19px',
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          sx={{
            height: '100%',
            maxWidth: (theme) => theme.layout.maxContentWidth,
            mx: 'auto',
          }}
        >
          <Typography color="text.primary" component="h1" variant="h4">
            Analise de Dados
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ padding: '24px' }}>
        <Stack
          spacing={2}
          sx={{
            maxWidth: (theme) => theme.layout.maxContentWidth,
            mx: 'auto',
          }}
        >
          {isLoading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: '16rem' }}
            >
              <CircularProgress size={64} />
            </Stack>
          ) : null}

          {error ? (
            <Alert severity="error" sx={{ alignItems: 'center' }}>
              Não foi possível carregar os dados. {error}
            </Alert>
          ) : null}
        </Stack>
      </Box>
    </Box>
  )
}

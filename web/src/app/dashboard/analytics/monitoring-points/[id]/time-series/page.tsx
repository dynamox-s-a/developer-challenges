'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { format } from 'date-fns'
import { useTimeSeriesRedux } from '@/hooks/api/timeSeries/useTimeSeriesRedux'
import TimeSeriesChart from '@/components/time-series/TimeSeriesChart'
import AddTimeSeriesDataForm from '@/components/time-series/AddSeriesDataForm'
import TimeSeriesTable from '@/components/time-series/TimeSeriesTable'

export default function MonitoringPointTimeSeriesPage() {
  const { id } = useParams()
  const monitoringPointId = id as string

  const {
    data,
    loading,
    error,
    metrics,
    loadTimeSeries,
    loadMetrics,
    deletePoint,
    deleteAll,
  } = useTimeSeriesRedux(monitoringPointId)

  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    if (monitoringPointId) {
      loadTimeSeries(0, 100)
      loadMetrics()
    }
  }, [monitoringPointId, loadTimeSeries, loadMetrics])

  const handleDeletePoint = async (pointId: string) => {
    await deletePoint(pointId)
  }

  const handleDeleteAll = async () => {
    if (
      window.confirm(
        'Tem certeza que deseja deletar TODOS os dados deste ponto?',
      )
    ) {
      await deleteAll()
    }
  }

  const handleFormSuccess = () => {
    loadTimeSeries(0, 100)
    loadMetrics()
  }

  if (loading && data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ m: 2 }}
      >
        {error}
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          gutterBottom
        >
          Série Temporal
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Adicionar Leitura
        </Button>
      </Box>
      {metrics && (
        <Grid
          container
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Grid
            size={{ xs: 12, sm: 6, md: 2.4 }}
            sx={{ flexBasis: '20%', maxWidth: '20%' }}
          >
            <Card>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Total de Leituras
                </Typography>
                <Typography variant="h5">{metrics.count}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6, md: 2.4 }}
            sx={{ flexBasis: '20%', maxWidth: '20%' }}
          >
            <Card>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Média
                </Typography>
                <Typography variant="h5">
                  {metrics.avg?.toFixed(2) ?? '-'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6, md: 2.4 }}
            sx={{ flexBasis: '20%', maxWidth: '20%' }}
          >
            <Card>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Mínimo
                </Typography>
                <Typography variant="h5">{metrics.min ?? '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6, md: 2.4 }}
            sx={{ flexBasis: '20%', maxWidth: '20%' }}
          >
            <Card>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Máximo
                </Typography>
                <Typography variant="h5">{metrics.max ?? '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6, md: 2.4 }}
            sx={{ flexBasis: '20%', maxWidth: '20%' }}
          >
            <Card>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Período
                </Typography>
                <Typography variant="body2">
                  {metrics.firstTimestamp
                    ? format(new Date(metrics.firstTimestamp), 'dd/MM/yyyy')
                    : '-'}{' '}
                  até{' '}
                  {metrics.lastTimestamp
                    ? format(new Date(metrics.lastTimestamp), 'dd/MM/yyyy')
                    : '-'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {data.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={handleDeleteAll}
            disabled={loading}
          >
            Deletar todos os dados
          </Button>
        </Box>
      )}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
        >
          Gráfico de Valores
        </Typography>
        {data.length > 0 ? (
          <TimeSeriesChart data={data} />
        ) : (
          <Typography
            variant="body1"
            sx={{ py: 4, textAlign: 'center' }}
          >
            Nenhum dado disponível para exibir no gráfico.
          </Typography>
        )}
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
        >
          Dados Brutos
        </Typography>
        <TimeSeriesTable
          data={data}
          onDelete={handleDeletePoint}
          loading={loading}
        />
      </Paper>
      <AddTimeSeriesDataForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        monitoringPointId={monitoringPointId}
        onSuccess={handleFormSuccess}
      />
    </Box>
  )
}

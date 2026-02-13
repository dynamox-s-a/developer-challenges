'use client'

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid'
import { IconButton, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import type { TimeSeriesDataPoint } from '@/types/zod/timeSeries'
import { format } from 'date-fns'

interface TimeSeriesTableProps {
  data: TimeSeriesDataPoint[]
  onDelete: (id: string) => void
  loading?: boolean
}

export default function TimeSeriesTable({
  data,
  onDelete,
  loading,
}: TimeSeriesTableProps) {
  const validData = data.filter(
    (item): item is TimeSeriesDataPoint & { _id: string } =>
      item._id !== undefined && item._id !== null,
  )

  const columns: GridColDef<TimeSeriesDataPoint>[] = [
    {
      field: 'timestamp',
      headerName: 'Data/Hora',
      width: 200,
      valueFormatter: ({ value }: { value: Date }) => {
        const date = new Date(value)
        return Number.isNaN(date.getTime())
          ? 'Data inválida'
          : format(date, 'dd/MM/yyyy HH:mm:ss')
      },
    },
    {
      field: 'value',
      headerName: 'Valor',
      width: 120,
    },
    {
      field: 'unit',
      headerName: 'Unidade',
      width: 100,
      valueFormatter: ({ value }: { value: string | null }) => {
        if (!value || value === '') return '--'
        return value
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      renderCell: (params: GridRenderCellParams<TimeSeriesDataPoint>) => {
        const id = params.row._id
        if (!id) return null
        return (
          <IconButton
            color="error"
            onClick={() => onDelete(id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        )
      },
    },
  ]

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={validData}
        getRowId={row => row._id as string}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </Box>
  )
}

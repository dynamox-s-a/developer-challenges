/** biome-ignore-all lint/complexity/noUselessFragments: idk */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: lol*/
'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import {
  DataGrid,
  type GridPaginationModel,
  type GridColDef,
} from '@mui/x-data-grid'
import { Alert, CircularProgress, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { columns as importedColumns } from './DataTableColumns'
import StatsCards from './StatsCards'
import SimpleSplitButton from '@/components/ui/simple-split-button'
import { useMonitoringAnalysis } from './../../../hooks/api/analisys/useMonitoringAnalysis'
import MachineForm from '../forms/MachineForms'

interface TableRow {
  id: string
  machineId: string
  machineName: string
  machineType: string
  monitoringPoint: string
  sensorModel: string
}

export default function DataTable() {
  const router = useRouter()
  const { useAnalysis: fetchData, loading, error } = useMonitoringAnalysis()
  const [rows, setRows] = useState<TableRow[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [stats, setStats] = useState({
    machines: 0,
    sensors: 0,
    monitoringPoints: 0,
  })

  const [formOpen, setFormOpen] = useState(false)
  const [editingMachineId, setEditingMachineId] = useState<string | undefined>()
  const [_editingMachineData, setEditingMachineData] = useState<
    { Name: string; Type: string } | undefined
  >()

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  })

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchData()
      if (response.success && response.data) {
        const items = Array.isArray(response.data)
          ? response.data
          : [response.data]

        const tableRows: TableRow[] = items.map(item => ({
          id: item._id,
          machineId: item.Machine._id,
          machineName: item.Machine?.Name || 'N/A',
          machineType: item.Machine?.Type || 'N/A',
          monitoringPoint: item.Name || 'Não especificado',
          sensorModel: item.Sensor?.Model || 'N/A',
        }))
        setRows(tableRows)

        const uniqueMachines = new Set(
          items.map(i => i.Machine?._id).filter(Boolean),
        )
        const uniqueSensors = new Set(
          items.map(i => i.Sensor?._id).filter(Boolean),
        )
        setStats({
          machines: uniqueMachines.size,
          sensors: uniqueSensors.size,
          monitoringPoints: items.length,
        })
      } else {
        setRows([])
        setStats({ machines: 0, sensors: 0, monitoringPoints: 0 })
      }
    }
    loadData()
  }, [fetchData, refreshTrigger])

  const processedRows = useMemo(() => {
    return rows.map(row => ({
      ...row,
      monitoringPoint: row.monitoringPoint || 'Não especificado',
      sensorModel: row.sensorModel || 'N/A',
    }))
  }, [rows])

  const columns: GridColDef[] = [
    ...importedColumns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 130,
      getActions: ({ row }) => [
        <IconButton
          key="view"
          color="info"
          onClick={() =>
            router.push(
              `/dashboard/analytics/monitoring-points/${row.id}/time-series`,
            )
          }
        >
          <VisibilityIcon />
        </IconButton>,
        <IconButton
          key="edit"
          color="primary"
          onClick={() => {
            setEditingMachineId(row.machineId)
            setEditingMachineData({
              Name: row.machineName,
              Type: row.machineType,
            })
            setFormOpen(true)
          }}
        >
          <EditIcon />
        </IconButton>,
      ],
    },
  ]

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingMachineId(undefined)
    setEditingMachineData(undefined)
  }

  const handleSuccess = () => {
    handleRefresh()
    handleCloseForm()
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  const showError = error && error !== 'Nenhum dado'

  return (
    <>
      <Box
        sx={{
          width: '70%',
          alignSelf: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {showError && (
          <Alert
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          <StatsCards
            countSensors={stats.sensors}
            countMachines={stats.machines}
            countMP={stats.monitoringPoints}
          />
          <SimpleSplitButton
            onMachineCreated={handleRefresh}
            onMonitoringPointCreated={handleRefresh}
            onSensorCreated={handleRefresh}
          />
        </Box>

        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={processedRows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            autoHeight={false}
            loading={loading}
            localeText={{ noRowsLabel: 'Nenhum dado encontrado' }}
            sx={{
              border: 1,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'secondary.light',
                color: 'white',
              },
              '& .MuiDataGrid-cell': {
                borderRight: '1px solid',
                borderColor: 'secondary.light',
              },
              '& .MuiDataGrid-columnHeader': {
                color: 'white',
                backgroundColor: 'secondary.light',
                borderRight: '1px solid',
                borderColor: 'secondary.light',
              },
            }}
          />
        </Box>
      </Box>

      <MachineForm
        open={formOpen}
        onClose={handleCloseForm}
        machineId={editingMachineId}
        onSuccess={handleSuccess}
      />
    </>
  )
}

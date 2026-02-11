"use client"

import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import {
  DataGrid,
  type GridPaginationModel,
} from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { columns, rawRows, stats } from './main.table.fake.data'
import StatsCards from './StatsCards'
import MachineForm from '../forms/MachineForms'

export default function DataTable() {
  const processedRows = useMemo(() => {
    return rawRows.map(row => ({
      ...row,
      monitoringPoint: row.monitoringPoint || 'Não especificado',
      sensorModel: row.sensorModel || 'N/A',
    }))
  }, [])

  const [paginationModel, setPaginationModel]= useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  })

  const [machineForm, setMachineForm] = useState(false)

  return (
    <>
      <Box sx={{ 
        width: '70%', 
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>

        <StatsCards 
          countSensors={stats.sensors}
          countMachines={stats.machines}
          countMP={stats.monitoringPoints}
        />

        <Button
          variant="contained"
          type="submit"
          startIcon={<AddIcon />}
          onClick={() => setMachineForm(true)}
          sx={{
            height: 50,
            minWidth: 50,
            borderRadius: 1,
          }}
          >
            Adicionar
          </Button>
        </Box>

        <Box sx={{ 
          height: 400,
          width: '100%',
        }}>
          <DataGrid
            rows={processedRows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5]} 
            autoHeight={false}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'primary.light',
                color: 'white',
              },
              '& .MuiDataGrid-cell': {
                borderRight: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-columnHeader': {
                color: 'black',
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
          />
        </Box>
      </Box>
      <MachineForm 
        open={machineForm}
        onClose={() => setMachineForm(false)}
      />
    </>
  )
}
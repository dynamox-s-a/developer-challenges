"use client"

import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import {
  DataGrid,
  type GridPaginationModel,
} from '@mui/x-data-grid'
import { columns, rawRows, stats } from './fakeData'
import StatsCards from './StatsCards'
import SimpleSplitButton from '@/components/ui/simple-split-button'

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

        {/* <Button
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
          </Button> */}
          <SimpleSplitButton />
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
    </>
  )
}
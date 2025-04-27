import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useEffect } from 'react'
import { getEvents } from '@/store/thunk/event-thunk'
import { Box, Button, Skeleton, Typography } from '@mui/material'
import { SquarePen, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/format-date'

export default function EventsTable() {
  const { events, isLoading } = useAppSelector((state) => state.events)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEvents())
  }, [dispatch])

  if (events.length === 0) {
    return (
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '56px' }}>
        Desculpe, não encontramos nenhum evento.
      </div>
    )
  }

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rounded" width={'100%'} height={400} />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ borderTop: '1px solid #e8e8e8' }}>
              <TableRow>
                <TableCell>Evento</TableCell>
                <TableCell align="left">Categoria</TableCell>
                <TableCell align="left">Data</TableCell>
                <TableCell align="left">Local</TableCell>
                <TableCell align="left">Descrição</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {events.map((row) => (
                <TableRow key={row.id}>
                  {/* <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}> */}
                  <TableCell component="th" scope="row">
                    <Typography sx={{ fontSize: '12px', fontWeight: '600' }}>
                      {row.event_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        border: '1px solid #7e7e7e',
                        borderRadius: '8px',
                        padding: '4px 8px',
                      }}
                    >
                      <Typography sx={{ fontSize: '12px', fontWeight: '500' }}>
                        {row.category}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: '12px' }}>{formatDate(row.date_time)}</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: '12px' }}>{row.location}</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: '12px' }}>{row.description}</Typography>
                  </TableCell>

                  <TableCell>
                    <Button sx={{ minWidth: '0px' }}>
                      <SquarePen size={16} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button sx={{ minWidth: '0px' }}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}

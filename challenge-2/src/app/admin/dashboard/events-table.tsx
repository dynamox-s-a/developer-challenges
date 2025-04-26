import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Event } from '@/@types/event'

const events: Event[] = [
  {
    id: 1,
    event_name: 'Evento Dynamox',
    date_time: '24 de janeiro 15:00',
    location: 'Florianópolis, SC',
    description: 'A descrição deve ter no mínimo 50 caracteres 1234567',
    category: 'Conferência',
  },
  {
    id: 2,
    event_name: 'Evento Dynamox',
    date_time: '24 de janeiro 15:00',
    location: 'Florianópolis, SC',
    description: 'A descrição deve ter no mínimo 50 caracteres 1234567',
    category: 'Conferência',
  },
]

export default function EventsTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ borderTop: '1px solid #e8e8e8' }}>
          <TableRow>
            <TableCell>Evento</TableCell>
            <TableCell align="right">Data</TableCell>
            <TableCell align="right">Local</TableCell>
            <TableCell align="right">Descrição</TableCell>
            <TableCell align="right">Categoria</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((row) => (
            <TableRow key={row.id}>
              {/* <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}> */}
              <TableCell component="th" scope="row">
                {row.event_name}
              </TableCell>
              <TableCell align="right">{row.date_time}</TableCell>
              <TableCell align="right">{row.location}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
              <TableCell align="right">ícone 1</TableCell>
              <TableCell align="right">ícone 2</TableCell>
              <TableCell align="right">ícone 3</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

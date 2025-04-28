import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useEffect, useState } from 'react'
import { getEvents } from '@/store/thunk/event-thunk'
import { Box, Button, Skeleton, Typography } from '@mui/material'
import { SquarePen, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import { EventModal } from '../../../_components/event-modal'
import { DeleteEventModal } from '../../../_components/delete-event-moda'
import { Event } from '@/@types/event'
import { setSelectedEvent } from '@/store/actions/event-actions'

export default function EventsTable() {
  const { events, selectedEvent, isLoading } = useAppSelector((state) => state.events)
  const [openEventModal, setOpenEventModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const dispatch = useAppDispatch()

  async function handleEditEvent(event: Event) {
    dispatch(setSelectedEvent(event))
    setOpenEventModal(true)
  }

  async function handleDeleteEvent(event: Event) {
    dispatch(setSelectedEvent(event))
    setOpenDeleteModal(true)
  }

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
      {selectedEvent && (
        <EventModal
          open={openEventModal}
          setOpen={setOpenEventModal}
          selectedEvent={selectedEvent}
          mode="edit"
        />
      )}

      {selectedEvent && (
        <DeleteEventModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          selectedEventId={selectedEvent?.id}
        />
      )}

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
              {events.map((event) => {
                console.log('event id na tabela', event.id)

                return (
                  <TableRow key={event.id}>
                    {/* <TableRow key={event.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}> */}
                    <TableCell component="th" scope="event">
                      <Typography sx={{ fontSize: '12px', fontWeight: '600' }}>
                        {event.event_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          border: '1px solid #7e7e7e',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: '12px', fontWeight: '500' }}>
                          {event.category}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: '12px' }}>
                        {formatDate(event.date_time)}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: '12px' }}>{event.location}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: '12px' }}>{event.description}</Typography>
                    </TableCell>

                    {/* BUTTONS */}
                    <TableCell>
                      <Button sx={{ minWidth: '0px' }} onClick={() => handleEditEvent(event)}>
                        <SquarePen size={16} />
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Button sx={{ minWidth: '0px' }} onClick={() => handleDeleteEvent(event)}>
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}

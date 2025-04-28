import { Event } from '@/@types/event'
import { DeleteEventModal } from '@/_components/delete-event-moda'
import { setSelectedEvent } from '@/store/actions/event-actions'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { formatDate } from '@/utils/format-date'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { PencilLineIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { EventModal } from './event-modal'
import { isEventPast } from '@/utils/check-event-date'

interface EventCardProps {
  data: Event
  randomImg: string
}

export function EventCard({ data, randomImg }: EventCardProps) {
  const { isAdmin } = useAppSelector((state) => state.auth)
  const { selectedEvent } = useAppSelector((state) => state.events)
  const [openEventModal, setOpenEventModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const dispatch = useAppDispatch()

  const isPastEvent = isEventPast(data.date_time)

  async function handleEditEvent(event: Event) {
    dispatch(setSelectedEvent(event))
    setOpenEventModal(true)
  }

  async function handleDeleteEvent(event: Event) {
    dispatch(setSelectedEvent(event))
    setOpenDeleteModal(true)
  }

  return (
    <>
      {isAdmin && selectedEvent && (
        <DeleteEventModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          selectedEventId={selectedEvent?.id}
        />
      )}

      {isAdmin && selectedEvent && (
        <EventModal
          open={openEventModal}
          setOpen={setOpenEventModal}
          selectedEvent={selectedEvent}
          mode="edit"
        />
      )}

      <Card
        sx={{ maxWidth: '100%', minWidth: '340px', border: 'none', opacity: isPastEvent ? 0.6 : 1 }}
      >
        <CardMedia sx={{ height: 160 }} image={randomImg} title="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.event_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {data.description}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <CardContent>
            <Button size="small">{formatDate(data.date_time)}</Button>
          </CardContent>

          {isAdmin && (
            <CardActions>
              <Button size="small" sx={{ minWidth: '0px' }} onClick={() => handleEditEvent(data)}>
                <PencilLineIcon size={16} />
              </Button>

              <Button size="small" sx={{ minWidth: '0px' }} onClick={() => handleDeleteEvent(data)}>
                <Trash2 size={15} />
              </Button>
            </CardActions>
          )}
        </Box>
      </Card>
    </>
  )
}
